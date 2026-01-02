import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Spin } from "antd";
import ReactDOM from "react-dom/client";
import CatchBoundary from "@/components/CatchBoundary";
import NotFound from "@/components/NotFound";
import { routeTree } from "./routeTree.gen";
import "./assets/css/normalize.css";
import "./assets/css/global.scss";
import "./assets/css/node.scss";
import "./assets/css/antd.scss";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="g-route-loading">
      <Spin />
    </div>
  ),
  defaultErrorComponent: CatchBoundary,
  defaultNotFoundComponent: () => NotFound,
  // defaultPreload: 'intent',
  context: {
    queryClient,
    // auth: undefined!, // We'll inject this when we render
  },
  scrollRestoration: true, // Remember the scroll position
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
