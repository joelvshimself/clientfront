// src/components/NotificacionesPanel.jsx
import React, { useRef, useState } from "react";
import { Button, Popover, FlexBox, Text } from "@ui5/webcomponents-react";
import { Toaster, toast } from "react-hot-toast";
import { useNotificaciones } from "../utils/NotificacionesContext";
import {
  eliminarNotificacionStorage,
} from "../utils/notificacionesStorage";

const NotificacionesPanel = () => {
  const notiButtonRef = useRef(null);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const { notificaciones, setNotificaciones } = useNotificaciones(); // 👉 ahora viene del contexto

  const handleEliminarNotificacion = (id) => {
    const nuevas = eliminarNotificacionStorage(id);
    setNotificaciones(nuevas);
    toast.success("Notificación eliminada");
  };

  return (
    <>
      <div style={{ position: "fixed", top: 10, right: 144, zIndex: 1500 }}>
        <Button
          icon="bell"
          design="Transparent"
          ref={notiButtonRef}
          onClick={() => setOpenNotificaciones(true)}
        />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {notificaciones.length}
        </span>
      </div>

      {notiButtonRef.current && (
        <Popover
          headerText="Notificaciones recientes"
          open={openNotificaciones}
          opener={notiButtonRef.current}
          onClose={() => setOpenNotificaciones(false)}
          style={{ width: 320, minHeight: 300 }}
        >
          <FlexBox
            direction="Column"
            style={{
              padding: "1rem",
              gap: "0.5rem",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {notificaciones.map((noti) => (
              <div
                key={noti.id}
                style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}
              >
                <Text>{noti.mensaje}</Text>
                <Button
                  onClick={() => handleEliminarNotificacion(noti.id)}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </FlexBox>
        </Popover>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default NotificacionesPanel;
