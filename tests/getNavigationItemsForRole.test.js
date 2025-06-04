// getNavigationItemsForRole.test.js

// Mock completo del módulo con rutas variadas
jest.mock('../src/utils/routesConfig', () => ({
  protectedRoutes: [
    { path: "/home", roles: ["admin"], label: "Home" },
    { path: "/usuarios", roles: ["admin"], label: "Usuarios" },
    { path: "/nolabel", roles: ["admin"] } // sin label
  ]
}));

// Importar después de mockear
import { getNavigationItemsForRole } from '../src/utils/navigationItems';

describe('getNavigationItemsForRole', () => {
  test('devuelve rutas con label explícito y excluye rutas sin icono definido', () => {
    const result = getNavigationItemsForRole('admin');
    expect(result).toEqual([
      { icon: 'home', route: '/home', label: 'Home' },
      { icon: 'employee', route: '/usuarios', label: 'Usuarios' }
      // /nolabel no tiene ícono definido en getIconForRoute, por eso se excluye
    ]);
  });

  test('deriva label del path si no se proporciona label (pero ícono sí está definido)', () => {
    // Creamos una ruta que sí tenga ícono pero no tenga label
    const customRoutes = [
      { path: "/venta", roles: ["admin"] } // sí tiene ícono en getIconForRoute, pero sin label
    ];

    // Reescribir el módulo completo
    jest.resetModules(); // borra el cache
    jest.doMock('../src/utils/routesConfig', () => ({
      protectedRoutes: customRoutes
    }));

    // Reimportar con el nuevo mock activo
    const { getNavigationItemsForRole: getWithCustomRoutes } = require('../src/utils/navigationItems');

    const result = getWithCustomRoutes('admin');
    expect(result).toEqual([
      { icon: 'cart', route: '/venta', label: 'venta' }
    ]);
  });

  test('retorna arreglo vacío para rol desconocido', () => {
    const result = getNavigationItemsForRole('guest');
    expect(result).toEqual([]);
  });
});
