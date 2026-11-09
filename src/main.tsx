import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  NavLink,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { wedding as w, hotels, routes, transport, maps } from "./config";
import { validateRsvp } from "./validation.mjs";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/great-vibes/latin-400.css";
import "./styles.css";
import { External, Title, Countdown, PageFrame } from "./components";
let invitationInMemory = "";
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
              <h3>{t.title}</h3>
              <p>{t.detail}</p>
            </li>
          ))}
        </ol>
        <p className="muted">
          Los horarios de comida y fiesta se confirmarán más adelante.
        </p>
      </section>
    </>
  );
}
function Stay() {
  return (
    <>
      <Title eyebrow="QUÉDATE UN POQUITO MÁS" title="Como en casa">
        Una escapada a Granada empieza por encontrar tu rincón.
      </Title>
      {hotels.length ? (
        <div className="cards">
          {hotels.map((h) => (
            <article className="card" key={h.name}>
              {h.photo && (
                <img className="hotel-photo" src={h.photo} alt={h.name} />
              )}
              <h2>{h.name}</h2>
              <p>{h.address}</p>
              <p>{h.note}</p>
              <p>
                Código: <strong>{h.code}</strong>
              </p>
              <External href={h.url}>Reservar</External>
            </article>
          ))}
        </div>
      ) : (
        <div className="notice">
          <p className="eyebrow">ESTAMOS PREPARANDO TU ESTANCIA</p>
          <h2>Próximamente, nuestros hoteles</h2>
          <p>
            Aquí encontrarás los alojamientos con los que acordemos descuentos,
            sus condiciones y códigos de reserva.
          </p>
        </div>
      )}
      <div className="cards two">
        <article className="card">
          <p className="eyebrow">CERCA DE LA CEREMONIA</p>
          <h2>Centro & Catedral</h2>
          <p>
            Nuestra propuesta para tener la ceremonia a mano y pasear por el
            centro. Comprueba la ubicación concreta y el acceso en taxi antes de
            reservar.
          </p>
        </article>
        <article className="card">
          <p className="eyebrow">CON ENCANTO GRANADINO</p>
          <h2>Albaicín & Realejo</h2>
          <p>
            Para disfrutar del ambiente de barrio. Revisa cuestas, escaleras y
            accesibilidad: una ubicación preciosa también puede venir con un
            pequeño entrenamiento.
          </p>
        </article>
      </div>
      <h2 className="section-heading">Moverse por Granada</h2>
      <div className="cards">
        {transport.map((t) => (
          <article className="card" key={t.title}>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
            <External href={t.url}>Información oficial</External>
          </article>
        ))}
      </div>
      <p className="muted">
        Paradas de taxi y conexiones concretas: pendientes de seleccionar los
        hoteles. No se requiere reserva de transporte para la boda.
      </p>
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
  const [status, setStatus] = useState("");
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
        {w.iban ? (
          <>
            <p className="iban">{w.iban}</p>
            <button
              className="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(w.iban);
                  setStatus("Cuenta copiada");
                } catch {
                  setStatus(
                    "No se pudo copiar. Selecciona la cuenta y cópiala manualmente.",
                  );
                }
              }}
            >
              Copiar cuenta
            </button>
            <p role="status">{status}</p>
          </>
        ) : (
          <p className="pending">
            Compartiremos los datos de la cuenta más adelante.
          </p>
        )}
        <p className="signature">Con cariño, Paula & Javier</p>
      </div>
    </div>
  );
}
function Dress() {
  return (
    <>
      <Title
        eyebrow="ELEGANTES, CÓMODOS, MUY VOSOTROS"
        title="Vestirse para celebrar"
      >
        Noviembre en Granada tiene su encanto. Y, al caer el sol, también su
        fresquito.
      </Title>
      <div className="dress-layout">
        <div className="dress-art">
          <img
            src="/illustrations/wardrobe.svg"
            alt="Ejemplo orientativo: vestido con abrigo y traje con abrigo"
          />
          <span>INSPIRACIÓN, NO UNA ETIQUETA OBLIGATORIA</span>
        </div>
        <div>
          <p className="eyebrow">EL ESTILO DEL DÍA</p>
          <h2>
            Un toque especial,
            <br />a tu manera
          </h2>
          <p>
            {w.dressCode ||
              "Nuestra etiqueta y preferencias de vestimenta están pendientes de confirmar. Las compartiremos aquí."}
          </p>
          <h3>Un abrigo que acompañe</h3>
          <p>
            Piensa en capas que puedas quitar durante el día y recuperar por la
            noche. En exteriores puede hacer frío.
          </p>
          <h3>Zapatos para disfrutar</h3>
          <p>
            Ten en cuenta las calles empedradas y las cuestas. Un tacón ancho o
            un calzado estable hará el paseo más cómodo.
          </p>
        </div>
      </div>
      <div className="climate">
        <div>
          <strong>17 °C</strong>
          <span>Máxima media</span>
        </div>
        <div>
          <strong>4,2 °C</strong>
          <span>Mínima media</span>
        </div>
        <p>
          Referencia histórica de noviembre: estación Granada Aeropuerto, AEMET
          (1981–2010). No es una previsión para la boda ni una medición del
          Carmen. Consulta el pronóstico cuando se acerque la fecha.
          <br />
          <External href="https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=5530E">
            Fuente AEMET
          </External>
        </p>
      </div>
    </>
  );
}
function RSVP() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [token] = useState(() => {
    invitationInMemory =
      new URLSearchParams(location.hash.slice(1)).get("invitacion") ||
      invitationInMemory;
    return invitationInMemory;
  });
  useEffect(() => {
    if (location.hash) history.replaceState(null, "", location.pathname);
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f));
    const payload = {
      ...data,
      consent: data.consent === "on",
      sensitiveConsent: data.sensitiveConsent === "on",
      invitation: token,
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
        "Solicitud procesada. Si tu invitación era válida, tu asistencia ha quedado registrada. Un envío repetido no modifica tus datos.",
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
              ? "Solicitud procesada"
              : "Confirmar mi asistencia"}{" "}
          <span>↗</span>
        </button>
        <p role="status" aria-live="polite">
          {message}
        </p>
        <p className="field-help">
          La invitación es individual. Para corregir una confirmación, contacta
          directamente con Paula o Javier.
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
