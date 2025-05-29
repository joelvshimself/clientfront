import React, { useState } from "react";
import { Title, FlexBox } from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import FormularioProductos from "../../components/FormularioProductos";

const preciosBase = {
  arrachera: 320,
  ribeye: 450,
  tomahawk: 250,
  diezmillo: 180
};
const opciones = ["Arrachera", "Ribeye", "Tomahawk", "Diezmillo"];

export default function SeleccionVenta() {
  const navigate = useNavigate();
  const [tablaProductos, setTablaProductos] = useState([]);

  const handleAgregar = (item) => {
    setTablaProductos((prev) => [...prev, item]);
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }
    const hoy = new Date();
    const fecha_emision = `${hoy.getFullYear()}-${String(
      hoy.getMonth() + 1
    ).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

    navigate("/venta/nueva/confirmar", {
      state: { productos: tablaProductos, fecha_emision }
    });
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ flexGrow: 1, padding: "5rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H4" style={{ marginBottom: "1rem" }}>
          Selecciona los productos
        </Title>
        <FormularioProductos
          productos={tablaProductos}
          opciones={opciones}
          preciosBase={preciosBase}
          conPrecioManual={false}
          conFecha={false}
          onAgregar={handleAgregar}
          onContinuar={handleContinuar}
        />
      </FlexBox>
    </Layout>
  );
}
