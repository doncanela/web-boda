import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  NavLink,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  wedding as w,
  hotels,
  hotelCode,
  albaicinAirbnb,
  sagrarioCarmenRoute,
  routes,
  maps,
} from "./config";
import { validateRsvp } from "./validation.mjs";
import "./styles.css";
import { External, Title, Countdown, PageFrame } from "./components";
const links = [
  ["/", "Inicio"],
  ["/la-boda", "La boda"],
  ["/alojamiento", "Alojamiento"],
  ["/turismo", "Granada"],
  ["/dress-code", "Dress code"],
  ["/regalo", "¿Nos quieres ayudar?"],
];
function Home() {
  return (
    <>
      <section className="hero">
        <div className="invitation">
          <p className="eyebrow">¡NOS CASAMOS!</p>
          <h1>
            Paula <span>&</span> Javier
          </h1>
          <p className="date">06 · NOVIEMBRE · 2027</p>
          <div className="small-rule" />
          <p className="hero-copy">
            Los mejores momentos de la vida merecen ser compartidos.
            <br />
            Nos encantará vivir este día contigo.
          </p>
          <div className="hero-venues">
            {w.venues.map((v) => (
              <div key={v.name}>
                <img src={v.illustration} alt="" />
                <p className="italic">{v.name}</p>
                <span>
                  {v.subtitle} · {v.time} h
                </span>
              </div>
            ))}
          </div>
          <Link className="button" to="/rsvp">
            Confirma tu asistencia <span>↗</span>
          </Link>
          <p className="hero-foot">GRANADA, DONDE EMPIEZA TODO</p>
        </div>
        <span className="side-note">
          UN DÍA PARA RECORDAR · UNA VIDA POR DELANTE
        </span>
      </section>
      <section className="count-section">
        <p className="eyebrow">CADA VEZ QUEDA MENOS</p>
        <h2>Para celebrar juntos</h2>
        <Countdown />
      </section>
      <section className="explore">
        <div>
          <p className="eyebrow">CON TODO NUESTRO CARIÑO</p>
          <h2>
            Tu fin de semana
            <br />
            en Granada
          </h2>
          <p>
            Hemos reunido los detalles para que solo tengas que preocuparte de
            disfrutar.
          </p>
        </div>
        <div className="explore-links">
          {links.slice(1).map(([url, label], i) => (
            <Link to={url} key={url}>
              <span>0{i + 1}</span>
              {label}
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
function Wedding() {
  return (
    <>
      <Title eyebrow="EL 6 DE NOVIEMBRE" title="Un día, dos lugares">
        Nuestra ciudad será el escenario. Tú, una parte imprescindible.
      </Title>
      <div className="venue-grid">
        {w.venues.map((v) => (
          <article className="venue" key={v.name}>
            <div className="art-panel">
              <img
                src={v.photo || v.illustration}
                alt={v.photo ? v.name : `Ilustración de ${v.name}`}
              />
            </div>
            <p className="eyebrow">
              {v.subtitle} · {v.time} H
            </p>
            <h2>{v.name}</h2>
            <p>{v.description}</p>
            <p className="address">{v.address}</p>
            <p>{v.directions}</p>
            <div className="link-row">
              <External href={maps(v.name)}>Google Maps</External>
              <External href={maps(v.name, "walking")}>A pie</External>
              <External href={maps(v.name, "driving")}>En taxi</External>
            </div>
            <External href={v.source}>Información del lugar</External>
          </article>
        ))}
      </div>
      <section className="timeline-section">
        <p className="eyebrow">EL MAPA DE NUESTRO DÍA</p>
        <h2>De un sí a mil recuerdos</h2>
        <ol className="timeline">
          {w.timeline.map((t) => (
            <li key={t.title}>
              <span>{t.time}</span>
              <img className="timeline-icon" src={t.icon} alt="" />
              <h3>{t.title}</h3>
              <p>{t.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="transfer">
        <div className="notice">
          <p className="eyebrow">DE LA CEREMONIA A LA CELEBRACIÓN</p>
          <h2>Traslado al Carmen de los Chapiteles</h2>
          <p>
            El trayecto entre el Sagrario y el Carmen de los Chapiteles se
            realizará andando o en taxi. A pie son unos 20 minutos por zona
            empedrada, por lo que recomendamos que las invitadas con tacones y
            las personas a las que les cueste andar vayan en taxi.
          </p>
          <External href={sagrarioCarmenRoute}>Ver ruta</External>
        </div>
      </section>
    </>
  );
}
function CopyCode({
  code,
  label = "código",
  long = false,
}: {
  code: string;
  label?: string;
  long?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={long ? "code-chip long" : "code-chip"}
      aria-label={`Copiar ${label} ${code}`}
      title={copied ? "¡Copiado!" : "Copiar"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      <strong>{code}</strong>
      <svg
        className="copy-icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {copied ? (
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </>
        )}
      </svg>
      <span className="sr-only" role="status">
        {copied ? "¡Copiado!" : ""}
      </span>
    </button>
  );
}
function HotelCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft < 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const move = (dir: number) => {
    const el = track.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (slide.offsetWidth + gap), behavior: "smooth" });
  };
  return (
    <section className="carousel" aria-label="Hoteles recomendados">
      <button
        type="button"
        className="carousel-btn prev"
        aria-label="Hoteles anteriores"
        disabled={edge.start}
        onClick={() => move(-1)}
      >
        ‹
      </button>
      <ul className="carousel-track" ref={track} onScroll={update}>
        {hotels.map((h) => (
          <li className="hotel-slide" key={h.name}>
            <a
              href={h.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${h.name} (se abre en una pestaña nueva)`}
            >
              <img className="hotel-photo" src={h.photo} alt={h.name} />
            </a>
            <h3>{h.name}</h3>
            <p>{h.distance} a pie de la parroquia del Sagrario</p>
            <External href={h.walkUrl}>Trayecto a pie</External>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="carousel-btn next"
        aria-label="Hoteles siguientes"
        disabled={edge.end}
        onClick={() => move(1)}
      >
        ›
      </button>
    </section>
  );
}
function Stay() {
  return (
    <>
      <Title eyebrow="QUÉDATE UN POQUITO MÁS" title="Como en casa">
        Una escapada a Granada empieza por encontrar tu rincón.
      </Title>
      <HotelCarousel />
      <div className="discount">
        <p>Descuento extra en los hoteles mostrados al introducir el código</p>
        <CopyCode code={hotelCode} />
      </div>
      <div className="cards two">
        <article className="card">
          <p className="eyebrow">CERCA DE LA CEREMONIA</p>
          <h2>Centro & Catedral</h2>
          <p>
            Áurea Catedral, Eurostars Gran Vía y Eurostars Puerta Real están muy
            cerca del Sagrario de la Catedral, donde es la ceremonia: puedes ir
            andando fácilmente, en menos de 5 minutos. Eurostars San Antón está
            más apartado (a 1 km), así que tenlo en cuenta si quieres llegar a
            pie.
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">CON ENCANTO GRANADINO</p>
          <h2>Albaicín & Realejo</h2>
          <p>
            No hay hoteles con descuento en esta zona. Albaicín y Realejo son
            los barrios más bonitos de Granada, pero pueden ser de difícil
            acceso (incluso inaccesibles para taxis) y su empedrado puede ser
            incómodo con tacones. Aun así, te dejamos este enlace por si quieres
            ver alojamientos en el Albaicín.
          </p>
          <External href={albaicinAirbnb}>Airbnb en el Albaicín</External>
        </article>
      </div>
    </>
  );
}
function Tourism() {
  const [filter, setFilter] = useState("Todas");
  return (
    <>
      <Title
        eyebrow="NUESTRA CIUDAD, TU ESCAPADA"
        title="Granada se disfruta despacio"
      >
        Entre calles con historia, miradores y una buena conversación alrededor
        de una mesa.
      </Title>
      <div className="filter" aria-label="Filtrar rutas por duración">
        {["Todas", "2 horas", "Medio día"].map((x) => (
          <button
            key={x}
            aria-pressed={filter === x}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="cards">
        {routes
          .filter((r) => filter === "Todas" || r.duration === filter)
          .map((r, i) => (
            <article className="card route-card" key={r.title}>
              <span className="route-number">0{i + 1}</span>
              <p className="eyebrow">{r.duration} · DURACIÓN ORIENTATIVA</p>
              <h2>{r.title}</h2>
              <p>{r.description}</p>
              <External href={r.url}>
                {r.title.startsWith("La Alhambra")
                  ? "Entradas oficiales"
                  : "Turismo de Granada"}
              </External>
              <br />
              <External
                href={
                  "https://www.google.com/maps/dir/" +
                  r.stops.split("|").map(encodeURIComponent).join("/")
                }
              >
                Ver recorrido
              </External>
            </article>
          ))}
      </div>
      <div className="editorial-note">
        <div>
          <h2>Un consejo de casa</h2>
          <p>
            Deja hueco para improvisar. Lleva calzado cómodo para el Albaicín y
            reserva la Alhambra a través del Patronato. Revisa siempre las
            condiciones de tu entrada y los horarios cerca de la fecha del
            viaje.
          </p>
          <h3>Granada también se saborea</h3>
          <p>
            Tapas, habas con jamón y un pionono para terminar. Nuestra selección
            personal de bares y restaurantes está pendiente de confirmar; la
            añadiremos aquí con sus enlaces.
          </p>
        </div>
      </div>
    </>
  );
}
function Gift() {
  return (
    <div className="narrow">
      <Title
        eyebrow="EL MEJOR REGALO ES COMPARTIRLO"
        title="Nuestra nueva etapa"
      >
        Que estés con nosotros es lo que más ilusión nos hace.
      </Title>
      <div className="gift-copy">
        <p>
          Si además quieres tener un detalle, preferimos una aportación para
          seguir construyendo nuestra vida juntos.
        </p>
        <p>
          Gracias por formar parte de nuestra historia y de todo lo que está por
          venir.
        </p>
        <CopyCode code={w.iban} label="cuenta" long />
        <p className="signature">Con cariño, Paula & Javier</p>
      </div>
    </div>
  );
}
function Dress() {
  return (
    <>
      <header className="page-title">
        <h1>Una ocasión especial merece su mejor versión</h1>
        <p className="intro">
          Nos hace mucha ilusión compartir con vosotros un día tan especial y
          queremos que la elegancia nos acompañe en cada momento de la
          celebración.
        </p>
        <p className="intro">
          El código de vestimenta de nuestra boda será de{" "}
          <strong>etiqueta formal</strong>.
        </p>
      </header>
      <div className="dress-layout">
        <div className="dress-art">
          <img
            src="/illustrations/dress-code.webp"
            alt="Ilustración de una mujer con vestido largo y chal, y un hombre con traje oscuro"
          />
        </div>
        <div className="dress-text">
          <h3>Para ellos</h3>
          <p>
            Traje en tonos oscuros, camisa, corbata y zapatos de vestir.
            Apostamos por una elegancia clásica y atemporal.
          </p>
          <h3>Para ellas</h3>
          <p>
            Vestidos elegantes y de fiesta, acordes con la ocasión. Os pedimos
            reservar el blanco, el marfil y los tonos similares para la novia.
          </p>
          <h3>Un abrigo que acompañe</h3>
          <p>
            Noviembre en Granada tiene un encanto especial, pero también
            temperaturas frescas al caer la tarde. Os recomendamos llevar un
            abrigo o una prenda de entretiempo que complemente vuestro conjunto
            y os permita disfrutar de los espacios exteriores del Carmen de los
            Chapiteles.
          </p>
          <h3>Zapatos para disfrutar</h3>
          <p>
            Las calles empedradas, las cuestas y los jardines forman parte del
            encanto de Granada. Un tacón ancho o un calzado elegante y estable
            será vuestro mejor aliado para disfrutar de principio a fin.
          </p>
        </div>
      </div>
    </>
  );
}
function RSVP() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 5000);
    return () => clearTimeout(t);
  }, [done]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f));
    const payload = {
      ...data,
      consent: data.consent === "on",
      sensitiveConsent: data.sensitiveConsent === "on",
    };
    const result = validateRsvp(payload);
    if (!result.ok) {
      setMessage(result.error || "Revisa los datos.");
      return;
    }
    if (!w.rsvpEnabled) {
      setMessage(
        "El formulario todavía no está abierto. No se ha enviado ni guardado ningún dato.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw Error();
      setDone(true);
      f.reset();
      setMessage(
        "¡Gracias! Hemos recibido tu confirmación. Un envío repetido con el mismo email no modifica tus datos.",
      );
    } catch {
      setMessage(
        "No hemos podido confirmar el registro. Puedes volver a intentarlo; no se duplicará tu respuesta.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="narrow">
      <Title eyebrow="NOS HARÁ MUCHA ILUSIÓN VERTE" title="¿Nos acompañas?">
        Un día especial lo hacen las personas que lo comparten.
      </Title>
      {!w.rsvpEnabled && (
        <p className="notice compact">
          Formulario en preparación. Puedes explorar los campos, pero todavía no
          se enviarán datos.
        </p>
      )}
      <form onSubmit={submit} className="rsvp-form">
        <div className="form-row">
          <label>
            Nombre *
            <input
              name="firstName"
              autoComplete="given-name"
              required
              maxLength={80}
            />
          </label>
          <label>
            Apellidos *
            <input
              name="lastName"
              autoComplete="family-name"
              required
              maxLength={120}
            />
          </label>
        </div>
        <label>
          Email *
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Alergias o intolerancias <span>(opcional)</span>
          <textarea name="allergies" maxLength={1000} rows={3} />
        </label>
        <p className="field-help">
          Indica solo lo necesario para adaptar la comida. No incluyas informes
          ni otros datos médicos.
        </p>
        <label className="checkbox">
          <input type="checkbox" name="consent" required />
          He leído el <Link to="/privacidad">aviso de privacidad</Link> y acepto
          el tratamiento para gestionar mi asistencia. *
        </label>
        <label className="checkbox">
          <input type="checkbox" name="sensitiveConsent" />
          Si indico alergias, autorizo expresamente su uso y comunicación al
          catering para preparar mi comida.
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            No rellenar
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="button" disabled={busy || done}>
          {busy
            ? "Enviando…"
            : done
              ? "Confirmación enviada"
              : "Confirmar mi asistencia"}{" "}
          <span>↗</span>
        </button>
        <p role="status" aria-live="polite">
          {message}
        </p>
        <p className="field-help">
          Para corregir una confirmación, contacta directamente con Paula o
          Javier.
        </p>
      </form>
    </div>
  );
}
function Privacy() {
  return (
    <div className="narrow prose">
      <Title eyebrow="TU INFORMACIÓN, CON CUIDADO" title="Privacidad" />
      <p>
        Este aviso es un borrador y debe completarse antes de activar el
        formulario.
      </p>
      <h2>Para qué usamos tus datos</h2>
      <p>
        Paula y Javier gestionarán nombre, apellidos y email para organizar la
        asistencia. Las alergias son opcionales y solo se usarán, con tu
        autorización expresa, para adaptar la comida y comunicar lo
        imprescindible al catering.
      </p>
      <h2>Acceso y conservación</h2>
      <p>
        Las respuestas se almacenarán en una hoja privada de Google, accesible
        únicamente a los organizadores autorizados. No se publicarán listados de
        invitados. Está previsto borrar las respuestas como máximo 90 días
        después de la boda, incluyendo copias y exportaciones; los organizadores
        deben realizar y comprobar ese borrado.
      </p>
      <h2>Tus decisiones</h2>
      <p>
        Puedes retirar el consentimiento o solicitar acceso, corrección y
        supresión contactando con los organizadores. Contacto:{" "}
        {w.privacyContact ||
          "pendiente de facilitar; el formulario seguirá cerrado hasta completarlo"}
        .
      </p>
      <p>
        Pendiente antes de apertura: identificar a los responsables, contacto,
        proveedor de catering, condiciones de los proveedores y revisar este
        aviso. No usamos analítica ni cookies publicitarias. Los enlaces a mapas
        y otros servicios solo se abren cuando los eliges.
      </p>
    </div>
  );
}
function App() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    document.title = `${[...links, ["/rsvp", "Confirma tu asistencia"], ["/privacidad", "Privacidad"]].find(([p]) => p === loc.pathname)?.[1] || "Página no encontrada"} · Paula & Javier`;
    document.getElementById("main")?.focus();
  }, [loc.pathname]);
  return (
    <>
      <PageFrame />
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <header className="site-header">
        <Link to="/" className="monogram" aria-label="Paula y Javier, inicio">
          P<span>&</span>J
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="navigation"
        >
          {open ? "Cerrar ✕" : "Menú ☰"}
        </button>
        <nav
          id="navigation"
          className={open ? "open" : ""}
          aria-label="Navegación principal"
        >
          {links.map(([p, l]) => (
            <NavLink key={p} to={p} end>
              {l}
            </NavLink>
          ))}
          <NavLink className="nav-rsvp" to="/rsvp">
            Confirmar asistencia ↗
          </NavLink>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/la-boda" element={<Wedding />} />
          <Route path="/alojamiento" element={<Stay />} />
          <Route path="/turismo" element={<Tourism />} />
          <Route path="/dress-code" element={<Dress />} />
          <Route path="/regalo" element={<Gift />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route
            path="*"
            element={
              <Title
                eyebrow="ESTE CAMINO NO LLEVA A LA BODA"
                title="Página no encontrada"
              >
                <Link to="/">Volver al inicio</Link>
              </Title>
            }
          />
        </Routes>
      </main>
      <footer>
        <p className="signature">Paula & Javier</p>
        <p className="eyebrow">06.11.2027 · GRANADA</p>
        <div>
          <span>Hecho con mucha ilusión</span>
          <Link to="/privacidad">Privacidad</Link>
        </div>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
