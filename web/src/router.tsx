import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { Spin } from "antd";
import CatchBoundary from "@/components/CatchBoundary";
import NotFound from "@/components/NotFound";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div style={{ padding: "20px" }}>
      <Spin />
    </div>
  ),
  defaultErrorComponent: CatchBoundary,
  defaultNotFoundComponent: () => NotFound,
  //defaultPreload: "intent",
  context: {
    queryClient,
    // auth: undefined!, // We'll inject this when we render
  },
  scrollRestoration: true, // Remember the scroll position
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
