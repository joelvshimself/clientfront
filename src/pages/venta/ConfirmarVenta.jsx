// ConfirmarVenta.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Title,
  FlexBox,
  Card
} from "@ui5/webcomponents-react";
import Layout from "../../components/Layout";
import { venderProductos } from "../../services/ventaService";

export default function ConfirmarVenta() {
  const navigate = useNavigate();
  const location = useLocation();

  const productos = location.state?.productos || [];
  const fecha_emision = location.state?.fecha_emision;

  const costoTotal = productos.reduce(
    (acc, p) => acc + (parseFloat(p.precio || 0) * parseInt(p.cantidad || 0)),
    0
  );

  const handleConfirmar = async () => {
    const payload = {
      fecha_emision,
      productos: productos.map(p => ({
        producto: p.producto,
        cantidad: parseInt(p.cantidad)
      }))
    };

    if (!fecha_emision || !productos.length) {
      alert("Faltan datos para crear la venta.");
      return;
    }

    console.log("🟡 Enviando payload de venta: ", payload);

    try {
      const response = await venderProductos(payload);
      alert(`✅ Venta creada con éxito. ID: ${response.id_venta}`);
      navigate("/venta");
    } catch (error) {
      alert("❌ Error al crear venta");
    }
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ flexGrow: 1, padding: "6rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H3" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
          Confirma la venta
        </Title>

        <Card
          style={{
            width: "100%",
            maxWidth: "800px",
            padding: "2rem",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid #000"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={headerCellStyle}>Producto</th>
                <th style={headerCellStyle}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item, index) => (
                <tr key={index}>
                  <td style={bodyCellStyle}>{item.producto}</td>
                  <td style={{ ...bodyCellStyle, textAlign: "center" }}>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              backgroundColor: "#fff8e1",
              borderRadius: "12px",
              border: "2px dashed orange",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            Total: ${costoTotal.toFixed(2)}
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
          Confirmar venta
        </Button>
      </FlexBox>
    </Layout>
  );
}

const headerCellStyle = {
  border: "2px solid #000",
  padding: "12px",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "1rem"
};

const bodyCellStyle = {
  border: "2px solid #000",
  padding: "10px",
  fontSize: "1rem"
};
