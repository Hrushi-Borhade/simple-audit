import { createMemoryRouter, RouteObject } from "react-router";
import { createRouteMap, useTypesafeNavigate } from "./lib";

const routerConfig = [
  {
    path: "/",
    lazy: () => import("@/pages")
  }
] as const satisfies RouteObject[];

const routeMap = createRouteMap(routerConfig);

const useNavigate = function () {
  return useTypesafeNavigate<typeof routerConfig>();
};

const router = createMemoryRouter(routerConfig, {
  future: {
    v7_normalizeFormMethod: true
  },
  initialEntries: ["/"]
});

export { router, routeMap, useNavigate };
