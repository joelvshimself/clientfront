import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FlexBox,
  Select,
  Option,
  Input,
  Button,
  Card,
  Title
} from "@ui5/webcomponents-react";

/**
 * Props:
 * - productos: array de objetos ya agregados (para mostrarlos en la tabla)
 * - opciones: array de strings con los nombres de producto disponibles
 * - preciosBase: { [nombreMinusculas]: number } opcional. Si se provee, el precio se toma de aquí.
 * - conPrecioManual: boolean. Si true, muestra input de precio en lugar de usar preciosBase.
 * - conFecha: boolean. Si true, muestra input de fecha de caducidad.
 * - onAgregar: fn({ producto, cantidad, precio?, fechaCaducidad? }) => void
 * - onContinuar: fn() => void
 */
export default function FormularioProductos({
  productos,
  opciones,
  preciosBase = {},
  conPrecioManual = false,
  conFecha = false,
  onAgregar,
  onContinuar
}) {
  const [producto, setProducto] = useState(opciones[0] || "");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");

  const handleAgregar = () => {
    if (!producto || !cantidad || (conPrecioManual && !precio) || (conFecha && !fechaCaducidad)) {
      alert("Completa todos los campos.");
      return;
    }
    const item = {
      producto: producto.toLowerCase(),
      cantidad: parseInt(cantidad, 10)
    };
    if (conPrecioManual) {
      item.precio = parseFloat(precio);
    } else {
      item.precio = preciosBase[producto.toLowerCase()] || 0;
    }
    if (conFecha) {
      item.fechaCaducidad = fechaCaducidad;
    }
    onAgregar(item);
    setCantidad("");
    setPrecio("");
    setFechaCaducidad("");
  };

  const thStyle = { padding: "10px", background: "#D9EFFF", fontWeight: 600 };
  const tdStyle = { padding: "10px", background: "#F5FAFF" };

  return (
    <>
      <FlexBox
        direction="Row"
        style={{ width: "100%", gap: "2rem", marginBottom: "2rem" }}
      >
        {/* Tabla de productos añadidos */}
        <table
          style={{
            borderCollapse: "collapse",
            width: "50%",
            backgroundColor: "#F5FAFF",
            borderRadius: "12px",
            overflow: "hidden",
            color: "#000"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#D9EFFF" }}>
              <th style={thStyle}>Producto</th>
              <th style={thStyle}>Cantidad</th>
              <th style={thStyle}>Precio</th>
              {conFecha && <th style={thStyle}>Caducidad</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map((item, idx) => (
              <tr key={item.producto + "-" + item.cantidad + "-" + (item.fechaCaducidad || idx)}>
                <td style={tdStyle}>{item.producto}</td>
                <td style={tdStyle}>{item.cantidad}</td>
                <td style={tdStyle}>${item.precio}</td>
                {conFecha && <td style={tdStyle}>{item.fechaCaducidad}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario de nuevo producto */}
        <Card
          style={{
            width: "50%",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <FlexBox direction="Column" gap="1rem">
            <Select
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              style={{ marginBottom: "1rem" }}
            >
              {opciones.map((op) => (
                <Option key={op} value={op}>
                  {op}
                </Option>
              ))}
            </Select>
            <Input
              placeholder="Cantidad"
              type="Number"
              value={cantidad}
              onInput={(e) => setCantidad(e.target.value)}
            />
            {conPrecioManual ? (
              <Input
                placeholder="Precio"
                type="Number"
                value={precio}
                onInput={(e) => setPrecio(e.target.value)}
              />
            ) : (
              <Title level="H6">
                Precio unitario: $
                {(preciosBase[producto.toLowerCase()] || 0).toFixed(2)}
              </Title>
            )}
            {conFecha && (
              <Input
                placeholder="Fecha de caducidad"
                type="date"
                value={fechaCaducidad}
                onInput={(e) => setFechaCaducidad(e.target.value)}
              />
            )}
            <Button design="Emphasized" onClick={handleAgregar}>
              Agregar producto
            </Button>
          </FlexBox>
        </Card>
      </FlexBox>

      <FlexBox justifyContent="Center">
        <Button design="Emphasized" onClick={onContinuar}>
          Continuar
        </Button>
      </FlexBox>
    </>
  );
}

// --- PropTypes para validación de props ---
FormularioProductos.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      producto: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
      precio: PropTypes.number,
      fechaCaducidad: PropTypes.string
    })
  ).isRequired,
  opciones: PropTypes.arrayOf(PropTypes.string).isRequired,
  preciosBase: PropTypes.object,
  conPrecioManual: PropTypes.bool,
  conFecha: PropTypes.bool,
  onAgregar: PropTypes.func.isRequired,
  onContinuar: PropTypes.func.isRequired
};
