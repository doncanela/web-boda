import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateRsvp } from "../src/validation.mjs";
import { onRequestPost } from "../functions/api/rsvp.js";
const good = {
  firstName: " Ana ",
  lastName: "Prueba",
  email: " ANA@example.com ",
  allergies: "",
  consent: true,
};
test("normaliza email y nombres", () =>
  assert.equal(validateRsvp(good).data.email, "ana@example.com"));
test("rechaza email, vacíos, tamaños y tipos incorrectos", () => {
  for (const p of [
    { email: "bad" },
    { firstName: " " },
    { lastName: "a".repeat(121) },
    { allergies: [] },
    { consent: false },
  ])
    assert.equal(validateRsvp({ ...good, ...p }).ok, false);
});
test("alergias requieren consentimiento explícito", () => {
  assert.equal(validateRsvp({ ...good, allergies: "Test" }).ok, false);
  assert.equal(
    validateRsvp({ ...good, allergies: "Test", sensitiveConsent: true }).ok,
    true,
  );
});
test("API cerrada sin configuración", async () =>
  assert.equal(
    (
      await onRequestPost({
        request: new Request("https://example.com/api/rsvp", {
          method: "POST",
        }),
        env: {},
      })
    ).status,
    503,
  ));
test("API rechaza origen ajeno y cuerpos demasiado grandes", async () => {
  const env = {
    RSVP_ENABLED: "true",
    APPS_SCRIPT_URL: "https://example.com",
    RSVP_SHARED_SECRET: "test",
    SITE_ORIGIN: "https://wedding.example",
  };
  assert.equal(
    (
      await onRequestPost({
        request: new Request("https://example.com", { method: "POST" }),
        env,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await onRequestPost({
        request: new Request("https://example.com", {
          method: "POST",
          headers: {
            Origin: env.SITE_ORIGIN,
            "Content-Type": "application/json",
          },
          body: "x".repeat(9000),
        }),
        env,
      })
    ).status,
    413,
  );
});
function harness() {
  const token = "a".repeat(64);
  const rows = [
    [
      "Nombre",
      "Apellidos",
      "Email",
      "Alergias o intolerancias",
      "Fecha de registro",
    ],
  ];
  const props = {
    RSVP_ENABLED: "true",
    SHARED_SECRET: "test",
    INVITATIONS_JSON: JSON.stringify({
      [createHash("sha256").update(token).digest("hex")]: "ana@example.com",
    }),
  };
  const sheet = {
    getLastRow: () => rows.length,
    getRange: (r, c, n, w) => ({
      getValues: () =>
        rows.slice(r - 1, r - 1 + n).map((row) => row.slice(c - 1, c - 1 + w)),
    }),
    appendRow: (r) => rows.push(r),
  };
  const ctx = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (k) => props[k] }),
    },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }) },
    Utilities: {
      DigestAlgorithm: { SHA_256: "sha256" },
      computeDigest: (_, v) =>
        Array.from(createHash("sha256").update(v).digest()),
    },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (s) => ({ setMimeType: () => JSON.parse(s) }),
    },
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
    },
  });
  vm.runInContext(
    readFileSync(new URL("../server/Code.gs", import.meta.url), "utf8"),
    ctx,
  );
  return {
    rows,
    send: (p) =>
      ctx.doPost({
        postData: {
          contents: JSON.stringify({
            ...good,
            email: "ana@example.com",
            secret: "test",
            invitation: token,
            ...p,
          }),
        },
      }),
  };
}
test("Apps Script insert-only, normalisation, invalid token and no overwrite", () => {
  const h = harness();
  assert.equal(h.send({}).ok, true);
  assert.equal(h.rows.length, 2);
  h.send({ email: " ANA@EXAMPLE.COM ", firstName: "Changed" });
  assert.equal(h.rows.length, 2);
  assert.equal(h.rows[1][0], "Ana");
  h.send({ email: "other@example.com" });
  assert.equal(h.rows.length, 2);
});
test("Apps Script guards secrets, consent and formula injection", () => {
  const h = harness();
  assert.equal(h.send({ secret: "wrong" }).ok, false);
  assert.equal(h.send({ allergies: "Test" }).ok, false);
  h.send({ firstName: '=IMPORTXML("x")' });
  assert.ok(h.rows[1][0].startsWith("'="));
});
