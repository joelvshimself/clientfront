import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock de componentes para evitar dependencias externas
jest.mock('../src/components/login', () => () => <div>Mock Login</div>);
jest.mock('../src/components/TwoFAScreen', () => () => <div>Mock TwoFAScreen</div>);
jest.mock('../src/utils/protectedRoute', () => ({
  ProtectedRoute: ({ children }) => <div>Mock ProtectedRoute {children}</div>,
}));
jest.mock('../src/utils/publicRoute', () => ({
  PublicRoute: ({ children }) => <div>Mock PublicRoute {children}</div>,
}));
jest.mock('../src/utils/preAuthRoute', () => ({
  PreAuthRoute: ({ children }) => <div>Mock PreAuthRoute {children}</div>,
}));
jest.mock('../src/utils/routesConfig', () => ({
  protectedRoutes: [
    { path: '/mock', element: <div>Mock Protected</div>, roles: ['user'] },
  ],
}));
jest.mock('../src/utils/authContext', () => ({
  AuthProvider: ({ children }) => <div>Mock AuthProvider {children}</div>,
}));

import App from '../src/App';

describe('App Component', () => {
  test('renders App without crashing', () => {
    render(<App />);
    const elements = screen.getAllByText(/Mock Login|Mock AuthProvider|Cargando/i);
    expect(elements.length).toBeGreaterThan(0); // ✅ Se asegura que hay coincidencias
  });
});
