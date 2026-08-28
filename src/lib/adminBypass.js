// ╔══════════════════════════════════════════════════════════════════════╗
// ║ Gestion de session Architecte (plein accès) et Démo (accès limité)    ║
// ║ Valeur sessionStorage : "full" = architecte, "demo" = démonstration   ║
// ╚══════════════════════════════════════════════════════════════════════╝

const STORAGE_KEY = "druide_architect_bypass";

// --- Session Architecte (plein accès, via email + mot de passe serveur) ---
export function setArchitectBypass() {
  sessionStorage.setItem(STORAGE_KEY, "full");
}

export function hasArchitectBypass() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "full";
  } catch {
    return false;
  }
}

// --- Session Démo (accès limité, pages confidentielles bloquées) ---
export function setDemoSession() {
  sessionStorage.setItem(STORAGE_KEY, "demo");
}

export function hasDemoSession() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "demo";
  } catch {
    return false;
  }
}

// --- Utilitaire générique ---
export function getSessionLevel() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearArchitectBypass() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}