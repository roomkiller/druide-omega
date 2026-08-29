import { createPageUrl } from "@/utils";

/**
 * spaNavigate — Navigation SPA globale.
 *
 * Capture la fonction `navigate` de React Router au montage de l'app
 * (voir setRouterNavigate dans App.jsx) et l'expose via `navigateTo`,
 * pour que tous les composants puissent naviguer sans rechargement
 * SANS devoir appeler useNavigate() chacun.
 *
 * Remplace `window.location.href = createPageUrl(page)` (qui recharge
 * toute l'application) par `navigateTo(page)` (navigation côté client).
 */

let _navigate = null;

export function setRouterNavigate(fn) {
  _navigate = fn;
}

/**
 * Navigue vers une page interne sans rechargement.
 * @param {string} page - Nom de la page (ex: "Chat", "PublicHome")
 * @param {Object} [params] - Paramètres de query optionnels (ex: { id: "123" })
 */
export function navigateTo(page, params) {
  const path = createPageUrl(page);
  if (_navigate) {
    if (params && typeof params === "object" && Object.keys(params).length > 0) {
      const search = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
      ).toString();
      _navigate(search ? `${path}?${search}` : path);
    } else {
      _navigate(path);
    }
  } else {
    // Fallback de secours (Router pas encore monté) — recharge dur
    window.location.href = path;
  }
}

export default navigateTo;