import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { API_PROXY, LOCALE_KEY } from "./const";
import { queryClient, router } from "./router";
import "./assets/css/normalize.css";
import "./assets/css/global.scss";
import "./assets/css/node.scss";
import "./assets/css/antd.scss";

const Locale = localStorage.getItem(LOCALE_KEY) || "en_US";

const LocaleScript = document.createElement("script");
LocaleScript.src = `${API_PROXY["/i18n/"]}${Locale}.js?_=${Date.now()}`;
LocaleScript.onload = () => {
  const rootElement = document.getElementById("app");
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  }
};
LocaleScript.onerror = () => {
  document.writeln(`<em>Failed to load script: ${LocaleScript.src}</em>`);
};
document.head.appendChild(LocaleScript);
