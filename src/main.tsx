import React from "react";
import { HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import "./index.css";
import { UiProvider } from "@/components/ui/UiProvider";
import { DepartmentProvider } from "@/contexts/DepartmentContext";

if (import.meta.env.MODE !== "production") {
  void import("./lib/a11y")
    .then(({ initAxe }) => initAxe(React))
    .catch(() => undefined);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UiProvider>
      <HashRouter>
        <DepartmentProvider>
          <App />
        </DepartmentProvider>
      </HashRouter>
    </UiProvider>
  </React.StrictMode>
);
