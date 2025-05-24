// SeleccionVenta.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlexBox,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Title,
  Select,
  Option,
  Input,
  Button
} from "@ui5/webcomponents-react";

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
      { producto, cantidad, precio, fechaCaducidad }
    ]);
    setCantidad("");
    setPrecio("");
    setFechaCaducidad("");
  };

  const handleContinuar = () => {
    if (tablaProductos.length === 0) {
      alert("Agrega al menos un producto antes de continuar.");
      return;
    }
    navigate("/venta/nueva/confirmar", { state: { productos: tablaProductos } });
  };

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: "40px" }} />}
        primaryTitle="Fs"
        profile={{ image: "/viba1.png" }}
        style={{ width: "100%", background: "#B71C1C", color: "white", position: "fixed", zIndex: 1201 }}
      />
      <div style={{ width: 240, marginTop: "3.5rem", backgroundColor: "#fff" }}>
        <SideNavigation>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
      </div>

      <FlexBox direction="Column" style={{ flexGrow: 1, marginTop: "4rem", padding: "2rem", backgroundColor: "#EFF5FF" }} alignItems="Center">
        <Title level="H4" style={{ marginBottom: "1rem" }}>Selecciona los productos</Title>

        <FlexBox direction="Row" style={{ width: "80%", justifyContent: "space-around", marginBottom: "2rem" }}>
          <table style={{ borderCollapse: "collapse", width: "40%", backgroundColor: "#F5FAFF" }}>
            <thead>
              <tr style={{ backgroundColor: "#D9EFFF" }}>
                <th style={{ border: "1px solid #A9CCE3", padding: "12px", textAlign: "center", color: "#0B3C5D" }}>Producto</th>
                <th style={{ border: "1px solid #A9CCE3", padding: "12px", textAlign: "center", color: "#0B3C5D" }}>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {tablaProductos.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #A9CCE3", padding: "12px", textAlign: "center", color: "#000" }}>{item.producto}</td>
                  <td style={{ border: "1px solid #A9CCE3", padding: "12px", textAlign: "center", color: "#000" }}>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <FlexBox direction="Column" style={{ width: "40%", backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Select
              style={{ height: "48px", marginBottom: "1rem" }}
              value={producto}
              onChange={(e) => setProducto(e.target.selectedOption.textContent)}
            >
              <Option selected>Arrachera</Option>
              <Option>Ribeye</Option>
              <Option>Tomahawk</Option>
              <Option>Diezmillo</Option>
            </Select>
            <FlexBox direction="Row" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <Input placeholder="Cantidad" value={cantidad} onInput={(e) => setCantidad(e.target.value)} />
              <Input placeholder="Precio" value={precio} onInput={(e) => setPrecio(e.target.value)} />
            </FlexBox>
            <Input placeholder="Fecha de caducidad" value={fechaCaducidad} onInput={(e) => setFechaCaducidad(e.target.value)} style={{ marginBottom: "1rem" }} />
            <Button onClick={handleAgregarProducto} design="Emphasized">Agregar producto</Button>
          </FlexBox>
        </FlexBox>

        <Button onClick={handleContinuar} design="Emphasized" style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}>
          Continuar
        </Button>
      </FlexBox>
    </FlexBox>
  );
}
