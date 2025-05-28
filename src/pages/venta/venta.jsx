import { useState, useEffect } from "react";
import {
  FlexBox,
  Card,
  Title,
  Input,
  Button,
  Dialog,
  Select,
  Option
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  getVentas,
  venderProductos,
  eliminarVenta,
  editarVenta
} from "../../services/ventaService";

export default function Venta() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ventasSeleccionadas, setVentasSeleccionadas] = useState([]);
  const [openEditar, setOpenEditar] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState(null);
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
      console.error(error);
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
            <Button design="Negative" icon="delete" disabled={!ventasSeleccionadas.length} onClick={eliminarVentas}>
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
            {ventas.map((venta, i) => (
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
              {agruparProductos(detalleVenta.productos || []).map((p, idx) => (
                <div key={idx} style={{ marginBottom: "0.75rem", fontSize: "0.95rem" }}>
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
      </FlexBox>
    </Layout>
  );
}
