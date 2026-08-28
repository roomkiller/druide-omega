// ╔══════════════════════════════════════════════════════════════════════╗
// ║ Contournement TEMPORAIRE d'accès Architecte                            ║
// ║ À supprimer une fois la page de connexion Base44 réparée en prod.     ║
// ╚══════════════════════════════════════════════════════════════════════╝

const ADMIN_BYPASS_CODE = "OMEGA-ARCH-9K2xP7-Qm4L";
const STORAGE_KEY = "druide_architect_bypass";

export function validateArchitectCode(code) {
  return code === ADMIN_BYPASS_CODE;
}

export function setArchitectBypass() {
  sessionStorage.setItem(STORAGE_KEY, "1");
}

export function hasArchitectBypass() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearArchitectBypass() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}