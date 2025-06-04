// Mock del módulo routesConfig para controlar protectedRoutes
jest.mock('../src/utils/routesConfig', () => ({
  protectedRoutes: [
    { path: "/home", roles: ["admin", "owner"], label: "Home" },
    { path: "/usuarios", roles: ["admin", "detallista", "owner"], label: "Usuarios" },
    { path: "/orden", roles: ["detallista", "proveedor"], label: "Orden" },
    { path: "/venta", roles: ["detallista"], label: "Venta" },
    { path: "/profile", roles: ["owner", "detallista", "admin", "proveedor"], label: "Profile" } // sin ícono definido
  ]
}));

// Importa después del mock
import { getNavigationItemsForRole } from '../src/utils/navigationItems'; // Ajusta si tu ruta cambia

describe('getNavigationItemsForRole (versión sin fallback de icono)', () => {
  test('devuelve rutas correctas para admin (sin /profile)', () => {
    const result = getNavigationItemsForRole('admin');
    expect(result).toEqual([
      { icon: 'home', route: '/home', label: 'Home' },
      { icon: 'employee', route: '/usuarios', label: 'Usuarios' }
      // /profile no aparece porque no tiene ícono definido
    ]);
  });

  test('devuelve rutas correctas para detallista (sin /profile)', () => {
    const result = getNavigationItemsForRole('detallista');
    expect(result).toEqual([
      { icon: 'employee', route: '/usuarios', label: 'Usuarios' },
      { icon: 'shipping-status', route: '/orden', label: 'Orden' },
      { icon: 'cart', route: '/venta', label: 'Venta' }
      // /profile no aparece porque no tiene ícono definido
    ]);
  });

  test('devuelve rutas correctas para owner (sin /profile)', () => {
    const result = getNavigationItemsForRole('owner');
    expect(result).toEqual([
      { icon: 'home', route: '/home', label: 'Home' },
      { icon: 'employee', route: '/usuarios', label: 'Usuarios' }
      // /profile no aparece porque no tiene ícono definido
    ]);
  });

  test('devuelve arreglo vacío para rol desconocido', () => {
    const result = getNavigationItemsForRole('invitado');
    expect(result).toEqual([]);
  });
});
