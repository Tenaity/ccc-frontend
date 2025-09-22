import type * as ReactType from "react";

let initialized = false;

export async function initAxe(react: typeof ReactType) {
  if (initialized || typeof window === "undefined" || !window.document?.body) {
    return;
  }
  initialized = true;

  const axeModule = await import("@axe-core/react");
  const reactDomModule = await import("react-dom");

  type AxeInitializer = (
    reactInstance: typeof ReactType,
    reactDom: typeof import("react-dom"),
    timeout?: number,
    config?: unknown
  ) => void;

  const axe =
    ((axeModule as { default?: AxeInitializer }).default ??
      (axeModule as unknown as AxeInitializer)) as AxeInitializer | undefined;
  const reactDom =
    (reactDomModule as { default?: typeof import("react-dom") }).default ??
    (reactDomModule as typeof import("react-dom"));

  if (typeof axe === "function") {
    axe(react, reactDom, 1000);
  }
}
