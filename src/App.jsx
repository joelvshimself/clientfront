import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// COMPONENTES
import Login from "./components/login";
import TwoFAScreen from "./components/TwoFAScreen";

// AUTH
import { ProtectedRoute } from "./utils/protectedRoute";
import { PublicRoute } from "./utils/publicRoute";
import { PreAuthRoute } from "./utils/preAuthRoute";

// ROUTE CONFIG
import { protectedRoutes } from "./utils/routesConfig";

// CONTEXTOS
import { AuthProvider } from "./utils/authContext";
import { NotificacionesProvider } from "./utils/NotificacionesContext";

// PÁGINAS
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificacionesProvider>
          <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />

              {/* Ruta de 2FA */}
              <Route path="/2fa" element={
                <PreAuthRoute>
                  <TwoFAScreen />
                </PreAuthRoute>
              } />

              {/* Rutas protegidas */}
              {protectedRoutes.map(({ path, element, roles }) => (
                <Route
                  key={path}
                  path={path}
                  element={<ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>}
                />
              ))}

              {/* Ruta no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </NotificacionesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
