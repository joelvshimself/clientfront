import { protectedRoutes } from "./routesConfig";

function getIconForRoute(route) {
  const map = {
    "/home": "home",
    "/usuarios": "employee",
    "/orden": "shipping-status",
    "/venta": "cart"
  };
  return map[route]; // No fallback
}

export function getNavigationItemsForRole(role) {
  return protectedRoutes
    .filter(route => route.roles.includes(role))
    .map(route => {
      const icon = getIconForRoute(route.path);
      return icon ? { 
        icon, 
        route: route.path, 
        label: route.label || route.path.replace("/", "") 
      } : null;
    })
    .filter(item => item !== null);
}