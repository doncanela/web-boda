export const wedding = {
  names: "Paula & Javier",
  date: "2027-11-06T12:00:00+01:00",
  dateLabel: "6 de noviembre de 2027",
  city: "Granada",
  iban: "ES4720859276310330621562",
  privacyContact: "",
  rsvpEnabled: true,
  venues: [
    {
      name: "Sagrario de la Catedral",
      subtitle: "La ceremonia",
      time: "12:00",
      address: "Calle Oficios, s/n · 18001 Granada",
      verified: true,
      source: "https://www.sacramentalsagrariogr.com/parroquia",
      illustration: "/illustrations/catedral.webp",
      photo: "",
      description: "En el corazón de Granada, donde empieza nuestro sí.",
      directions:
        "El entorno de la Catedral es peatonal. Si vienes en taxi, acuerda con el conductor un punto de bajada cercano y accesible.",
    },
    {
      name: "Carmen de los Chapiteles",
      subtitle: "La celebración",
      time: "13:30",
      address: "Camino fuente del avellano, 4, Centro. 18010 Granada.",
      verified: false,
      source: "https://www.carmendeloschapiteles.com",
      illustration: "/illustrations/alhambra.webp",
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
      icon: "/illustrations/timeline/el-si-quiero.webp",
      title: "El sí, quiero",
      detail: "Ceremonia · Sagrario de la Catedral",
    },
    {
      time: "13:30",
      icon: "/illustrations/timeline/coctel.webp",
      title: "Cóctel",
      detail: "Celebración · Carmen de los Chapiteles",
    },
    {
      time: "15:30",
      icon: "/illustrations/timeline/mesa.webp",
      title: "A la mesa",
      detail: "Comienza el banquete",
    },
    {
      time: "17:30",
      icon: "/illustrations/timeline/fiesta.webp",
      title: "¡Fiesta!",
      detail: "Hasta que el cuerpo aguante",
    },
  ],
};
export type Hotel = {
  name: string;
  photo: string;
  url: string;
  distance: string;
  walkUrl: string;
};
export const hotelCode = "BODAJYP";
export const albaicinAirbnb =
  "https://www.airbnb.es/s/Albaicín--Granada--España/homes?place_id=ChIJdatdWs78cQ0RGBUGPyOC9Wg&checkin=2027-11-05&checkout=2027-11-07&date_picker_type=calendar&ref_fsid=cd051a64-a759-458b-aa26-bd10e62bcb51&ref_search_session_id=40410c3c-d698-4ce7-8bab-80288db9dbaf&search_mode=regular_search&refinement_paths%5B%5D=%2Fhomes&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2026-12-01&monthly_length=3&monthly_end_date=2027-03-01&price_filter_input_type=0&price_filter_num_nights=2&channel=EXPLORE&ne_lat=37.18443361967012&ne_lng=-3.58497871335004&sw_lat=37.17225211583898&sw_lng=-3.603604757225554&zoom=15.571990659620583&search_by_map=true&search_type=unknown&zoom_level=15&source=structured_search_input_header";
export const hotels: Hotel[] = [
  {
    name: "Áurea Catedral",
    photo: "/hoteles/aurea-catedral.avif",
    url: "https://www.eurostarshotels.com/aurea-catedral.html",
    distance: "230 m",
    walkUrl: "https://maps.app.goo.gl/FSYYs3HcwnxoSkRZA",
  },
  {
    name: "Eurostars Gran Vía",
    photo: "/hoteles/eurostars-gran-via.webp",
    url: "https://www.eurostarshotels.com/eurostars-gran-via.html",
    distance: "280 m",
    walkUrl: "https://maps.app.goo.gl/HooWfmgGxS6Dx14XA",
  },
  {
    name: "Eurostars Puerta Real",
    photo: "/hoteles/puerta-real.avif",
    url: "https://www.eurostarshotels.com/eurostars-puerta-real.html",
    distance: "450 m",
    walkUrl: "https://maps.app.goo.gl/bX6K7EZTYGyMb8Y29",
  },
  {
    name: "Eurostars San Antón",
    photo: "/hoteles/san-anton.avif",
    url: "https://www.eurostarshotels.com/eurostars-san-anton.html",
    distance: "1,0 km",
    walkUrl: "https://maps.app.goo.gl/dK2yv2S2fqKjkdAs8",
  },
];
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
export const sagrarioCarmenRoute = "https://maps.app.goo.gl/eFnKEEsWKensXMwC7";
export const maps = (place: string, mode?: string) =>
  mode
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place + " Granada")}&travelmode=${mode}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + " Granada")}`;
