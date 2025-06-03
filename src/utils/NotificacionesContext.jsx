// src/context/NotificacionesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { obtenerNotificaciones } from "./notificacionesStorage";

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    setNotificaciones(obtenerNotificaciones());
  }, []);

  return (
    <NotificacionesContext.Provider value={{ notificaciones, setNotificaciones }}>
      {children}
    </NotificacionesContext.Provider>
  );
};
