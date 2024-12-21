import {
  NavigateOptions,
  useNavigate,
  NonIndexRouteObject,
  RouteObject
} from "react-router";

type ForwardSlash = "/";
type Trim<T> = T extends `${ForwardSlash}${infer U}`
  ? Trim<U>
  : T extends `${infer U}${ForwardSlash}`
    ? Trim<U>
    : T;

function hasChildren(route: RouteObject): route is NonIndexRouteObject {
  return "children" in route;
}

type InferRouteMap<T extends RouteObject[], ParentPath extends string = ""> =
  Trim<NonNullable<T[number]["path"]>> extends ""
    ? T[number] extends {
        children: infer Children extends RouteObject[];
      }
      ? InferRouteMap<
          Children,
          `${ParentPath extends "" ? "" : ParentPath extends "/" ? "" : "/"}${Trim<ParentPath>}/${Trim<NonNullable<T[number]["path"]>>}`
        > & {
          $path: `${ParentPath extends "" ? "" : ParentPath extends "/" ? "" : "/"}${Trim<ParentPath>}/${Trim<NonNullable<T[number]["path"]>>}`;
        }
      : {
          $path: `${ParentPath extends "" ? "" : ParentPath extends "/" ? "" : "/"}${Trim<ParentPath>}/${Trim<NonNullable<T[number]["path"]>>}`;
        }
    : {
        [K in T[number] as Trim<NonNullable<K["path"]>>]: K extends {
          children: infer Children extends RouteObject[];
        }
          ? InferRouteMap<
              Children,
              `${ParentPath extends "" ? "" : ParentPath extends "/" ? "" : "/"}${Trim<ParentPath>}/${Trim<NonNullable<K["path"]>>}`
            >
          : {
              $path: `${ParentPath extends "" ? "" : ParentPath extends "/" ? "" : "/"}${Trim<ParentPath>}/${Trim<NonNullable<K["path"]>>}`;
            };
      };

export function createRouteMap<T extends RouteObject[]>(
  routes: T,
  parentPath = ""
): InferRouteMap<T> {
  return routes.reduce((acc, route) => {
    if (route.path) {
      const trimmedPath = route.path.replace(/^\/|\/$/g, "");
      const fullPath = `${parentPath}${route.path}`.replace(/\/+/g, "/");

      if (trimmedPath === "") {
        // @ts-expect-error: This is to avoid restructuring the type to adjust for the base home route
        acc = {
          $path: fullPath,
          ...(hasChildren(route) && route.children
            ? createRouteMap(route.children, fullPath)
            : {})
        } as InferRouteMap<T>[keyof InferRouteMap<T>];
      } else {
        acc[trimmedPath as keyof InferRouteMap<T>] = {
          $path: fullPath,
          $fullPath: fullPath,
          ...(hasChildren(route) && route.children
            ? createRouteMap(route.children, fullPath)
            : {})
        } as InferRouteMap<T>[keyof InferRouteMap<T>];
      }
    }
    return acc;
  }, {} as InferRouteMap<T>);
}

type NestedObjectValue<T> = T extends object
  ? { [K in keyof T]: NestedObjectValue<T[K]> }[keyof T]
  : T;

export const useTypesafeNavigate = function <T extends RouteObject[]>() {
  const navigate = useNavigate();

  return function (
    path: NestedObjectValue<InferRouteMap<T>>,
    opts?: NavigateOptions
  ) {
    navigate(path as string, opts);
  };
};
