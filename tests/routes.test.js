import React from 'react'; // Importa React para JSX
import { protectedRoutes, roleToPath } from '../src/utils/routesConfig'; // Ajusta ruta

describe('protectedRoutes full coverage', () => {
  const expectedRoutes = {
    "/home": ["owner", "detallista", "developer"],
    "/usuarios": ["admin", "developer"],
    "/orden": ["detallista", "proveedor", "developer"],
    "/venta": ["detallista", "developer"],
    "/orden/nueva/proveedor": ["detallista", "developer"],
    "/orden/nueva/producto": ["detallista", "developer"],
    "/orden/nueva/confirmar": ["detallista", "developer"],
    "/venta/nueva": ["detallista", "developer"],
    "/venta/nueva/confirmar": ["detallista", "developer"],
    "/profile": ["owner", "detallista", "admin", "proveedor", "developer"]
  };

  test('cada ruta está definida con roles y elemento React', () => {
    // Verifica que la cantidad de rutas sea igual a las esperadas
    expect(protectedRoutes.length).toBe(Object.keys(expectedRoutes).length);

    protectedRoutes.forEach(route => {
      // La ruta debe estar en expectedRoutes
      expect(expectedRoutes).toHaveProperty(route.path);

      // Los roles deben coincidir exactamente (sin importar orden)
      expect(route.roles.sort()).toEqual(expectedRoutes[route.path].sort());

      // El elemento React debe estar definido
      expect(route.element).toBeDefined();

      // El elemento debe ser un objeto (React element)
      expect(typeof route.element).toBe('object');
    });
  });

  test('no existen rutas duplicadas', () => {
    const paths = protectedRoutes.map(r => r.path);
    const uniquePaths = [...new Set(paths)];
    expect(paths.length).toBe(uniquePaths.length);
  });
});

describe('roleToPath full coverage', () => {
  const expectedRoleToPath = {
    admin: "/usuarios",
    detallista: "/home",
    proveedor: "/orden",
    owner: "/home",
    developer: "/home"
  };

  test('roleToPath tiene todos los roles y paths esperados', () => {
    expect(Object.keys(roleToPath).sort()).toEqual(Object.keys(expectedRoleToPath).sort());

    Object.entries(expectedRoleToPath).forEach(([role, path]) => {
      expect(roleToPath[role]).toBe(path);
    });
  });
});
