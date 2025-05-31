import { lazy } from "react";

const Home = lazy(() => import("../pages/home"));
const Usuarios = lazy(() => import("../pages/usuarios"));
const Ordenes = lazy(() => import("../pages/orden/orden"));
const SeleccionProveedor = lazy(() => import("../pages/orden/SeleccionProveedor"));
const SeleccionProducto = lazy(() => import("../pages/orden/SeleccionProducto"));
const ConfirmarOrden = lazy(() => import("../pages/orden/ConfirmarOrden"));
const Venta = lazy(() => import("../pages/venta/venta"));
const SeleccionVenta = lazy(() => import("../pages/venta/SeleccionVenta"));
const ConfirmarVenta = lazy(() => import("../pages/venta/ConfirmarVenta"));

export const protectedRoutes = [
  { path: "/home", element: <Home />, roles: ["admin", "owner"] },
  { path: "/usuarios", element: <Usuarios />, roles: ["admin", "detallista", "owner"] },
  { path: "/orden", element: <Ordenes />, roles: ["detallista", "proveedor"] },
  { path: "/venta", element: <Venta />, roles: ["detallista"] },
  { path: "/orden/nueva/proveedor", element: <SeleccionProveedor />, roles: ["detallista"] },
  { path: "/orden/nueva/producto", element: <SeleccionProducto />, roles: ["detallista"] },
  { path: "/orden/nueva/confirmar", element: <ConfirmarOrden />, roles: ["detallista"] },
  { path: "/venta/nueva", element: <SeleccionVenta />, roles: ["detallista"] },
  { path: "/venta/nueva/confirmar", element: <ConfirmarVenta />, roles: ["detallista"] },
];

export const roleToPath = {
  admin: "/home",
  detallista: "/orden",
  proveedor: "/orden"
};
