// testNavigationItems.test.js

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
    "/venta": "cart",
    "/profile": "user"
  };
  return map[route];
}

function getNavigationItemsForRole(role) {
  return protectedRoutes
    .filter(route => route.roles.includes(role))
    .map(route => {
      const icon = getIconForRoute(route.path);
      return icon ? { icon, route: route.path, label: route.label || route.path.replace("/", "") } : null;
    })
    .filter(item => item !== null);
}

describe("getNavigationItemsForRole", () => {
  test("devuelve rutas correctas para admin", () => {
    const result = getNavigationItemsForRole("admin");
    expect(result).toEqual([
      { icon: "home", route: "/home", label: "Home" },
      { icon: "employee", route: "/usuarios", label: "Usuarios" },
      { icon: "user", route: "/profile", label: "Profile" }
    ]);
  });

  test("devuelve rutas correctas para detallista", () => {
    const result = getNavigationItemsForRole("detallista");
    expect(result).toEqual([
      { icon: "employee", route: "/usuarios", label: "Usuarios" },
      { icon: "shipping-status", route: "/orden", label: "Orden" },
      { icon: "cart", route: "/venta", label: "Venta" },
      { icon: "user", route: "/profile", label: "Profile" }
    ]);
  });

  test("devuelve rutas correctas para owner", () => {
    const result = getNavigationItemsForRole("owner");
    expect(result).toEqual([
      { icon: "home", route: "/home", label: "Home" },
      { icon: "employee", route: "/usuarios", label: "Usuarios" },
      { icon: "user", route: "/profile", label: "Profile" }
    ]);
  });

  test("devuelve arreglo vacío para rol desconocido", () => {
    const result = getNavigationItemsForRole("invitado");
    expect(result).toEqual([]);
  });
});
