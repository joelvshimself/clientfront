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
const PerfilUsuario = lazy(() => import("../pages/PerfilUsuario"))

export const protectedRoutes = [
  { path: "/home", element: <Home />, roles: ["owner", "detallista","developer"] },
  { path: "/usuarios", element: <Usuarios />, roles: ["admin","developer"] },
  { path: "/orden", element: <Ordenes />, roles: ["detallista", "proveedor","developer"] },
  { path: "/venta", element: <Venta />, roles: ["detallista","developer"] },
  { path: "/orden/nueva/proveedor", element: <SeleccionProveedor />, roles: ["detallista","developer"] },
  { path: "/orden/nueva/producto", element: <SeleccionProducto />, roles: ["detallista","developer"] },
  { path: "/orden/nueva/confirmar", element: <ConfirmarOrden />, roles: ["detallista","developer"] },
  { path: "/venta/nueva", element: <SeleccionVenta />, roles: ["detallista","developer"] },
  { path: "/venta/nueva/confirmar", element: <ConfirmarVenta />, roles: ["detallista","developer"] },
  { path: "/profile", element: <PerfilUsuario />, roles: ["owner", "detallista", "admin", "proveedor","developer"]}
];

export const roleToPath = {
  admin: "/usuarios",
  detallista: "/home",
  proveedor: "/orden",
  owner: "/home",
  developer: "/home"
};
