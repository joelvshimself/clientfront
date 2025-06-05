import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound"
import PropTypes from "prop-types";

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  //console.log(user)
  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" />;
  if(!user.twoFa) return <Navigate to="/2fa" />;
  if (!allowedRoles.includes(user.role) || !user.twoFa) return <NotFound />;

  return children;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};
