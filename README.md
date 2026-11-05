# Paula & Javier · Granada · 06.11.2027

Primera versión ejecutable en React + TypeScript + Vite + React Router. Inspirada en la **opción 1 de la página 4** de Flural Paper Studio: marfil, azul marino, marco vegetal y composición de invitación. Los SVG son provisionales propios, no recortes del PDF ni reproducciones arquitectónicas exactas. No se incluye el PDF en este repositorio público.

## Abrir en tu ordenador

Instala Node.js 22.12 o superior (recomendado Node 24 LTS) y Git. En la terminal:

```bash
git clone https://github.com/doncanela/web-boda.git
cd web-boda
npm ci
npm run dev
```

Abre la URL Local que imprima Vite, normalmente **http://localhost:5173**. Mantén la terminal abierta. `Ctrl+C` detiene el servidor. Las modificaciones se muestran al guardar. No abras `index.html` con doble clic.

```bash
npm run build    # TypeScript + compilación de producción en dist/
npm run preview  # vista del build, normalmente http://localhost:4173
npm test         # validación, API y Apps Script con dobles de Google
```

`npm run dev` solo sirve el frontend. El formulario está cerrado por defecto y NO guarda nada. Para probar la API local completa, tras configurar un entorno de pruebas: `npx wrangler pages dev dist` (instala Wrangler desde el registro oficial si no lo tienes). Usa `.dev.vars` ignorado por Git para las variables de servidor y recompila el frontend cuando cambie la configuración.

## Estado real

- Rutas: inicio, la boda, alojamiento, turismo, dress code, regalo, RSVP, privacidad y 404.
- Cuenta atrás con fecha ISO y zona de Madrid, menú móvil, filtros por duración, enlaces a mapas, copia de IBAN cuando exista.
- SVG originales provisionales, fuentes locales Cormorant Garamond / Great Vibes (OFL a través de Fontsource), textura SVG de papel. Sin trackers, iframes ni peticiones de fuentes a Google.
- `rsvpEnabled: false`: integración escrita, NO conectada a Google ni probada extremo a extremo. La hoja NO se ha modificado ni se han verificado sus permisos. La aplicación NO está publicada.
- Las fotografías, ilustraciones definitivas, restaurantes seleccionados y algunos datos prácticos siguen pendientes. No se han sustituido por imágenes de otros lugares ni por horarios inventados.
- Diseño responsive implementado; la auditoría completa en dispositivos reales y lectores de pantalla queda pendiente antes de publicar.

## Editar

| Archivo                 | Contenido                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `src/config.ts`         | Fecha, lugares, hoteles, horarios, rutas, transporte, IBAN, etiqueta, contacto y apertura de RSVP |
| `src/main.tsx`          | Páginas y componentes reutilizables: Title, Flower, External, Countdown y navegación              |
| `src/styles.css`        | Paleta, tamaños, composición y breakpoints                                                        |
| `public/illustrations/` | SVG provisionales intercambiables por originales autorizados                                      |
| `src/validation.mjs`    | Validación compartida entre cliente y Pages Function                                              |
| `functions/api/rsvp.js` | Proxy privado a Google Apps Script                                                                |
| `server/Code.gs`        | Inserción protegida en Google Sheets                                                              |
| `tests/rsvp.test.mjs`   | Pruebas automatizadas sin datos reales ni llamadas a Google                                       |

Para hoteles, añade objetos a `hotels`: `name, photo, address, url, code, note`. Guarda fotos autorizadas en `public/` y utiliza rutas locales. Para lugares, `photo` permite añadir fotografía sin eliminar la ilustración de la portada. Los textos editoriales de las páginas permanecen editables en `main.tsx`; los datos operativos están centralizados en `config.ts`.

El IBAN vacío no produce ningún número ni botón falso. **Todo dato de `config.ts` acaba en el frontend público**: si el IBAN no debe ser público, no lo pongas ahí; habrá que servirlo mediante un área privada. No poner emails de invitados, secretos ni respuestas en el repo.

## RSVP: diseño y conexión pendiente

Flujo: navegador → `/api/rsvp` en Pages Functions → Apps Script → hoja privada. El navegador nunca recibe la URL de Apps Script ni el secreto compartido. Google Forms simplifica operaciones, pero no resuelve por sí solo el control de duplicados y la vinculación segura a cada invitado; se conserva el formulario integrado.

