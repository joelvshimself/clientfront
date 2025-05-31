import React, { useState } from "react";
import { Title, FlexBox } from "@ui5/webcomponents-react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import FormularioProductos from "../../components/FormularioProductos";

const opciones = ["Arrachera", "Ribeye", "Tomahawk", "Diezmillo"];

export default function SeleccionProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const proveedorSeleccionado = location.state?.proveedorSeleccionado;
  const [tablaProductos, setTablaProductos] = useState([]);

  const handleAgregar = (item) => {
    setTablaProductos((prev) => [...prev, item]);
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }
    // guardamos arreglo completo
    localStorage.setItem("productoSeleccionado", JSON.stringify(tablaProductos));
    navigate("/orden/nueva/confirmar", {
      state: {
        proveedorSeleccionado,
        productoSeleccionado: tablaProductos
      }
    });
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ flexGrow: 1, padding: "5rem 2rem", backgroundColor: "#f0f7ff" }}
      >
        <Title level="H3" style={{ marginBottom: "1rem" }}>
          Selecciona los productos para la orden
        </Title>
        <FormularioProductos
          productos={tablaProductos}
          opciones={opciones}
          preciosBase={{}}      // no se usa preciosBase aquí
          conPrecioManual={true}
          conFecha={true}
          onAgregar={handleAgregar}
          onContinuar={handleContinuar}
        />
      </FlexBox>
    </Layout>
  );
}
