import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * useAppNavigate — Navigation SPA fluide.
 *
 * Remplace `window.location.href = createPageUrl(page)` (qui recharge
 * toute l'application) par la navigation côté client de React Router,
 * qui change la route sans recharger la page ni réinitialiser les
 * providers/état.
 *
 * Usage :
 *   const navigate = useAppNavigate();
 *   navigate("Chat");                 // -> /Chat
 *   navigate("AIWorkspace", { id });  // -> /AIWorkspace?id=...
 *
 * Pour une URL externe (mailto:, https://...) ou un rechargement
 * explicite, continuez d'utiliser window.location.href directement.
 */
export function useAppNavigate() {
  const routerNavigate = useNavigate();

  return useCallback(
    (pageName, params) => {
      const path = createPageUrl(pageName);
      if (params && typeof params === "object" && Object.keys(params).length > 0) {
        const search = new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
        ).toString();
        routerNavigate(search ? `${path}?${search}` : path);
      } else {
        routerNavigate(path);
      }
    },
    [routerNavigate]
  );
}

export default useAppNavigate;