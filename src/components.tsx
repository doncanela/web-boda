import React, { useEffect, useState } from "react";
import { wedding as w } from "./config";
export function Flower({ className = "" }: { className?: string }) {
  return (
    <img
      className={"flower " + className}
      src="/illustrations/granada.svg"
      alt=""
    />
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
      <Flower />
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
