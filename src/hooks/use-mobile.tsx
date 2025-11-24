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

    // Estado inicial
    update();

    // Navegadores modernos
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    // Safari / WebView com API antiga
    if (typeof (mql as any).addListener === "function") {
      (mql as any).addListener(update);
      return () => (mql as any).removeListener(update);
    }

    // Sem listener se não houver suporte
    return;
  }, []);

  return !!isMobile;
}
