import "./index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FormContextProvider } from "./contexts/FormContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FormContextProvider>
        <App />
      </FormContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
