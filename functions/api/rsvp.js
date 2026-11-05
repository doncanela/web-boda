import { validateRsvp } from "../../src/validation.mjs";
const reply = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
export async function onRequestPost({ request, env }) {
  if (
    env.RSVP_ENABLED !== "true" ||
    !env.APPS_SCRIPT_URL ||
    !env.RSVP_SHARED_SECRET ||
    !env.SITE_ORIGIN
  )
    return reply(503, { ok: false });
  if (request.headers.get("Origin") !== env.SITE_ORIGIN)
    return reply(403, { ok: false });
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return reply(415, { ok: false });
  // Bound streamed bodies too; Content-Length alone is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, { ok: false });
  let bytes = 0;
  const parts = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > 8192) {
      await reader.cancel();
      return reply(413, { ok: false });
    }
    parts.push(value);
  }
  let data;
  try {
    const all = new Uint8Array(bytes);
    let offset = 0;
    for (const part of parts) {
      all.set(part, offset);
      offset += part.length;
    }
    data = JSON.parse(new TextDecoder().decode(all));
  } catch {
    return reply(400, { ok: false });
  }
  const validated = validateRsvp(data);
  if (!validated.ok) return reply(400, { ok: false });
  if (data.website) return reply(200, { ok: true });
  if (
    typeof data.invitation !== "string" ||
    !/^[a-f0-9]{64}$/.test(data.invitation)
  )
    return reply(403, { ok: false });
  try {
    const upstream = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validated.data,
        invitation: data.invitation,
        secret: env.RSVP_SHARED_SECRET,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await upstream.json();
    if (!upstream.ok || !result.ok) return reply(502, { ok: false });
    return reply(200, { ok: true });
  } catch {
    return reply(502, { ok: false });
  }
}
export const onRequestGet = () => reply(405, { ok: false });
