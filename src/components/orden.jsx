// orden.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FlexBox } from "@ui5/webcomponents-react";
import {
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
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import { getOrdenes } from "../services/ordenesService";
import { createOrden } from "../services/ordenesService";
import { deleteOrden, updateOrden } from "../services/ordenesService";
import { completarOrden } from "../services/ordenesService";
import { Select, Option } from "@ui5/webcomponents-react";




const drawerWidth = 240;

export default function Ordenes() {
  const navigate = useNavigate();
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  const [nuevaOrden, setNuevaOrden] = useState({
    estado: "",
    fecha_emision: "",
    fecha_recepcion: "",
    fecha_estimada: "",
    subtotal: "",
    costo: "",
    usuario_solicita: "",
    usuario_provee: "",
    productos: []
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    producto: "arrachera",
    cantidad: "",
    precio: "",
    fecha_caducidad: ""
  });
  

  const loadOrdenes = async () => {
    const data = await getOrdenes();
    setOrdenes(
      data.map((o) => ({
        id: o.ID_ORDEN,
        fecha_emision: o.FECHA_EMISION,
        fecha_recepcion: o.FECHA_RECEPCION,
        fecha_estimada: o.FECHA_RECEPCION_ESTIMADA,
        estado: o.ESTADO,
        subtotal: o.SUBTOTAL,
        costo: o.COSTO_COMPRA,
        usuario_solicita: o.ID_USUARIO_SOLICITA,
        usuario_provee: o.ID_USUARIO_PROVEE
      }))
    );
  };

  useEffect(() => {
    loadOrdenes();
  }, []);

  const eliminarOrdenesSeleccionadas = async () => {
    for (let id of ordenesSeleccionadas) {
      await deleteOrden(id);
    }
    setOrdenesSeleccionadas([]);
    await loadOrdenes();
  };
  const manejarCompletarOrden = async () => {
    const ordenId = ordenesSeleccionadas[0];
    try {
      const respuesta = await completarOrden(ordenId);
      alert(respuesta.message || `Orden ${ordenId} completada.`);
      await loadOrdenes(); // Recargar la lista
      setOrdenesSeleccionadas([]);
    } catch (error) {
      alert(error.response?.data?.error || "Error al completar la orden.");
    }
  };
  const agregarProducto = () => {
    setNuevaOrden({
      ...nuevaOrden,
      productos: [...(nuevaOrden.productos || []), nuevoProducto]
    });
    setNuevoProducto({ producto: "", cantidad: "", precio: "", fecha_caducidad: "" });
  };

  const agregarOrden = async () => {
    const datos = {
      correo_solicita: nuevaOrden.usuario_solicita,
      correo_provee: nuevaOrden.usuario_provee,
      productos: nuevaOrden.productos  // ya no es necesario map
    };

    console.log("📦 Payload que se enviará:", datos);

    const response = await createOrden(datos);

    if (response && response.id_orden) {
      alert(`Orden creada exitosamente con ID: ${response.id_orden}`);
      await loadOrdenes();
      setNuevaOrden({
        estado: "",
        fecha_emision: "",
        fecha_recepcion: "",
        fecha_estimada: "",
        subtotal: "",
        costo: "",
        usuario_solicita: "",
        usuario_provee: "",
        productos: []
      });
    } else {
      alert("Error al crear orden");
    }
  };


  const handleEditarGuardar = async () => {
    const ok = await updateOrden(ordenEditar.id, ordenEditar);
    if (ok) {
      await loadOrdenes();
      setOpenEditar(false);
      setOrdenesSeleccionadas([]);
      alert("Orden actualizada correctamente");
    } else {
      alert("Error al actualizar orden");
    }
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


      <FlexBox direction="Column" style={{ flexGrow: 1, padding: "2rem", marginTop: "4rem", backgroundColor: "#fafafa" }}>
        <Title level="H3">Órdenes</Title>

        <FlexBox direction="Row" justifyContent="End" style={{ marginBottom: "1rem", gap: "0.75rem" }}>
          <Button design="Negative" icon="delete" onClick={eliminarOrdenesSeleccionadas} disabled={ordenesSeleccionadas.length === 0}>Eliminar</Button>
          <Button
            design="Emphasized"
            icon="add"
            onClick={() => {
              const emailUsuario = localStorage.getItem("userEmail") || "";
              setNuevaOrden(prev => ({
                ...prev,
                usuario_solicita: emailUsuario  // precargar
              }));
              setOpenCrear(true);
            }}
          >
            Crear
          </Button>
          <Button design="Attention" icon="edit" disabled={ordenesSeleccionadas.length !== 1} onClick={() => {
            const ordenToEdit = ordenes.find(o => o.id === ordenesSeleccionadas[0]);
            if (ordenToEdit) {
              setOrdenEditar(ordenToEdit);
              setOpenEditar(true);
            }
          }}>Editar</Button>
          <Button
            design="Positive"
            icon="shipping-status"
            disabled={ordenesSeleccionadas.length !== 1}
            onClick={manejarCompletarOrden}
          >
            Completar
          </Button>
        </FlexBox>



        <Card style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0"
        }}>
          <Title level="H5" style={{ marginTop: "1rem", marginLeft: "1rem", marginRight: "1rem", marginBottom: "1rem" }}>
            Base de Datos de Órdenes
          </Title>
          <div style={{ overflowX: "auto", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Segoe UI", fontSize: "14px" }}>
              <thead style={{ backgroundColor: "#f9f9f9", position: "sticky", top: 0 }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}></th>
                  <th style={{ padding: "12px", textAlign: "left" }}>ID Orden</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Fecha Emisión</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Recepción</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Recepción Estimada</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Subtotal</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Costo Compra</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Solicitante</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Proveedor</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id} style={{ borderBottom: "1px solid #eee", backgroundColor: "#fff" }}>
                    <td style={{ padding: "10px" }}>
                      <input
                        type="checkbox"
                        checked={ordenesSeleccionadas.includes(orden.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setOrdenesSeleccionadas(prev =>
                            checked
                              ? [...prev, orden.id]
                              : prev.filter(id => id !== orden.id)
                          );
                        }}
                      />
                    </td>
                    <td style={{ padding: "10px" }}>{orden.id}</td>
                    <td style={{ padding: "10px" }}>{orden.fecha_emision}</td>
                    <td style={{ padding: "10px" }}>{orden.fecha_recepcion}</td>
                    <td style={{ padding: "10px" }}>{orden.fecha_estimada}</td>
                    <td style={{ padding: "10px", fontWeight: "bold", color: orden.estado === "completada" ? "#388e3c" : "#f57c00" }}>
                      {orden.estado}
                    </td>
                    <td style={{ padding: "10px" }}>${orden.subtotal}</td>
                    <td style={{ padding: "10px" }}>${orden.costo}</td>
                    <td style={{ padding: "10px" }}>{orden.usuario_solicita}</td>
                    <td style={{ padding: "10px" }}>{orden.usuario_provee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog
          headerText="Agregar Orden"
          open={openCrear}
          onAfterClose={() => setOpenCrear(false)}
          footer={
            <Button
              design="Emphasized"
              onClick={() => {
                if (!nuevaOrden.usuario_solicita.trim() || !nuevaOrden.usuario_provee.trim()) {
                  alert("⚠️ Por favor completa los correos de quien solicita y quien provee.");
                  return;
                }
                agregarOrden();
                setOpenCrear(false);
              }}
            >
              Guardar
            </Button>

          }
        >
          <FlexBox style={{ padding: "1rem", gap: "1rem" }} direction="Column">
            {/* Sección de correos */}
            <Title level="H6">Información de usuarios</Title>
            <Input
              placeholder="Correo quien solicita"
              value={nuevaOrden.usuario_solicita}
              onInput={(e) => setNuevaOrden({ ...nuevaOrden, usuario_solicita: e.target.value })}
            />
            <Input
              placeholder="Correo quien provee"
              value={nuevaOrden.usuario_provee}
              onInput={(e) => setNuevaOrden({ ...nuevaOrden, usuario_provee: e.target.value })}
            />

            {/* Sección de productos */}
            <Title level="H6">Producto a agregar</Title>
            <Select
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, producto: e.target.selectedOption.textContent })
              }
            >
              <Option selected={nuevoProducto.producto === "arrachera"}>arrachera</Option>
              <Option selected={nuevoProducto.producto === "ribeye"}>ribeye</Option>
              <Option selected={nuevoProducto.producto === "tomahawk"}>tomahawk</Option>
              <Option selected={nuevoProducto.producto === "diezmillo"}>diezmillo</Option>
            </Select>
            <Input
              placeholder="Cantidad"
              value={nuevoProducto.cantidad}
              onInput={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })}
            />
            <Input
              placeholder="Precio"
              value={nuevoProducto.precio}
              onInput={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            />
            <Input
              placeholder="Fecha de Caducidad"
              value={nuevoProducto.fecha_caducidad}
              onInput={(e) => setNuevoProducto({ ...nuevoProducto, fecha_caducidad: e.target.value })}
            />
            <Button onClick={agregarProducto} design="Transparent">
              Agregar producto
            </Button>

          </FlexBox>
        </Dialog>
        <Dialog headerText="Editar Orden" open={openEditar} onAfterClose={() => setOpenEditar(false)} footer={<Button design="Emphasized" onClick={handleEditarGuardar}>Guardar</Button>}>
          {ordenEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
              <Input placeholder="Estado" value={ordenEditar.estado} onInput={(e) => setOrdenEditar({ ...ordenEditar, estado: e.target.value })} />
              <Input placeholder="Fecha Emisión" value={ordenEditar.fecha_emision} onInput={(e) => setOrdenEditar({ ...ordenEditar, fecha_emision: e.target.value })} />
              <Input placeholder="Recepción" value={ordenEditar.fecha_recepcion} onInput={(e) => setOrdenEditar({ ...ordenEditar, fecha_recepcion: e.target.value })} />
              <Input placeholder="Recepción Estimada" value={ordenEditar.fecha_estimada} onInput={(e) => setOrdenEditar({ ...ordenEditar, fecha_estimada: e.target.value })} />
              <Input placeholder="Subtotal" value={ordenEditar.subtotal} onInput={(e) => setOrdenEditar({ ...ordenEditar, subtotal: e.target.value })} />
              <Input placeholder="Costo Compra" value={ordenEditar.costo} onInput={(e) => setOrdenEditar({ ...ordenEditar, costo: e.target.value })} />
              <Input placeholder="ID Usuario Solicita" value={ordenEditar.usuario_solicita} onInput={(e) => setOrdenEditar({ ...ordenEditar, usuario_solicita: e.target.value })} />
              <Input placeholder="ID Usuario Provee" value={ordenEditar.usuario_provee} onInput={(e) => setOrdenEditar({ ...ordenEditar, usuario_provee: e.target.value })} />
            </FlexBox>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}
