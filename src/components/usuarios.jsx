import { useState, useEffect } from "react";
import { FlexBox } from "@ui5/webcomponents-react";
import { ShellBar, SideNavigation, SideNavigationItem } from "@ui5/webcomponents-react"
import { Card, Title, Input } from "@ui5/webcomponents-react";
import { Button } from "@ui5/webcomponents-react";
import { Dialog, Select, Option } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/add.js";
import { useNavigate } from "react-router-dom";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../services/usersService";




const drawerWidth = 240;

export default function Usuarios() {
  const navigate = useNavigate();
  const [isSidebarOpen] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [ordenNombre, setOrdenNombre] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenCorreo, setOrdenCorreo] = useState(null);
  const [ordenTipo, setOrdenTipo] = useState(null);
  const [usuarios, setUsuarios] = useState([]);








  //Placeholders
  const loadUsuarios = async () => {
    const data = await getUsuarios(); // Llamada al backend
    console.log("👉 Data cruda desde API:", data); // <--- AQUI
  
    const usuariosMapeados = data.map((u) => ({
      id: u.ID_USUARIO, // ✅ aquí está tu ID correcto
      nombre: u.NOMBRE,
      correo: u.EMAIL,
      rol: u.ROL
    }));    
  
    setUsuarios(usuariosMapeados);
  };
  

  useEffect(() => {
    loadUsuarios();
  }, []);

  const agregarUsuario = async () => {
    if (!nuevoUsuario.rol) {
      setNuevoUsuario({ ...nuevoUsuario, rol: "Owner" }); // Valor predeterminado
    }
    const nuevo = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.correo,
      password: "123456",
      rol: nuevoUsuario.rol
    };
    const ok = await createUsuario(nuevo);
    if (ok) {
      await loadUsuarios();
      setNuevoUsuario({ nombre: "", correo: "", rol: "Owner" }); // Reinicia con valor predeterminado
    }
  };

  const eliminarUsuariosSeleccionados = async () => {
    for (let id of usuariosSeleccionados) {
      await deleteUsuario(id);
    }
    setUsuariosSeleccionados([]);
    await loadUsuarios();
  };

  const handleEditarGuardar = async () => {
    if (!usuarioEditar) return;

    const actualizado = {
      nombre: usuarioEditar.nombre,
      email: usuarioEditar.correo,
      password: "", // No cambia si no se especifica
      rol: usuarioEditar.rol
    };

    const ok = await updateUsuario(usuarioEditar.id, actualizado);
    if (ok) {
      await loadUsuarios(); // Recarga la lista de usuarios desde la base de datos
      setOpenEditar(false); // Cierra el modal
      setUsuariosSeleccionados([]); // Limpia la selección
    } else {
      console.error("Error al actualizar el usuario");
    }
  };



  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    rol: "Owner" // Valor predeterminado
  });

  const handleNavigationClick = (event) => {
    const selected = event.detail.item.dataset.route;
    if (selected) navigate(selected);
  };

  const handleInputChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  {/* Box Crear Usuarios */ }
  <Dialog
    headerText="Agregar Usuario"
    open={openCrear}
    onAfterClose={() => setOpenCrear(false)}
    footer={
      <Button design="Emphasized" onClick={() => {
        agregarUsuario();
        setOpenCrear(false);
      }}>Guardar</Button>
    }
  >
    <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
      <Input
        placeholder="Nombre"
        name="nombre"
        value={nuevoUsuario.nombre}
        onInput={handleInputChange}
      />
      <Input
        placeholder="Correo"
        name="correo"
        value={nuevoUsuario.correo}
        onInput={handleInputChange}
      />
      <Select
        name="rol"
        value={nuevoUsuario.rol}
        onChange={(e) =>
          setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
        }
      >
        <Option value="Owner">Owner</Option>
        <Option value="Proveedor">Proveedor</Option>
        <Option value="Detallista">Detallista</Option>
      </Select>
    </FlexBox>
  </Dialog>

  {/* Box editar usuarios */ }
  <Dialog
    headerText="Editar Usuario"
    open={openEditar}
    onAfterClose={() => setOpenEditar(false)}
    footer={
      <Button design="Emphasized" onClick={handleEditarGuardar}>Guardar</Button>
    }
  >
    {usuarioEditar && (
      <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
        <Input
          placeholder="Nombre"
          value={usuarioEditar.nombre}
          onInput={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
        />
        <Input
          placeholder="Correo"
          value={usuarioEditar.correo}
          onInput={(e) => setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })}
        />
        <Select
          value={usuarioEditar?.rol || "Owner"} // Valor predeterminado si está vacío
          onChange={(e) =>
            setUsuarioEditar({ ...usuarioEditar, rol: e.target.value })
          }
        >
          <Option value="Owner">Owner</Option>
          <Option value="Proveedor">Proveedor</Option>
          <Option value="Detallista">Detallista</Option>
        </Select>
      </FlexBox>
    )}
  </Dialog>

  return (
    <FlexBox direction="Row" style={{ height: "100vh", width: "100vw" }}>
      <ShellBar
        logo={<img src="/viba1.png" alt="Carnes ViBa" style={{ height: "40px" }} />}
        primaryTitle="Usuarios"
        onProfileClick={() => navigate("/login")}
        profile={{ image: "/viba1.png" }}
        style={{
          width: "100%",
          background: "#B71C1C",
          color: "white",
          position: "fixed",
          zIndex: 1201,
        }}
      />

      {isSidebarOpen && (
        <div
          style={{
            width: drawerWidth,
            marginTop: "3.5rem",
            height: "calc(100vh - 3.5rem)",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          }}
        >
        <SideNavigation onSelectionChange={handleNavigationClick}>
          <SideNavigationItem icon="home" text="Dashboard" data-route="/home" />
          <SideNavigationItem icon="retail-store" text="Producto" data-route="/producto" />
          <SideNavigationItem icon="employee" text="Usuarios" data-route="/usuarios" />
          <SideNavigationItem icon="shipping-status" text="Órdenes" data-route="/orden" />
          <SideNavigationItem icon="cart" text="Ventas" data-route="/venta" />
        </SideNavigation>
        </div>
      )}

      {/* Main */}
      <FlexBox
        direction="Column"
        style={{
          flexGrow: 1,
          padding: "2rem",
          marginTop: "4rem",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Title level="H3" style={{ marginBottom: "1rem" }}>Usuarios</Title>

        {/* Barra */}
        <FlexBox direction="Row" justifyContent="SpaceBetween" style={{ marginBottom: "1rem" }}>
          <Input
            placeholder="Buscar por Nombre"
            style={{ width: "300px" }}
            icon="search"
            value={busqueda}
            onInput={(e) => setBusqueda(e.target.value)}
          />
          <FlexBox direction="Row" wrap style={{ gap: "0.5rem" }}>
            <Button
              design="Negative"
              icon="delete"
              onClick={eliminarUsuariosSeleccionados}
              disabled={usuariosSeleccionados.length === 0}
            >
              Eliminar
            </Button>
            <Button design="Emphasized" icon="add" onClick={() => setOpenCrear(true)}>Crear</Button>
            <Button
              design="Attention"
              icon="edit"
              disabled={usuariosSeleccionados.length !== 1} // Solo habilitado si hay uno
              onClick={() => {
                const userToEdit = usuarios.find(u => u.id === usuariosSeleccionados[0]);
                if (userToEdit) {
                  setUsuarioEditar(userToEdit);
                  setOpenEditar(true);
                }
              }}
            >
              Editar
            </Button>
          </FlexBox>
        </FlexBox>

        {/* Tabla de usuarios */}
        <Card style={{ padding: "1rem", marginTop: "1rem" }}>
          <Title level="H5" style={{ marginBottom: "1rem", padding: "12px" }}>
            Base de Datos de Usuarios
          </Title>
          <div style={{ overflowY: "auto", maxHeight: "520px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "sans-serif",
              }}
            >
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th style={{ padding: "12px" }}></th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#000" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Nombre
                      <select
                        value={ordenNombre || ""}
                        onChange={(e) => {
                          setOrdenNombre(e.target.value);
                          setOrdenCorreo(null);
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
                  <th style={{ textAlign: "left", padding: "12px", color: "#000" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Correo
                      <select
                        value={ordenCorreo || ""}
                        onChange={(e) => {
                          setOrdenCorreo(e.target.value);
                          setOrdenNombre(null);
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
                  <th style={{ textAlign: "left", padding: "12px", color: "#000" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Tipo
                      <select
                        value={ordenTipo || ""}
                        onChange={(e) => {
                          setOrdenTipo(e.target.value);
                          setOrdenNombre(null);
                          setOrdenCorreo(null);
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
                </tr>
              </thead>
              <tbody>
                {[...usuarios]
                  .filter((u) =>
                    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .sort((a, b) => {
                    if (ordenNombre) {
                      return ordenNombre === "asc"
                        ? a.nombre.localeCompare(b.nombre)
                        : b.nombre.localeCompare(a.nombre);
                    }
                    if (ordenCorreo) {
                      return ordenCorreo === "asc"
                        ? a.correo.localeCompare(b.correo)
                        : b.correo.localeCompare(a.correo);
                    }
                    if (ordenTipo) {
                      return ordenTipo === "asc"
                        ? a.rol.localeCompare(b.rol)
                        : b.rol.localeCompare(a.rol);
                    }
                    return 0;
                  })
                  .map((usuario, index) => (
                    <tr key={usuario.id ?? `temp-${index}`} style={{ borderBottom: "1px solid #eee" }}>                  
                      <td style={{ padding: "12px" }}>
                        <input
                          type="checkbox"
                          checked={usuariosSeleccionados.includes(usuario.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;

                            setUsuariosSeleccionados((prevSeleccionados) => {
                              if (checked && !prevSeleccionados.includes(usuario.id)) {
                                return [...prevSeleccionados, usuario.id];
                              } else {
                                return prevSeleccionados.filter((id) => id !== usuario.id);
                              }
                            });
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px" }}>{usuario.nombre}</td>
                      <td style={{ padding: "12px" }}>{usuario.correo}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor:
                              usuario.rol.toLowerCase() === "owner"
                                ? "#e0d4fc"
                                : usuario.rol.toLowerCase() === "proveedor"
                                  ? "#d0fce0"
                                  : usuario.rol.toLowerCase() === "detallista"
                                    ? "#ffe0b2"
                                    : "#f5f5f5",
                            color: "#000",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {usuario.rol}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>


        {/* MODAL: Crear Usuario */}
        <Dialog
          headerText="Agregar Usuario"
          open={openCrear}
          onAfterClose={() => setOpenCrear(false)}
          footer={
            <Button design="Emphasized" onClick={() => {
              agregarUsuario();
              setOpenCrear(false);
            }}>Guardar</Button>
          }
        >
          <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
            <Input
              placeholder="Nombre"
              name="nombre"
              value={nuevoUsuario.nombre}
              onInput={handleInputChange}
            />
            <Input
              placeholder="Correo"
              name="correo"
              value={nuevoUsuario.correo}
              onInput={handleInputChange}
            />
            <Select name="rol" value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}>
              <Option value="Owner">Owner</Option>
              <Option value="Proveedor">Proveedor</Option>
              <Option value="Detallista">Detallista</Option>
            </Select>
          </FlexBox>
        </Dialog>

        {/* MODAL: Editar Usuario */}
        <Dialog
          headerText="Editar Usuario"
          open={openEditar}
          onAfterClose={() => setOpenEditar(false)}
          footer={
            <Button design="Emphasized" onClick={handleEditarGuardar}>
              Guardar
            </Button>
          }
        >
          {usuarioEditar && (
            <FlexBox style={{ padding: "1rem", gap: "1rem" }}>
              <Input
                placeholder="Nombre"
                value={usuarioEditar.nombre}
                onInput={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
              />
              <Input
                placeholder="Correo"
                value={usuarioEditar.correo}
                onInput={(e) => setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })}
              />
              <Select
                value={usuarioEditar?.rol || "Owner"} // Valor predeterminado si está vacío
                onChange={(e) => setUsuarioEditar({ ...usuarioEditar, rol: e.target.value })}
              >
                <Option value="Owner">Owner</Option>
                <Option value="Proveedor">Proveedor</Option>
                <Option value="Detallista">Detallista</Option>
              </Select>
            </FlexBox>
          )}
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
}