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
    } catch (error) {
      alert("Error al eliminar ventas. Inténtalo de nuevo.");
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
            <Button design="Emphasized" icon="add" onClick={() => setOpenCrear(true)}>Crear</Button>
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

        <Dialog
          headerText="Nueva Venta"
          open={openCrear}
          onAfterClose={() => setOpenCrear(false)}
          footer={<Button onClick={() => { agregarVenta(); setOpenCrear(false); }} design="Emphasized">Guardar</Button>}
        >
          <FlexBox style={{ padding: "1rem", gap: "1rem" }} direction="Column">
            <Title level="H6">Productos</Title>
            {nuevaVenta.productos.map((p, i) => (
              <div key={i}>• {p.nombre} - {p.cantidad} x ${p.costo_unitario}</div>
            ))}
            <Select
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, nombre: e.target.selectedOption.textContent })
              }
            >
              <Option selected={nuevoProducto.nombre === "arrachera"}>arrachera</Option>
              <Option selected={nuevoProducto.nombre === "ribeye"}>ribeye</Option>
              <Option selected={nuevoProducto.nombre === "tomahawk"}>tomahawk</Option>
              <Option selected={nuevoProducto.nombre === "diezmillo"}>diezmillo</Option>
            </Select>
            <Input placeholder="Cantidad" value={nuevoProducto.cantidad} onInput={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })} />
            <Input placeholder="Costo Unitario" value={nuevoProducto.costo_unitario} onInput={(e) => setNuevoProducto({ ...nuevoProducto, costo_unitario: e.target.value })} />
            <Button onClick={agregarProducto} design="Transparent">Agregar producto</Button>
          </FlexBox>
        </Dialog>
        <Dialog
          headerText="Editar Venta"
          open={openEditar}
          onAfterClose={() => {
            setOpenEditar(false);
            setVentaEditar(null);
          }}
          footer={<Button onClick={guardarEdicion} design="Emphasized">Guardar cambios</Button>}
        >
          {ventaEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }} direction="Column">
              <Title level="H6">Editar Productos</Title>
              {ventaEditar.productos.map((p, i) => (
                <FlexBox key={i} direction="Row" style={{ gap: "0.5rem" }}>
                  <Select
                    onChange={(e) => actualizarProductoEdicion(i, 'nombre', e.target.selectedOption.textContent)}
                  >
                    <Option selected={p.nombre === "arrachera"}>arrachera</Option>
                    <Option selected={p.nombre === "ribeye"}>ribeye</Option>
                    <Option selected={p.nombre === "tomahawk"}>tomahawk</Option>
                    <Option selected={p.nombre === "diezmillo"}>diezmillo</Option>
                  </Select>
                  <Input
                    value={p.cantidad}
                    placeholder="Cantidad"
                    onInput={(e) => actualizarProductoEdicion(i, 'cantidad', e.target.value)}
                  />
                  <Input
                    value={p.costo_unitario}
                    placeholder="Costo Unitario"
                    onInput={(e) => actualizarProductoEdicion(i, 'costo_unitario', e.target.value)}
                  />
                </FlexBox>
              ))}
            </FlexBox>
          )}
        </Dialog>

        <Dialog headerText="Detalle de Venta" open={!!detalleVenta} onAfterClose={() => setDetalleVenta(null)} footer={<Button onClick={() => setDetalleVenta(null)}>Cerrar</Button>}>
          {detalleVenta && (
            <div style={{ padding: "1rem" }}>
              <p><b>Productos:</b></p>
              <ul>
                {detalleVenta.productos.map((p, i) => (
                  <li key={i}>{p.nombre} - {p.cantidad} x ${p.costo_unitario}</li>
                ))}
              </ul>
              <p><b>Total:</b> ${detalleVenta.total}</p>
            </div>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}
//hola