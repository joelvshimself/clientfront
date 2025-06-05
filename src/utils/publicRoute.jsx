// utils/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { roleToPath } from "./routesConfig";
import PropTypes from "prop-types";


export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (user && user.role && user.twoFa) {
    const redirectPath = roleToPath[user.role] || "/";
    return <Navigate to={redirectPath} />;
  }

  if (user && !user.twoFa){
    return <Navigate to="/2fa"/>;
  }

  return children; // Not logged in, show public page (e.g., login)
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};