import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./components/ThemeProvider";
import { AntdThemeProvider } from "./components/AntdThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { GoogleIdentityProvider } from "./components/GoogleIdentityProvider";
import { ContentSync } from "./lib/contentStore";
import { Toaster } from "./components/ui/toaster";
import "./fonts.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AntdThemeProvider>
          <AuthProvider>
            <GoogleIdentityProvider>
              <ContentSync />
              <App />
              <Toaster />
            </GoogleIdentityProvider>
          </AuthProvider>
        </AntdThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
