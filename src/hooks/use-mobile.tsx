// src/hooks/use-mobile.tsx
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      setIsMobile(false);
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const update = (event?: MediaQueryListEvent | MediaQueryList) => {
      const matches = event ? (event as MediaQueryList).matches : mql.matches;
      setIsMobile(matches);
    };

    // estado inicial
    update();

    // Browsers modernos
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    // Safari/WebView mais chatos: API antiga
    if (typeof (mql as any).addListener === "function") {
      (mql as any).addListener(update);
      return () => (mql as any).removeListener(update);
    }

    // Se não tiver nenhum, apenas não registra listener
    return;
  }, []);

  return !!isMobile;
}
