import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Suspense } from "react";

// COMPONENTES
import Login from "./components/login";
import TwoFAScreen from "./components/TwoFAScreen";

// AUTH
import { ProtectedRoute } from "./utils/protectedRoute";

// ROUTE CONFIG
import { protectedRoutes } from "./utils/routesConfig";

import { AuthProvider } from "./utils/authContext"; 
import { PublicRoute } from "./utils/publicRoute";
import { PreAuthRoute } from "./utils/preAuthRoute";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
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
            <Route path="/2fa" element={
              <PreAuthRoute>
                <TwoFAScreen />
              </PreAuthRoute>
            } />

            {/* Protected Routes */}
            {protectedRoutes.map(({ path, element, roles }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>}
              />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
