import React, { useEffect, useState } from "react";
import {
  Title,
  Card,
  FlexBox,
  Text,
  Button,
  Input,
  CheckBox
} from "@ui5/webcomponents-react";
import Layout from "../components/Layout";
import { getUsuarios, updateUsuario } from "../services/usersService";
import { useNavigate } from "react-router-dom";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  // Carga datos de usuario al montar
  useEffect(() => {
    const correo = localStorage.getItem("correo");
    if (!correo) {
      navigate("/login");
      return;
    }
    getUsuarios().then((usuarios) => {
      const encontrado = usuarios.find(
        (u) =>
          (u.EMAIL === correo) ||
          (u.email === correo) ||
          (u.correo === correo)
      );
      if (encontrado) {
        setUsuario(encontrado);
        setNewName(encontrado.NOMBRE || encontrado.nombre);
      }
    });
  }, [navigate]);

  const handleSave = async () => {
    if (!newName.trim()) {
      return alert("El nombre no puede estar vacío");
    }
    if (!newPassword.trim()) {
      return alert("La contraseña no puede estar vacía");
    }
    const id = usuario.ID_USUARIO || usuario.id;
    const payload = {
      nombre: newName,
      email: usuario.EMAIL || usuario.email || usuario.correo,
      password: newPassword,
      rol: usuario.ROL || usuario.rol
    };
    const success = await updateUsuario(id, payload);
    if (success) {
      alert("Perfil actualizado correctamente");
      setUsuario({ ...usuario, NOMBRE: newName });
      setNewPassword("");
      setEditing(false);
    } else {
      alert("Error al actualizar el perfil");
    }
  };

  const handleCancel = () => {
    if (usuario) {
      setNewName(usuario.NOMBRE || usuario.nombre);
    }
    setNewPassword("");
    setEditing(false);
  };

  return (
    <Layout>
      <FlexBox
        direction="Column"
        alignItems="Center"
        style={{ padding: "4rem" }}
      >
        <Title level="H1" style={{ marginBottom: "1rem" }}>
          Perfil de Usuario
        </Title>
        {!usuario ? (
          <Text>Cargando información...</Text>
        ) : (
          <Card style={{ minWidth: "30rem", maxWidth: "35rem" }}>
            <FlexBox
              direction="Column"
              style={{ gap: "1.5rem", padding: "2rem" }}
            >
              <CheckBox
                text="Editar perfil"
                checked={editing}
                onChange={(e) => setEditing(e.target.checked)}
              />

              <div>
                <Text style={{ fontWeight: "bold" }}>Nombre:</Text>
                <br />
                {editing ? (
                  <Input
                    value={newName}
                    onInput={(e) => setNewName(e.target.value)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Text>{usuario.NOMBRE || usuario.nombre}</Text>
                )}
              </div>

              <div>
                <Text style={{ fontWeight: "bold" }}>Contraseña:</Text>
                <br />
                {editing ? (
                  <Input
                    type="Password"
                    placeholder="Ingrese nueva contraseña"
                    value={newPassword}
                    onInput={(e) => setNewPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Text>********</Text>
                )}
              </div>

              <div>
                <Text style={{ fontWeight: "bold" }}>Correo:</Text>
                <br />
                <Text>
                  {usuario.EMAIL || usuario.email || usuario.correo}
                </Text>
              </div>

              <div>
                <Text style={{ fontWeight: "bold" }}>Rol:</Text>
                <br />
                <Text>{usuario.ROL || usuario.rol}</Text>
              </div>

              {editing && (
                <FlexBox
                  justifyContent="SpaceBetween"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  <Button design="Transparent" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button design="Emphasized" onClick={handleSave}>
                    Guardar
                  </Button>
                </FlexBox>
              )}
            </FlexBox>
          </Card>
        )}
      </FlexBox>
    </Layout>
  );
}