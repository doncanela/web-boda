import React, { useEffect, useLayoutEffect, useState } from "react";
import { wedding as w } from "./config";

/* Marco simétrico: cuatro esquinas con granada y ramas que crecen desde las
   esquinas. La mitad izquierda/superior se dibuja una vez y la otra mitad es su
   espejo exacto (CSS scale(-1)), así el marco es simétrico a cualquier tamaño. */
const SPRIG = {
  1: { w: 82, h: 322 },
  2: { w: 65, h: 254 },
  3: { w: 55, h: 163 },
} as const;
type SprigId = keyof typeof SPRIG;
const POMEGRANATE = { w: 145, h: 221 };
const SRC_UNIT = 150; // píxeles de origen equivalentes al grosor de la banda
const TOP_ORDER: SprigId[] = [3, 1, 2];
const SIDE_ORDER: SprigId[] = [2, 1, 3];

function pickSprigs(
  space: number,
  unit: number,
  order: SprigId[],
  gap: number,
) {
  const items: SprigId[] = [];
  let used = 0;
  for (let i = 0; i < 40; i++) {
    const id = order[i % order.length];
    const len = SPRIG[id].h * unit;
    const next = used + len + (items.length ? gap : 0);
    if (next > space) break;
    items.push(id);
    used = next;
  }
  return items;
}

export function PageFrame() {
  const [vp, setVp] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const t = vp.w <= 800 ? 34 : 56;
  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--frame", t + "px");
  }, [t]);
  const unit = t / SRC_UNIT;
  const cornerW = POMEGRANATE.w * unit;
  const cornerH = POMEGRANATE.h * unit;
  const tip = t * 0.2;
  const gap = t * 0.3;
  const topItems = pickSprigs(vp.w / 2 - cornerW - tip, unit, TOP_ORDER, gap);
  const sideItems = pickSprigs(
    vp.h / 2 - cornerH - tip,
    unit,
    SIDE_ORDER,
    gap,
  );
  const horizontal = topItems.map((id, i) => (
    <img
      key={i}
      src={`/illustrations/marco/flor${id}-h.png`}
      width={SPRIG[id].h * unit}
      height={SPRIG[id].w * unit}
      alt=""
    />
  ));
  const vertical = sideItems.map((id, i) => (
    <img
      key={i}
      src={`/illustrations/marco/flor${id}-v.png`}
      width={SPRIG[id].w * unit}
      height={SPRIG[id].h * unit}
      alt=""
    />
  ));
  const padX = { paddingLeft: cornerW, paddingRight: tip };
  const padY = { paddingTop: cornerH, paddingBottom: tip };
  return (
    <div className="page-frame" aria-hidden="true">
      {["top", "bottom"].map((side) => (
        <div key={side} className={"pf-edge pf-" + side}>
          <div className="pf-half" style={padX}>
            {horizontal}
          </div>
          <div className="pf-half pf-mirror-x" style={padX}>
            {horizontal}
          </div>
        </div>
      ))}
      {["left", "right"].map((side) => (
        <div key={side} className={"pf-edge pf-" + side}>
          <div className="pf-half" style={padY}>
            {vertical}
          </div>
          <div className="pf-half pf-mirror-y" style={padY}>
            {vertical}
          </div>
        </div>
      ))}
      {["tl", "tr", "bl", "br"].map((c) => (
        <img
          key={c}
          className={"pf-corner pf-" + c}
          src="/illustrations/marco/granada-esquina.png"
          width={cornerW}
          height={cornerH}
          alt=""
        />
      ))}
    </div>
  );
}
export function External({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children} ↗
    </a>
  );
}
export function Title({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="intro">{children}</p>}
    </header>
  );
}
export function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, Math.floor((Date.parse(w.date) - now) / 1000));
  return (
    <div className="countdown" aria-label="Cuenta atrás hasta la ceremonia">
      {[
        Math.floor(left / 86400),
        Math.floor(left / 3600) % 24,
        Math.floor(left / 60) % 60,
        left % 60,
      ].map((n, i) => (
        <div key={i}>
          <strong>{String(n).padStart(2, "0")}</strong>
          <span>{["días", "horas", "minutos", "segundos"][i]}</span>
        </div>
      ))}
    </div>
  );
}
