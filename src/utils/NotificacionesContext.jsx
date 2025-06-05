// src/context/NotificacionesContext.jsx
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from "react";
import { obtenerNotificaciones } from "./notificacionesStorage";

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    setNotificaciones(obtenerNotificaciones());
  }, []);

  const value = useMemo(() => ({
    notificaciones,
    setNotificaciones
  }), [notificaciones]);

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  );
};

NotificacionesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
