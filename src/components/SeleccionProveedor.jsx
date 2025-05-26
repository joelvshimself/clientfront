// src/components/SeleccionProveedor.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  FlexBox,
  Card,
  Title,
  Button
} from "@ui5/webcomponents-react";

export default function SeleccionProveedor() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  // Al montar: trae directamente de la API todos los usuarios,
  // filtra por rol "proveedor" y genera el listado.
useEffect(() => {
  fetch("http://localhost:3000/api/usuarios", {
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(users => {
      const provs = users
        .filter(u =>
          typeof u.ROL === "string" &&
          u.ROL.toLowerCase() === "proveedor"    // <-- aquí ignoramos mayúsculas/minúsculas
        )
        .map(u => ({
          id: u.ID_USUARIO,
          nombre: u.NOMBRE
        }));
      setProveedores(provs);
    })
    .catch(err => {
      console.error("Error cargando proveedores:", err);
      alert("No se pudieron cargar los proveedores");
    });
}, []);


  const handleContinuar = () => {
    if (!proveedorSeleccionado) {
      alert("Selecciona un proveedor para continuar.");
      return;
    }
    navigate("/orden/nueva/producto", {
      state: { proveedorSeleccionado }
    });
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: 40 }} />}
        primaryTitle="Fs"
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201
        }}
      />
      <div style={{ width: 240, marginTop: "3.5rem", backgroundColor: "#fff" }}>
        <SideNavigation>
          <SideNavigationItem icon="home" text="Dashboard" />
          <SideNavigationItem icon="retail-store" text="Producto" />
          <SideNavigationItem icon="employee" text="Usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" />
          <SideNavigationItem icon="cart" text="Ventas" />
        </SideNavigation>
      </div>

      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{
          flexGrow: 1,
          backgroundColor: "#fafafa",
          padding: "6rem 2rem 2rem 2rem"
        }}
      >
        <Title level="H3" style={{ marginBottom: "1.5rem" }}>
          Selecciona el proveedor
        </Title>

        <Card
          style={{
            width: "100%",
            maxWidth: 850,
            padding: "2rem",
            backgroundColor: "#f7faff",
            border: "1px solid #dde3ea",
            borderRadius: 16,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: "bold", marginBottom: 4 }}>
              Nombre del proveedor
            </p>
            <p style={{ color: "#444" }}>
              Selecciona un proveedor registrado en el sistema para comenzar la orden.
            </p>
          </div>

          <div
            style={{
              maxHeight: 250,
              overflowY: "auto",
              border: "2px solid #b0bec5",
              borderRadius: 8,
              backgroundColor: "#fff"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {proveedores.length === 0 && (
                  <tr>
                    <td style={{ padding: 16, textAlign: "center", color: "#888" }}>
                      Cargando proveedores…
                    </td>
                  </tr>
                )}
                {proveedores.map(({ id, nombre }) => (
                  <tr key={id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "1.05rem" }}>
                      <input
                        type="radio"
                        name="proveedor"
                        value={id}
                        checked={proveedorSeleccionado === id}
                        onChange={() => setProveedorSeleccionado(id)}
                        style={{ marginRight: 8 }}
                      />
                      {nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Button
          onClick={handleContinuar}
          design="Emphasized"
          style={{ marginTop: "1.5rem", padding: "0.6rem 2.5rem" }}
        >
          Continuar
        </Button>
      </FlexBox>
    </FlexBox>
  );
}
