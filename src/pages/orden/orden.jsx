import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FlexBox,
  Card,
  Title,
  Input,
  Button,
  Dialog
} from "@ui5/webcomponents-react";
import Layout from "../../components/Layout";
import { getOrdenes, deleteOrden, updateOrden, completarOrden } from "../../services/ordenesService";
import PropTypes from "prop-types";

// Componente auxiliar para encabezados de tabla con ordenamiento
function SortableTh({ label, value, setValue, clearAllSorts }) {
  return (
    <th style={{ padding: "12px", fontWeight: "600", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {label}
        <select
          value={value || ""}
          onChange={e => {
            clearAllSorts();
            setValue(e.target.value);
          }}
          style={{
            border: "1px solid #ccc",
            background: "white",
            fontSize: "0.9rem",
            cursor: "pointer",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          <option value="">⇅</option>
          <option value="asc">↑ A-Z</option>
          <option value="desc">↓ Z-A</option>
        </select>
      </div>
    </th>
  );
}

SortableTh.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  clearAllSorts: PropTypes.func.isRequired
};

// Limpia todos los estados de ordenamiento excepto el que se va a activar
function clearAllSortsExceptFactory(setters, setter) {
  return () => {
    setters.forEach(s => s(null));
    setter && setter();
  };
}

// Refactor: función de comparación para cada campo
function compareByField(a, b, field, type = "string", order = "asc") {
  let valA = a?.[field];
  let valB = b?.[field];
  if (type === "date") {
    valA = new Date(valA);
    valB = new Date(valB);
    return order === "asc" ? valA - valB : valB - valA;
  }
  if (type === "number") {
    valA = Number(valA) || 0;
    valB = Number(valB) || 0;
    return order === "asc" ? valA - valB : valB - valA;
  }
  // string
  valA = (valA ?? "").toString();
  valB = (valB ?? "").toString();
  return order === "asc"
    ? valA.localeCompare(valB)
    : valB.localeCompare(valA);
}

// Lógica de ordenamiento separada para reducir complejidad
function ordenarOrdenes(ordenes, sorts) {
  const sortFields = [
    { key: "ordenIdSort", field: "id", type: "number" },
    { key: "ordenFechaSort", field: "fecha_emision", type: "date" },
    { key: "ordenEstadoSort", field: "estado", type: "string" },
    { key: "recepcionSort", field: "fecha_recepcion", type: "date" },
    { key: "recepcionEstimadaSort", field: "fecha_estimada", type: "date" },
    { key: "subtotalSort", field: "subtotal", type: "number" },
    { key: "costoSort", field: "costo", type: "number" },
    { key: "solicitanteSort", field: "usuario_solicita", type: "string" },
    { key: "proveedorSort", field: "usuario_provee", type: "string" }
  ];

  const activeSort = sortFields.find(f => sorts[f.key]);
  if (!activeSort) return [...ordenes];

  const order = sorts[activeSort.key];
  return [...ordenes].sort((a, b) =>
    compareByField(a, b, activeSort.field, activeSort.type, order)
  );
}

// Componente para la fila de la tabla
function OrdenRow({ orden, ordenesSeleccionadas, setOrdenesSeleccionadas }) {
  const handleCheckbox = (e) => {
    const checked = e.target.checked;
    setOrdenesSeleccionadas(prev =>
      checked
        ? [...prev, orden.id]
        : prev.filter(id => id !== orden.id)
    );
  };

  return (
    <tr key={orden.id} style={{ borderBottom: "1px solid #eee", backgroundColor: "#fff" }}>
      <td style={{ padding: "12px" }}>
        <input
          type="checkbox"
          checked={ordenesSeleccionadas.includes(orden.id)}
          onChange={handleCheckbox}
        />
      </td>
      <td style={{ padding: "12px" }}>{orden.id}</td>
      <td style={{ padding: "12px" }}>{orden.fecha_emision}</td>
      <td style={{
        padding: "12px",
        fontWeight: "bold",
        color: orden.estado === "completada" ? "#388e3c" : "#f57c00"
      }}>
        {orden.estado}
      </td>
      <td style={{ padding: "12px" }}>{orden.fecha_recepcion}</td>
      <td style={{ padding: "12px" }}>{orden.fecha_estimada}</td>
      <td style={{ padding: "12px" }}>${orden.subtotal}</td>
      <td style={{ padding: "12px" }}>${orden.costo}</td>
      <td style={{ padding: "12px" }}>{orden.usuario_solicita}</td>
      <td style={{ padding: "12px" }}>{orden.usuario_provee}</td>
    </tr>
  );
}

OrdenRow.propTypes = {
  orden: PropTypes.object.isRequired,
  ordenesSeleccionadas: PropTypes.array.isRequired,
  setOrdenesSeleccionadas: PropTypes.func.isRequired
};

export default function Ordenes() {
  const navigate = useNavigate();
  const [openEditar, setOpenEditar] = useState(false);
  const [ordenEditar, setOrdenEditar] = useState(null);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  // Filtros y ordenamiento
  const [busqueda, setBusqueda] = useState("");
  const [ordenIdSort, setOrdenIdSort] = useState(null);
  const [ordenFechaSort, setOrdenFechaSort] = useState(null);
  const [ordenEstadoSort, setOrdenEstadoSort] = useState(null);
  const [recepcionSort, setRecepcionSort] = useState(null);
  const [recepcionEstimadaSort, setRecepcionEstimadaSort] = useState(null);
  const [subtotalSort, setSubtotalSort] = useState(null);
  const [costoSort, setCostoSort] = useState(null);
  const [solicitanteSort, setSolicitanteSort] = useState(null);
  const [proveedorSort, setProveedorSort] = useState(null);

  const setters = [
    setOrdenIdSort,
    setOrdenFechaSort,
    setOrdenEstadoSort,
    setRecepcionSort,
    setRecepcionEstimadaSort,
    setSubtotalSort,
    setCostoSort,
    setSolicitanteSort,
    setProveedorSort
  ];

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

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fecha_recepcion = `${yyyy}-${mm}-${dd}`;

  const manejarCompletarOrden = async () => {
    const ordenId = ordenesSeleccionadas[0];
    try {
      const respuesta = await completarOrden(ordenId, fecha_recepcion);
      alert(respuesta?.message || `Orden ${ordenId} completada.`);
      await loadOrdenes();
      setOrdenesSeleccionadas([]);
    } catch (error) {
      alert(error?.response?.data?.error || "Error al completar la orden.");
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

  // Filtrado y ordenamiento aplicados antes de renderizar
  const ordenesFiltradasYOrdenadas = ordenarOrdenes(
    ordenes.filter((o) => o.estado?.toLowerCase().includes(busqueda.toLowerCase())),
    {
      ordenIdSort,
      ordenFechaSort,
      ordenEstadoSort,
      recepcionSort,
      recepcionEstimadaSort,
      subtotalSort,
      costoSort,
      solicitanteSort,
      proveedorSort
    }
  );

  return (
    <Layout>
      <FlexBox direction="Column" style={{ flexGrow: 1, padding: "2rem", marginTop: "2rem", backgroundColor: "#fafafa" }}>
        <Title level="H3">Órdenes</Title>

        {/* Barra de filtros y acciones */}
        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem", width: "100%" }}>
          <Input
            placeholder="Buscar por Estado"
            style={{ width: "300px" }}
            icon="search"
            value={busqueda}
            onInput={(e) => setBusqueda(e.target.value)}
          />
          <FlexBox direction="Row" justifyContent="End" style={{ gap: "0.75rem" }}>
            <Button design="Negative" icon="delete" onClick={eliminarOrdenesSeleccionadas} disabled={ordenesSeleccionadas.length === 0}>
              Eliminar
            </Button>
            <Button
              design="Emphasized"
              icon="add"
              onClick={() => {
                navigate("/orden/nueva/proveedor");
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
        </FlexBox>

        <Card style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0",
          width: "100%",
          alignSelf: "stretch"
        }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "0.5rem 0 0.5rem 1.5rem" }}>Base de Datos de Órdenes</Title>
          <div style={{ overflowX: "auto", borderRadius: "8px", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Segoe UI", fontSize: "15px" }}>
              <thead style={{ backgroundColor: "#f9f9f9", position: "sticky", top: 0 }}>
                <tr>
                  <th style={{ padding: "12px" }}></th>
                  <SortableTh
                    label="ID Orden"
                    value={ordenIdSort}
                    setValue={setOrdenIdSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setOrdenIdSort)}
                  />
                  <SortableTh
                    label="Fecha Emisión"
                    value={ordenFechaSort}
                    setValue={setOrdenFechaSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setOrdenFechaSort)}
                  />
                  <SortableTh
                    label="Estado"
                    value={ordenEstadoSort}
                    setValue={setOrdenEstadoSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setOrdenEstadoSort)}
                  />
                  <SortableTh
                    label="Recepción"
                    value={recepcionSort}
                    setValue={setRecepcionSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setRecepcionSort)}
                  />
                  <SortableTh
                    label="Recepción Estimada"
                    value={recepcionEstimadaSort}
                    setValue={setRecepcionEstimadaSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setRecepcionEstimadaSort)}
                  />
                  <SortableTh
                    label="Subtotal"
                    value={subtotalSort}
                    setValue={setSubtotalSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setSubtotalSort)}
                  />
                  <SortableTh
                    label="Costo Compra"
                    value={costoSort}
                    setValue={setCostoSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setCostoSort)}
                  />
                  <SortableTh
                    label="Solicitante"
                    value={solicitanteSort}
                    setValue={setSolicitanteSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setSolicitanteSort)}
                  />
                  <SortableTh
                    label="Proveedor"
                    value={proveedorSort}
                    setValue={setProveedorSort}
                    clearAllSorts={clearAllSortsExceptFactory(setters, () => setProveedorSort)}
                  />
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradasYOrdenadas.map((orden) => (
                  <OrdenRow
                    key={orden.id}
                    orden={orden}
                    ordenesSeleccionadas={ordenesSeleccionadas}
                    setOrdenesSeleccionadas={setOrdenesSeleccionadas}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog
          headerText="Editar Orden"
          open={openEditar}
          onAfterClose={() => setOpenEditar(false)}
          footer={<Button design="Emphasized" onClick={handleEditarGuardar}>Guardar</Button>}
        >
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
    </Layout>
  );
}
