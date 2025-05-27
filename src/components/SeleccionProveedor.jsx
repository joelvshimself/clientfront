// src/components/SeleccionProveedor.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  FlexBox,
  Card,
  Title,
  Button
} from "@ui5/webcomponents-react";
import { getUsuarios } from "../services/usersService"; 

export default function SeleccionProveedor() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  useEffect(() => {
    getUsuarios()
      .then(res => {
        console.log("Usuarios recibidos:", res);
        const proveedoresFiltrados = res.filter(
          u => u.ROL && u.ROL.trim().toLowerCase() === "proveedor"
        );
        setProveedores(proveedoresFiltrados);
      })
      .catch(err => {
        alert("No autorizado. Inicia sesión.");
        navigate("/login");
      });
  }, []);

  const handleContinuar = () => {
    if (proveedorSeleccionado) {
      localStorage.setItem("proveedorSeleccionado", proveedorSeleccionado);
      navigate("/orden/nueva/producto", { state: { proveedorSeleccionado } });
    }
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
                      No hay proveedores disponibles.
                    </td>
                  </tr>
                )}
                {proveedores.map((p) => (
                  <tr key={p.ID_USUARIO || p.EMAIL}>
                    <td>
                      <input
                        type="radio"
                        name="proveedor"
                        value={p.EMAIL}
                        checked={proveedorSeleccionado === p.EMAIL}
                        onChange={() => setProveedorSeleccionado(p.EMAIL)}
                        style={{ marginRight: 8 }}
                      />
                      {p.NOMBRE} ({p.EMAIL}) - <span style={{color: "#888"}}>{p.ROL}</span>
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
