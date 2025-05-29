import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Title,
  FlexBox,
  Card
} from "@ui5/webcomponents-react";
import Layout from "../../components/Layout";
import { createOrden } from "../../services/ordenesService";

export default function ConfirmarOrden() {
  const navigate = useNavigate();
  const location = useLocation();

  const proveedorSeleccionado =
    location.state?.proveedorSeleccionado ||
    localStorage.getItem("proveedorSeleccionado");

  const productoSeleccionado =
    location.state?.productoSeleccionado ||
    JSON.parse(localStorage.getItem("productoSeleccionado") ?? "null");

  // Permitir arreglo de productos
  let productos = [];
  if (Array.isArray(productoSeleccionado)) {
    productos = productoSeleccionado;
  } else if (productoSeleccionado) {
    productos = [productoSeleccionado];
  }

  const costoTotal = productos.reduce(
    (acc, p) => acc + parseFloat(p?.precio || 0) * parseInt(p?.cantidad || 0),
    0
  );

  const handleConfirmar = async () => {
    const correo_solicita = localStorage.getItem("correo");
    const correo_provee = proveedorSeleccionado;

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const fecha_emision = `${yyyy}-${mm}-${dd}`;

    const payload = {
      correo_solicita,
      correo_provee,
      fecha_emision,
      productos: productos.map((p) => ({
        producto: p.producto,
        cantidad: Number(p.cantidad),
        precio: Number(p.precio),
        fechaCaducidad: p.fechaCaducidad
      }))
    };

    if (!correo_solicita || !correo_provee || !productos.length || !fecha_emision) {
      alert("Faltan datos para crear la orden.");
      return;
    }

    console.log("Payload enviado a la API:", JSON.stringify(payload, null, 2));

    try {
      const response = await createOrden(payload);
      if (response?.id_orden) {
        localStorage.removeItem("proveedorSeleccionado");
        localStorage.removeItem("productoSeleccionado");
        alert(`Orden creada exitosamente con ID: ${response.id_orden}`);
        navigate("/orden");
      } else {
        alert("Error al crear orden");
      }
    } catch (error) {
      console.error(error);
      alert("Error al crear orden");
    }
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ flexGrow: 1, padding: "6rem 2rem 2rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H3" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
          Confirma la orden
        </Title>

        <Card
          style={{
            width: "100%",
            maxWidth: "900px",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "3px solid #000"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={headerCellStyle}>Producto</th>
                <th style={headerCellStyle}>Cantidad</th>
                <th style={headerCellStyle}>Precio</th>
                <th style={headerCellStyle}>Fecha de caducidad</th>
                <th style={headerCellStyle}>Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item) => (
                <tr key={item.producto + "-" + item.fechaCaducidad}>
                  <td style={bodyCellStyle}>{item.producto}</td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>{item.cantidad}</td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>${item.precio}</td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>{item.fechaCaducidad}</td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>{proveedorSeleccionado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f8f8f8",
              display: "inline-block",
              borderRadius: "8px",
              boxShadow: "inset 0 0 2px rgba(0,0,0,0.1)"
            }}
          >
            Costo total: ${costoTotal}
          </div>
        </Card>

        <Button
          onClick={handleConfirmar}
          design="Emphasized"
          style={{
            marginTop: "2rem",
            minWidth: "200px",
            height: "48px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "10px"
          }}
        >
          Confirmar orden
        </Button>
      </FlexBox>
    </Layout>
  );
}

const headerCellStyle = {
  border: "3px solid #000",
  padding: "12px",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "1rem"
};

const bodyCellStyle = {
  border: "3px solid #000",
  padding: "12px",
  fontSize: "1rem"
};
