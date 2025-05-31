// utils/PreAuthRoute.jsx
import { Navigate } from "react-router-dom";
import { roleToPath } from "./routesConfig";
import { useAuth } from "./useAuth";

export const PreAuthRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user && user.role && user.twoFa) {
        const redirectPath = roleToPath[user.role] || "/";
        return <Navigate to={redirectPath} />;
      }

    return children;
};
