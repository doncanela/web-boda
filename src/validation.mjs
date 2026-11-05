export function validateRsvp(input) {
  if (!input || typeof input !== "object")
    return { ok: false, error: "Datos no válidos." };
  const {
    firstName,
    lastName,
    email,
    allergies = "",
    consent,
    sensitiveConsent,
  } = input;
  if (
    typeof firstName !== "string" ||
    !firstName.trim() ||
    firstName.trim().length > 80 ||
    typeof lastName !== "string" ||
    !lastName.trim() ||
    lastName.trim().length > 120
  )
    return { ok: false, error: "Revisa tu nombre y apellidos." };
  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  )
    return { ok: false, error: "Introduce un email válido." };
  if (typeof allergies !== "string" || allergies.length > 1000)
    return { ok: false, error: "Limita las alergias a 1.000 caracteres." };
  if (consent !== true)
    return { ok: false, error: "Debes aceptar el aviso de privacidad." };
  if (allergies.trim() && sensitiveConsent !== true)
    return {
      ok: false,
      error: "Para indicar alergias necesitamos tu autorización expresa.",
    };
  return {
    ok: true,
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      allergies: allergies.trim(),
      consent: true,
      sensitiveConsent: sensitiveConsent === true,
    },
  };
}