El enlace personal es `/rsvp#invitacion=TOKEN_ALEATORIO`. El fragmento no se envía en la URL HTTP y se elimina de la barra al abrir el formulario; el token permanece solo en memoria. Se conserva al navegar a privacidad y volver. Tras recargar sin fragmento, vuelve a abrir el enlace original. Es un secreto transferible: quien tenga el enlace puede actuar como ese invitado, así que se entrega individualmente. No valida la titularidad del email mediante OTP. No se han generado ni enviado invitaciones.

Cada token de 32 bytes aleatorios se vincula en servidor a un email normalizado mediante su hash SHA-256. No hay lista de invitados en el frontend. Nuevas respuestas: inserción única con bloqueo de Apps Script. Duplicados: respuesta genérica e idéntica, sin lectura ni modificación de datos existentes. Corregir respuestas requiere contactar con los novios y una modificación manual autenticada en Sheets. Esto evita sobrescrituras y que otra persona reserve un email sin su invitación. No se eliminan puntos ni sufijos `+` de los correos.

### Google: realizar con la cuenta propietaria

1. Conectar Google Drive/Sheets y comprobar identidad, `canEdit`/rol de editor y acceso real a la hoja indicada. El enlace no acredita permisos. Revisar que la hoja no esté compartida públicamente ni con lectores innecesarios, especialmente antes de recoger alergias.
2. Abrir la hoja y su editor Apps Script. Copiar `server/Code.gs`.
3. Configurar **Script Properties**, nunca el código público:
   - `SPREADSHEET_ID`: el ID de la hoja que proporcionaste (obtenerlo de tu enlace).
   - `SHEET_NAME`: nombre exacto de la pestaña, no se asume «Hoja 1».
   - `SHARED_SECRET`: secreto aleatorio de al menos 32 bytes.
   - `INVITATIONS_JSON`: objeto `{ "sha256_del_token": "email_normalizado" }`.
   - `RSVP_ENABLED`: `false` hasta las pruebas.
4. Ejecutar `setupSheet()` autenticado. Crea **Nombre | Apellidos | Email | Alergias o intolerancias | Fecha de registro** solo si está vacía; aborta si encuentra encabezados distintos. No borra ni reemplaza contenido existente. Esta ejecución comprueba efectivamente acceso de escritura.
5. Configurar zona horaria del proyecto y de Sheets: Europe/Madrid. La fecha se genera en servidor como `Date`, no se acepta desde el cliente.
6. Publicar Apps Script como aplicación web, ejecutándose como propietario, accesible para llamadas del proxy. Si la cuenta prohíbe acceso sin login, esta arquitectura requiere otro backend; no usar `no-cors` ni afirmar éxito sin leer la respuesta. Mantener URL y secreto solo en el servidor. Compartir únicamente la aplicación web, nunca la hoja.
7. Configurar las variables de Pages Functions (ver abajo), primero con una copia de pruebas privada y datos sintéticos.

Generar tokens con un generador criptográfico (`crypto.randomBytes(32).toString('hex')` en Node), calcular SHA-256 y conservar el mapa solo en Script Properties. No usar tokens secuenciales, correos como token ni contraseñas compartidas. El límite de tamaño de Script Properties obliga a repartir o cambiar el almacenamiento de invitaciones si la lista crece; revisar cuotas antes de importar. La solución no incorpora un limitador de tráfico distribuido: configurar protección de abuso antes de abrirla si es necesaria. El honeypot es solo una medida auxiliar, no sustituye la autenticación.

### Variables de servidor de Cloudflare

| Variable             | Valor                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| `RSVP_ENABLED`       | `false` inicialmente; `true` únicamente en pruebas controladas o tras validación |
| `SITE_ORIGIN`        | Origen exacto HTTPS, sin barra final (o origen local durante pruebas)            |
| `APPS_SCRIPT_URL`    | URL `/exec` de la implementación; configurar como secreto                        |
| `RSVP_SHARED_SECRET` | Mismo valor que `SHARED_SECRET`; configurar como secreto                         |

No prefijar secretos con `VITE_`. El bloqueo cliente no es seguridad: la API también está cerrada por defecto. El proxy valida origen, JSON, tamaño y campos; Apps Script vuelve a validar, exige secreto y token, bloquea inserciones concurrentes y neutraliza fórmulas de Sheets. No registra cuerpos de solicitudes en logs.

### Prueba extremo a extremo obligatoria antes de producción

Usar hoja privada de pruebas y un email sintético con token de prueba. Nunca escribir datos médicos reales durante QA.

