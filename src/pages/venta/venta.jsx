import { useState, useEffect } from "react";
import {
  FlexBox,
  Card,
  Title,
  Input,
  Button,
  Dialog
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  getVentas,
  eliminarVenta,
  editarVenta
} from "../../services/ventaService";
import { useNotificaciones } from "../../utils/NotificacionesContext";
import { agregarNotificacion } from "../../components/Notificaciones";


export default function Venta() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [openEditar, setOpenEditar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);
  const { setNotificaciones } = useNotificaciones();

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

  // Función para eliminar ventas seleccionadas
  const eliminarVentas = async () => {
    try {
      for (const id of ventasSeleccionadas) {
        await eliminarVenta(id);
      }
      const nuevasVentas = ventas.filter(v => !ventasSeleccionadas.includes(v.id));
      setVentas(nuevasVentas);
      setVentasSeleccionadas([]);
      agregarNotificacion(
        "success",
        "Ventas eliminadas correctamente",
        setNotificaciones)
    } catch (error) {
      // Si después del error las ventas ya no están, muestra éxito
      const nuevasVentas = ventas.filter(v => !ventasSeleccionadas.includes(v.id));
      setVentas(nuevasVentas);
      setVentasSeleccionadas([]);
      if (nuevasVentas.length < ventas.length) {
        agregarNotificacion(
          "success",
          "Ventas eliminadas correctamente",
          setNotificaciones
        )
      } else {
        agregarNotificacion(
          "error",
          "Error al eliminar las ventas. Inténtalo de nuevo.",
          setNotificaciones
        );
      }
      console.error(error);
    }
  };

  // Función para guardar la edición de una venta
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

      agregarNotificacion(
        "success",
        `Venta ${ventaEditar.id} actualizada correctamente`,
        setNotificaciones);
    } catch (error) {
      agregarNotificacion(
        "error",
        "Error al actualizar la venta. Inténtalo de nuevo.",
        setNotificaciones);
      console.error("Error al actualizar la venta:", error);
    }
  };

  function agruparProductos(productos) {
    const agrupados = {};
    productos.forEach(p => {
      const nombre = p.nombre || p.producto;
      if (!agrupados[nombre]) {
        agrupados[nombre] = {
          nombre,
          cantidad: Number(p.cantidad) || 1,
          precio: Number(p.costo_unitario || p.precio) || 0,
          total: (Number(p.cantidad) || 1) * (Number(p.costo_unitario || p.precio) || 0)
        };
      } else {
        agrupados[nombre].cantidad += Number(p.cantidad) || 1;
        agrupados[nombre].total += (Number(p.cantidad) || 1) * (Number(p.costo_unitario || p.precio) || 0);
      }
    });
    return Object.values(agrupados);
  }

  return (
    <Layout>
      <FlexBox direction="Column" style={{ flexGrow: 1, marginTop: "2rem", padding: "2rem", backgroundColor: "#fafafa" }}>
        <Title level="H4">Ventas</Title>

        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Buscar por Cliente"
            style={{ width: "300px" }}
            value={busqueda}
            onInput={(e) => setBusqueda(e.target.value)}
          />
          <FlexBox direction="Row" style={{ gap: "0.5rem" }}>
            <Button
              design="Negative"
              icon="delete" // Este es el icono de bote de basura
              disabled={!ventasSeleccionadas.length}
              onClick={eliminarVentas}
            >
              Eliminar
            </Button>
            <Button design="Emphasized" icon="add" onClick={() => navigate("/venta/nueva")}>
              Crear
            </Button>
            <Button
              design="Attention"
              icon="edit"
              disabled={ventasSeleccionadas.length !== 1}
              onClick={() => {
                const venta = ventas.find(v => v.id === ventasSeleccionadas[0]);
                if (venta) {
                  setVentaEditar(venta);
                  setOpenEditar(true);
                }
              }}
            >
              Editar
            </Button>
          </FlexBox>
        </FlexBox>

        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>Base de Datos de Ventas</Title>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ventas.map((venta, _i) => (
              <li key={venta.id} style={{
                background: "#fff",
                marginBottom: "10px",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}>
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
                    <span style={{ marginLeft: "1rem" }}>
                      <b>Venta #{venta.id}</b>
                    </span>
                  </div>
                  <Button design="Transparent" onClick={() => setDetalleVenta(venta)}>Ver Detalles</Button>
                </FlexBox>
              </li>
            ))}
          </ul>
        </Card>

        {detalleVenta && (
          <Dialog
            headerText={`Detalles de Venta #${detalleVenta.id}`}
            open
            footer={
              <Button design="Emphasized" onClick={() => setDetalleVenta(null)}>Cerrar</Button>
            }
            preventOutsideClose
          >
            <FlexBox direction="Column" style={{ padding: "1rem" }}>
              {agruparProductos(detalleVenta.productos || []).map((p) => (
                <div key={p.nombre} style={{ marginBottom: "0.75rem", fontSize: "0.95rem" }}>
                  <strong>Producto:</strong> {p.nombre} <br />
                  <strong>Cantidad:</strong> {p.cantidad} <br />
                  <strong>Precio unitario:</strong> ${p.precio} <br />
                  <strong>Total producto:</strong> ${p.total}
                </div>
              ))}
              <div style={{ fontWeight: "bold", marginTop: "1rem" }}>
                Total: ${detalleVenta.total}
              </div>
            </FlexBox>
          </Dialog>
        )}

        {/* Ejemplo de diálogo de edición (puedes personalizarlo) */}
        {openEditar && ventaEditar && (
          <Dialog
            headerText={`Editar Venta #${ventaEditar.id}`}
            open
            footer={
              <>
                <Button design="Emphasized" onClick={guardarEdicion}>Guardar</Button>
                <Button onClick={() => setOpenEditar(false)}>Cancelar</Button>
              </>
            }
            preventOutsideClose
          >
            {/* Aquí puedes agregar los campos para editar los productos de la venta */}
            <FlexBox direction="Column" style={{ padding: "1rem" }}>
              {ventaEditar.productos.map((p, idx) => (
                <div key={`${p.nombre}-${p.cantidad}-${p.costo_unitario}`} style={{ marginBottom: "0.75rem" }}>
                  <Input
                    value={p.nombre}
                    placeholder="Nombre"
                    style={{ marginRight: "0.5rem" }}
                    onInput={e => {
                      const productos = [...ventaEditar.productos];
                      productos[idx].nombre = e.target.value;
                      setVentaEditar({ ...ventaEditar, productos });
                    }}
                  />
                  <Input
                    value={p.cantidad}
                    placeholder="Cantidad"
                    type="number"
                    style={{ marginRight: "0.5rem" }}
                    onInput={e => {
                      const productos = [...ventaEditar.productos];
                      productos[idx].cantidad = e.target.value;
                      setVentaEditar({ ...ventaEditar, productos });
                    }}
                  />
                  <Input
                    value={p.costo_unitario}
                    placeholder="Costo Unitario"
                    type="number"
                    onInput={e => {
                      const productos = [...ventaEditar.productos];
                      productos[idx].costo_unitario = e.target.value;
                      setVentaEditar({ ...ventaEditar, productos });
                    }}
                  />
                </div>
              ))}
            </FlexBox>
          </Dialog>
        )}

      </FlexBox>
    </Layout>
  );
}
