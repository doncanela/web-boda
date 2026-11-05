export const wedding = {
  names: "Paula & Javier",
  date: "2027-11-06T12:00:00+01:00",
  dateLabel: "6 de noviembre de 2027",
  city: "Granada",
  iban: "",
  dressCode: "",
  privacyContact: "",
  rsvpEnabled: false,
  venues: [
    {
      name: "Sagrario de la Catedral",
      subtitle: "La ceremonia",
      time: "12:00",
      address: "Calle Oficios, s/n · 18001 Granada",
      verified: true,
      source: "https://www.sacramentalsagrariogr.com/parroquia",
      illustration: "/illustrations/ceremony.svg",
      photo: "",
      description: "En el corazón de Granada, donde empieza nuestro sí.",
      directions:
        "El entorno de la Catedral es peatonal. Si vienes en taxi, acuerda con el conductor un punto de bajada cercano y accesible.",
    },
    {
      name: "Carmen de los Chapiteles",
      subtitle: "La celebración",
      time: "13:30",
      address:
        "Dirección y acceso exacto pendientes de confirmar con el Carmen",
      verified: false,
      source:
        "https://turismo.granada.org/es/empresas/otras-salas-reuniones/carmen-chapiteles",
      illustration: "/illustrations/carmen.svg",
      photo: "",
      description:
        "A los pies de la Alhambra, para brindar, compartir y bailar.",
      directions:
        "Consulta el recorrido antes de salir. El paseo desde el centro incluye cuestas; recomendamos taxi si llevas tacones o tienes movilidad reducida. Confirmaremos el punto de llegada con el Carmen.",
    },
  ],
  timeline: [
    {
      time: "12:00",
      title: "El sí, quiero",
      detail: "Ceremonia · Sagrario de la Catedral",
    },
    {
      time: "13:30",
      title: "El primer brindis",
      detail: "Celebración · Carmen de los Chapiteles",
    },
    {
      time: "Por confirmar",
      title: "A la mesa",
      detail: "Compartir, saborear y celebrar",
    },
    {
      time: "Por confirmar",
      title: "Hasta que el cuerpo aguante",
      detail: "Música, baile y muchos recuerdos",
    },
  ],
};
export type Hotel = {
  name: string;
  photo: string;
  address: string;
  url: string;
  code: string;
  note: string;
};
export const hotels: Hotel[] = [];
export const routes = [
  {
    duration: "2 horas",
    title: "El corazón de Granada",
    description:
      "Catedral, Alcaicería y Plaza Nueva. Un primer paseo para perderse entre plazas y calles del centro.",
    stops: "Catedral de Granada|Alcaicería Granada|Plaza Nueva Granada",
    url: "https://turismo.granada.org/es",
  },
  {
    duration: "Medio día",
    title: "Un paseo por el Albaicín",
    description:
      "Carrera del Darro, Paseo de los Tristes y Mirador de San Nicolás. Cuestas, calles empedradas y vistas para detenerse.",
    stops:
      "Carrera del Darro Granada|Paseo de los Tristes Granada|Mirador de San Nicolás Granada",
    url: "https://turismo.granada.org/es",
  },
  {
    duration: "Medio día",
    title: "La Alhambra, sin prisas",
    description:
      "Reserva una mañana para la Alhambra y el Generalife. Comprueba las modalidades de visita y el horario de acceso asignado en tu entrada.",
    stops: "Alhambra Granada",
    url: "https://tickets.alhambra-patronato.es/",
  },
];
export const transport = [
  {
    title: "Autobuses urbanos",
    url: "https://www.transportesrober.com/attcliente/contacto.htm",
    text: "Consulta líneas, paradas y cambios de servicio antes de viajar.",
  },
  {
    title: "Metro de Granada",
    url: "https://www.metropolitanogranada.es/horarios",
    text: "Útil para conectar con otras zonas de la ciudad. Revisa la parada más cercana a tu alojamiento.",
  },
  {
    title: "Transporte metropolitano",
    url: "https://ctagr.es/",
    text: "Conexiones con municipios del área metropolitana.",
  },
];
export const maps = (place: string, mode?: string) =>
  mode
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place + " Granada")}&travelmode=${mode}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + " Granada")}`;
