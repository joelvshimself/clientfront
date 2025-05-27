import { useState } from "react";
import {
  Title,
  Select,
  Option,
  Input,
  Button,
  FlexBox,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

export default function SeleccionVenta() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState("Arrachera");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [tablaProductos, setTablaProductos] = useState([]);

  const handleAgregarProducto = () => {
    if (!producto || !cantidad || !precio || !fechaCaducidad) {
      alert("Completa todos los campos.");
      return;
    }

    setTablaProductos([
      ...tablaProductos,
      { producto, cantidad, precio, fechaCaducidad },
    ]);

    setCantidad("");
    setPrecio("");
    setFechaCaducidad("");
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    navigate("/venta/nueva/confirmar", { state: { productos: tablaProductos } });
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

        <FlexBox
          direction="Row"
          style={{
            width: "80%",
            justifyContent: "space-around",
            marginBottom: "2rem",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "40%",
              backgroundColor: "#F5FAFF",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#D9EFFF" }}>
                <th
                  style={{
                    border: "1px solid #A9CCE3",
                    padding: "12px",
                    textAlign: "center",
                    color: "#0B3C5D",
                  }}
                >
                  Producto
                </th>
                <th
                  style={{
                    border: "1px solid #A9CCE3",
                    padding: "12px",
                    textAlign: "center",
                    color: "#0B3C5D",
                  }}
                >
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {tablaProductos.map((item, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      border: "1px solid #A9CCE3",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {item.producto}
                  </td>
                  <td
                    style={{
                      border: "1px solid #A9CCE3",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    {item.cantidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <FlexBox
            direction="Column"
            style={{
              width: "40%",
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Select
              style={{ height: "48px", marginBottom: "1rem" }}
              value={producto}
              onChange={(e) =>
                setProducto(e.target.selectedOption.textContent)
              }
            >
              <Option selected>Arrachera</Option>
              <Option>Ribeye</Option>
              <Option>Tomahawk</Option>
              <Option>Diezmillo</Option>
            </Select>

            <FlexBox direction="Row" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <Input
                placeholder="Cantidad"
                value={cantidad}
                onInput={(e) => setCantidad(e.target.value)}
              />
              <Input
                placeholder="Precio"
                value={precio}
                onInput={(e) => setPrecio(e.target.value)}
              />
            </FlexBox>

            <Input
              placeholder="Fecha de caducidad"
              value={fechaCaducidad}
              onInput={(e) => setFechaCaducidad(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Button design="Emphasized" onClick={handleAgregarProducto}>
              Agregar producto
            </Button>
          </FlexBox>
        </FlexBox>

        <Button
          design="Emphasized"
          style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}
          onClick={handleContinuar}
        >
          Continuar
        </Button>
      </FlexBox>
    </Layout>
  );
}
