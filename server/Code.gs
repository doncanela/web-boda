/* Google Apps Script V8. Never put credentials or invitation mappings in Git. */
const HEADERS = [
  "Nombre",
  "Apellidos",
  "Email",
  "Alergias o intolerancias",
  "Fecha de registro",
];
// Hoja de respuestas de la boda (el ID no es secreto; el acceso se controla en Google).
// SPREADSHEET_ID en Script Properties tiene prioridad si existe.
const DEFAULT_SPREADSHEET_ID = "1LeYac-7tppgQsIY0pYV9pX2NB8rd0dJ5r6L3PmfZTX4";
function spreadsheetId(p) {
  return p.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
}
function setupSheet() {
  const p = PropertiesService.getScriptProperties();
  const book = SpreadsheetApp.openById(spreadsheetId(p));
  const sheet = book.getSheetByName(p.getProperty("SHEET_NAME"));
  if (!sheet)
    throw new Error("Configure SHEET_NAME con el nombre real de la pestaña.");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return;
  }
  if (
    JSON.stringify(sheet.getRange(1, 1, 1, 5).getValues()[0]) !==
    JSON.stringify(HEADERS)
  )
    throw new Error("Encabezados distintos; no se modifica la hoja.");
}
function doPost(e) {
  const out = (x) =>
    ContentService.createTextOutput(JSON.stringify(x)).setMimeType(
      ContentService.MimeType.JSON,
    );
  const p = PropertiesService.getScriptProperties();
  if (p.getProperty("RSVP_ENABLED") !== "true") return out({ ok: false });
  let d;
  try {
    if (e.postData.contents.length > 8192) return out({ ok: false });
    d = JSON.parse(e.postData.contents);
  } catch {
    return out({ ok: false });
  }
  if (
    !p.getProperty("SHARED_SECRET") ||
    d.secret !== p.getProperty("SHARED_SECRET")
  )
    return out({ ok: false });
  if (
    typeof d.firstName !== "string" ||
    !d.firstName.trim() ||
    d.firstName.trim().length > 80 ||
    typeof d.lastName !== "string" ||
    !d.lastName.trim() ||
    d.lastName.trim().length > 120 ||
    typeof d.email !== "string" ||
    d.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()) ||
    typeof d.allergies !== "string" ||
    d.allergies.length > 1000 ||
    d.consent !== true ||
    (d.allergies.trim() && d.sensitiveConsent !== true)
  )
    return out({ ok: false });
  if (typeof d.invitation !== "string" || !/^[a-f0-9]{64}$/.test(d.invitation))
    return out({ ok: false });
  const email = d.email.trim().toLowerCase();
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    d.invitation,
  )
    .map((x) => ("0" + ((x + 256) % 256).toString(16)).slice(-2))
    .join("");
  // Map sha256(invitation secret) -> normalized email in Script Properties.
  const invitations = JSON.parse(p.getProperty("INVITATIONS_JSON") || "{}");
  if (invitations[hash] !== email) return out({ ok: true }); // No email enumeration.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return out({ ok: false });
  try {
    const book = SpreadsheetApp.openById(spreadsheetId(p));
    const sheet = book.getSheetByName(p.getProperty("SHEET_NAME"));
    if (
      !sheet ||
      JSON.stringify(sheet.getRange(1, 1, 1, 5).getValues()[0]) !==
        JSON.stringify(HEADERS)
    )
      return out({ ok: false });
    const rows = sheet.getLastRow();
    if (
      rows > 1 &&
      sheet
        .getRange(2, 3, rows - 1, 1)
        .getValues()
        .some((r) => String(r[0]).trim().toLowerCase() === email)
    )
      return out({ ok: true });
    // Escape spreadsheet formulas in every free-text column.
    const safe = (x) => (/^[=+@\-\t\r\n]/.test(x) ? "'" + x : x);
    sheet.appendRow([
      safe(d.firstName.trim()),
      safe(d.lastName.trim()),
      safe(email),
      safe(d.allergies.trim()),
      new Date(),
    ]);
    return out({ ok: true });
  } catch {
    return out({ ok: false });
  } finally {
    lock.releaseLock();
  }
}
