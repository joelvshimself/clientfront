// testNavigationItems.js

// Mocked version of protectedRoutes WITHOUT React components
const protectedRoutes = [
  { path: "/home", roles: ["admin", "owner"], label: "Home" },
  { path: "/usuarios", roles: ["admin", "detallista", "owner"], label: "Usuarios" },
  { path: "/orden", roles: ["detallista", "proveedor"], label: "Orden" },
  { path: "/venta", roles: ["detallista"], label: "Venta" },
  { path: "/orden/nueva/proveedor", roles: ["detallista"], label: "Proveedor" },
  { path: "/orden/nueva/producto", roles: ["detallista"], label: "Producto" },
  { path: "/orden/nueva/confirmar", roles: ["detallista"], label: "Confirmar Orden" },
  { path: "/venta/nueva", roles: ["detallista"], label: "Nueva Venta" },
  { path: "/venta/nueva/confirmar", roles: ["detallista"], label: "Confirmar Venta" },
  { path: "/profile", roles: ["owner", "detallista", "admin", "proveedor"], label: "Profile"}
];

function getIconForRoute(route) {
  const map = {
    "/home": "home",
    "/usuarios": "employee",
    "/orden": "shipping-status",
    "/venta": "cart"
  };
  return map[route]; // No fallback
}

// Copied function to test
function getNavigationItemsForRole(role) {
  return protectedRoutes
      .filter(route => route.roles.includes(role))
      .map(route => {
        const icon = getIconForRoute(route.path);
        return icon ? { icon, route: route.path, label: route.label || route.path.replace("/", "")} : null;
      })
      .filter(item => item !== null);
}

// Tests
console.log("admin:", getNavigationItemsForRole("admin"));
console.log("detallista:", getNavigationItemsForRole("detallista"));
console.log("owner:", getNavigationItemsForRole("owner")); // should return []