- Confirmar encabezados y fecha automática; abrir con token, enviar y verificar exactamente una fila en Sheets.
- Repetir con espacios/mayúsculas en el email: sigue habiendo una sola fila y los valores no cambian.
- Probar token ausente, token ajeno, origen ajeno, secreto incorrecto, campos vacíos, JSON inválido y payload grande.
- Alergias requieren autorización expresa; probar una cadena que empiece por `=` y verificar que se guarda como texto.
- Probar reintento, dos envíos simultáneos y caída de Google; nunca mostrar una confirmación falsa ante error.
- Comprobar que visitantes anónimos no pueden leer la hoja y que ni tokens ni respuestas aparecen en código, red de terceros o logs.
- Completar responsables, contacto, catering y aviso de privacidad. Acordar acceso mínimo, eliminación de datos y copias (objetivo: máximo 90 días tras la boda); el borrado no es automático.
- Revisar móvil 360/390/768 px, escritorio, teclado, lector de pantalla, contraste, foco, navegación directa y recarga de todas las rutas.

Estas pruebas reales **no se han realizado**. Las pruebas automatizadas usan dobles del servicio de Google y no demuestran que una implementación real tenga permisos ni esté bien configurada.

## GitHub y Cloudflare Pages

El repositorio inicial estaba vacío. No contiene datos de invitados ni secretos. Para cambios posteriores: crea una rama, modifica, ejecuta build/tests, commit y push; revisa antes de integrar.

**No conectar todavía una rama a despliegue público automático:** publicar depende del RSVP probado extremo a extremo. Cuando se cumpla:

1. Cloudflare → Workers & Pages → crear proyecto Pages → conectar GitHub → `doncanela/web-boda`.
2. Rama de producción `main`, raíz `/`, build `npm run build`, salida `dist`, Node 24. La carpeta `functions/` debe estar en el repositorio; subir solamente `dist/` desde el dashboard no despliega este backend.
3. Configurar secretos en los entornos correctos y revisar la integración en un entorno de pruebas protegido. Las URLs de preview de Cloudflare no son privadas por defecto; protégelas y no uses datos reales.
4. Tras pasar QA, completar `privacyContact`, revisar `/privacidad`, activar `rsvpEnabled` y los interruptores de servidor. Configurar `SITE_ORIGIN` para el dominio exacto.
5. Añadir el dominio en Custom domains y seguir la configuración DNS. Verificar HTTPS y redirigir variantes al dominio canónico. Los dominios suelen ser de pago; no se ha comprado ninguno.
6. Mantener `noindex,nofollow` si se prefiere discreción. No es un control de acceso. Para SEO público: retirar `noindex`, añadir canonical y sitemap con el dominio real. El sitio no tiene contraseña global.

Los planes gratuitos están sujetos a límites; Pages Functions consume cuota de Workers y Apps Script tiene cuotas propias. No hay garantía de coste cero ilimitado. Cloudflare actualmente recomienda Workers para proyectos nuevos; se mantiene Pages por tu preferencia y por la sencillez de este proyecto.

## Pendiente de los novios

- Dominio y cuenta de Cloudflare; conectar Google y comprobar permisos de la hoja.
- Originales PNG/SVG de Flural, tipografías finales si son distintas, fotografías autorizadas.
- Confirmar comida 15:30 y fiesta 17:30 (vistos en PDF, no publicados como definitivos).
- Dirección/acceso exacto del Carmen; validar recorridos y parada de taxi.
- Acuerdos de hoteles: dirección, foto, reserva, código, condiciones y vigencia.
- Preferencias de etiqueta, selección de bares, IBAN si queréis mostrarlo y su nivel de privacidad.
- Contacto de privacidad, datos del catering y lista privada de invitaciones para vincular emails.

## Fuentes revisadas el 05/11/2026

- Sagrario, dirección: https://www.sacramentalsagrariogr.com/parroquia
- Carmen (ficha municipal; dirección postal pendiente): https://turismo.granada.org/es/empresas/otras-salas-reuniones/carmen-chapiteles
- Alhambra, entradas oficiales: https://tickets.alhambra-patronato.es/
- Turismo municipal: https://turismo.granada.org/es
- Rober: https://www.transportesrober.com/attcliente/contacto.htm
- Metro: https://www.metropolitanogranada.es/horarios
- Consorcio: https://ctagr.es/
- AEMET, Granada Aeropuerto: https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=5530E (noviembre, máxima media 17 °C y mínima media 4,2 °C; no previsión de la boda).
- Cloudflare: https://developers.cloudflare.com/pages/ y https://developers.cloudflare.com/pages/functions/pricing/
- Apps Script: https://developers.google.com/apps-script/guides/web y https://developers.google.com/apps-script/guides/services/quotas

Revisar información práctica cerca de noviembre de 2027. Las duraciones de las rutas son propuestas editoriales aproximadas, no horarios oficiales.
