// venta.jsx
import { useState } from "react";
import {
  FlexBox,
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Card,
  Title,
  Input,
  Button,
  Dialog
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getVentas, venderProductos, eliminarVenta } from "../services/ventaService";
import { editarVenta } from "../services/ventaService";
import { Select, Option } from "@ui5/webcomponents-react";

export default function Venta() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [nuevaVenta, setNuevaVenta] = useState({ productos: [] });
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "arrachera",
    cantidad: "",
    costo_unitario: ""
  });
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const data = await getVentas();
        setVentas(data);
      } catch (error) {
        console.error("Error al cargar ventas:", error);
        alert("Error al cargar ventas");
      }
    };
    cargarVentas();
  }, []);

  const agregarProducto = () => {
    setNuevaVenta({
      ...nuevaVenta,
      productos: [...nuevaVenta.productos, nuevoProducto]
    });
    setNuevoProducto({ nombre: "", cantidad: "", costo_unitario: "" });
  };

  const agregarVenta = async () => {
    try {
      const productosParaEnviar = nuevaVenta.productos
        .filter(p => p.nombre && !isNaN(parseInt(p.cantidad)))
        .map(p => ({
          producto: p.nombre,
          cantidad: parseInt(p.cantidad)
        }));

      if (productosParaEnviar.length === 0) {
        alert("⚠️ Agrega al menos un producto válido con nombre y cantidad.");
        return;
      }

      const response = await venderProductos(productosParaEnviar);

      alert(`✅ Venta realizada exitosamente. ID de venta: ${response.id_venta}`);

      setVentas([...ventas, {
        id: response.id_venta,
        productos: nuevaVenta.productos,
        total: response.total,
        cantidad: productosParaEnviar.reduce((acc, p) => acc + p.cantidad, 0)
      }]);

      setNuevaVenta({ productos: [] });
    } catch (error) {
      const msg = error.response?.data?.error || "Error al realizar la venta.";
      alert(`❌ ${msg}`);
    }
  };

  const eliminarVentas = async () => {
    try {
      for (const id of ventasSeleccionadas) {
        await eliminarVenta(id);
      }

      const nuevasVentas = ventas.filter(v => !ventasSeleccionadas.includes(v.id));
      setVentas(nuevasVentas);
      setVentasSeleccionadas([]);

      alert("Ventas eliminadas correctamente");
    } catch(error){
      alert("Error al eliminar ventas. Inténtalo de nuevo.")
      print(error);
    }
  };

  const guardarEdicion = async () => {
    try {
      const productosParaEnviar = ventaEditar.productos.map((p) => ({
        nombre: p.nombre,
        cantidad: parseInt(p.cantidad),
        costo_unitario: parseFloat(p.costo_unitario)
      }));

      const response = await editarVenta(ventaEditar.id, productosParaEnviar);

      const ventasActualizadas = ventas.map((v) => {
        if (v.id === ventaEditar.id) {
          return {
            ...ventaEditar,
            productos: productosParaEnviar,
            total: response.total,
            cantidad: productosParaEnviar.reduce((acc, p) => acc + p.cantidad, 0)
          };
        }
        return v;
      });

      setVentas(ventasActualizadas);
      setOpenEditar(false);
      setVentaEditar(null);
      setVentasSeleccionadas([]);

      alert(`Venta ${ventaEditar.id} actualizada correctamente`);
    } catch (error) {
      alert("Error al actualizar la venta");
      console.error("Error al actualizar la venta:", error);
    }
  };

  const actualizarProductoEdicion = (index, campo, valor) => {
    const productosActualizados = [...ventaEditar.productos];
    productosActualizados[index][campo] = valor;
    setVentaEditar({
      ...ventaEditar,
      productos: productosActualizados
    });
  };

  const handleNavigationClick = (e) => {
    const route = e.detail.item.dataset.route;
    if (route) navigate(route);
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
        <SideNavigation onSelectionChange={handleNavigationClick}>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
      </div>

      <FlexBox direction="Column" style={{ flexGrow: 1, marginTop: "4rem", padding: "2rem", backgroundColor: "#fafafa" }}>
        <Title level="H4">Ventas</Title>

        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem" }}>
          <Input placeholder="Buscar por Cliente" style={{ width: "300px" }} value={busqueda} onInput={(e) => setBusqueda(e.target.value)} />
          <FlexBox direction="Row" style={{ gap: "0.5rem" }}>
            <Button design="Negative" icon="delete" disabled={!ventasSeleccionadas.length} onClick={eliminarVentas}>Eliminar</Button>
            <Button design="Emphasized" icon="add" onClick={() => navigate("/venta/nueva")}>Crear</Button>
            <Button design="Attention" icon="edit" disabled={ventasSeleccionadas.length !== 1} onClick={() => {
              const venta = ventas.find(v => v.id === ventasSeleccionadas[0]);
              if (venta) {
                setVentaEditar(venta);
                setOpenEditar(true);
              }
            }}>Editar</Button>
          </FlexBox>
        </FlexBox>

        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>Base de Datos de Ventas</Title>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ventas.map((venta, i) => (
              <li key={venta.id} style={{ background: "#fff", marginBottom: "10px", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                <FlexBox justifyContent="SpaceBetween" alignItems="Center">
                  <div>
                    <input
                      type="checkbox"
                      checked={ventasSeleccionadas.includes(venta.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) setVentasSeleccionadas([...ventasSeleccionadas, venta.id]);
                        else setVentasSeleccionadas(ventasSeleccionadas.filter(id => id !== venta.id));
                      }}
                    />
                    <span style={{ marginLeft: "1rem" }}><b>Venta {i + 1}</b></span>
                  </div>
                  <Button design="Transparent" onClick={() => setDetalleVenta(venta)}>Ver Detalles</Button>
                </FlexBox>
              </li>
            ))}
          </ul>
        </Card>

        {/* Los diálogos se mantienen sin cambios */}

      </FlexBox>
    </FlexBox>
  );
}
