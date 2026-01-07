import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { queryClient, router } from "./router";
import "./assets/css/normalize.css";
import "./assets/css/global.scss";
import "./assets/css/node.scss";
import "./assets/css/antd.scss";

// Register things for typesafety

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
