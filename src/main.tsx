import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles.css";
import { UiProvider } from "@/components/ui/UiProvider";

if (import.meta.env.MODE !== "production") {
  void import("./lib/a11y")
    .then(({ initAxe }) => initAxe(React))
    .catch(() => undefined);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </React.StrictMode>
);
