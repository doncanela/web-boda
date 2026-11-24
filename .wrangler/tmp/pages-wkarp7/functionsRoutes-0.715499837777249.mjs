import { onRequestGet as __api_rsvp_js_onRequestGet } from "C:\\Users\\javie\\Desktop\\Work related stuff\\Repositorio\\web-boda\\functions\\api\\rsvp.js"
import { onRequestPost as __api_rsvp_js_onRequestPost } from "C:\\Users\\javie\\Desktop\\Work related stuff\\Repositorio\\web-boda\\functions\\api\\rsvp.js"

export const routes = [
    {
      routePath: "/api/rsvp",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_rsvp_js_onRequestGet],
    },
  {
      routePath: "/api/rsvp",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_rsvp_js_onRequestPost],
    },
  ]