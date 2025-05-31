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

function getInitials(nombre) {
  if (!nombre) return "?";
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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
        style={{
          minHeight: "100vh",
          padding: "4rem 0"
        }}
      >
        <Card
          style={{
            minWidth: "28rem",
            maxWidth: "32rem",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            borderRadius: "2rem",
            padding: "3rem 2.5rem",
            background: "rgba(255,255,255,0.98)",
            border: "1px solid #d1d9e6",
            position: "relative"
          }}
        >
          <FlexBox
            direction="Column"
            alignItems="Center"
            style={{ gap: "2.5rem" }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px 0 rgba(108, 92, 231, 0.18)",
                marginBottom: "0.5rem",
                fontSize: "2.5rem",
                color: "#fff",
                fontWeight: "bold",
                letterSpacing: "1px",
                border: "4px solid #fff"
              }}
            >
              {getInitials(usuario?.NOMBRE || usuario?.nombre)}
            </div>
            <Title level="H2" style={{ marginBottom: "0.5rem", color: "#3a3a6a", fontWeight: 700 }}>
              Perfil de Usuario
            </Title>
            {!usuario ? (
              <Text>Cargando información...</Text>
            ) : (
              <>
                <CheckBox
                  text="Editar perfil"
                  checked={editing}
                  onChange={(e) => setEditing(e.target.checked)}
                  style={{
                    alignSelf: "flex-end",
                    marginBottom: "-1.5rem",
                    marginTop: "-1.5rem"
                  }}
                />

                <FlexBox
                  direction="Column"
                  style={{
                    gap: "1.8rem",
                    width: "100%",
                    marginTop: "1rem"
                  }}
                >
                  <div style={{ padding: "0.5rem 0.8rem" }}>
                    <Text style={{ fontWeight: "bold", color: "#6a82fb" }}>Nombre:</Text>
                    <br />
                    {editing ? (
                      <Input
                        value={newName}
                        onInput={(e) => setNewName(e.target.value)}
                        style={{
                          width: "100%",
                          marginTop: "0.3rem",
                          background: "#f7fafc",
                          borderRadius: "0.5rem"
                        }}
                      />
                    ) : (
                      <Text style={{ fontSize: "1rem", color: "#3a3a6a", fontWeight: 500 }}>
                        {usuario.NOMBRE || usuario.nombre}
                      </Text>
                    )}
                  </div>

                  <div style={{ padding: "0.5rem 0.8rem" }}>
                    <Text style={{ fontWeight: "bold", color: "#6a82fb" }}>Contraseña:</Text>
                    <br />
                    {editing ? (
                      <Input
                        type="Password"
                        placeholder="Ingrese nueva contraseña"
                        value={newPassword}
                        onInput={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: "100%",
                          marginTop: "0.3rem",
                          background: "#f7fafc",
                          borderRadius: "0.5rem"
                        }}
                      />
                    ) : (
                      <Text style={{ letterSpacing: "0.2em", color: "#3a3a6a", fontSize: "1rem" }}>********</Text>
                    )}
                  </div>

                  <div style={{ padding: "0.5rem 0.8rem" }}>
                    <Text style={{ fontWeight: "bold", color: "#6a82fb" }}>Correo:</Text>
                    <br />
                    <Text style={{ color: "#3a3a6a", fontSize: "1rem" }}>
                      {usuario.EMAIL || usuario.email || usuario.correo}
                    </Text>
                  </div>

                  <div style={{ padding: "0.5rem 0.8rem" }}>
                    <Text style={{ fontWeight: "bold", color: "#6a82fb" }}>Rol:</Text>
                    <br />
                    <Text style={{ color: "#3a3a6a", fontSize: "1rem" }}>{usuario.ROL || usuario.rol}</Text>
                  </div>
                </FlexBox>

                {editing && (
                  <FlexBox
                    justifyContent="SpaceBetween"
                    style={{
                      width: "100%",
                      marginTop: "2.5rem",
                      gap: "1.5rem"
                    }}
                  >
                    <Button design="Transparent" onClick={handleCancel} style={{
                      width: "48%",
                      borderRadius: "0.7rem",
                      border: "1px solid #fc5c7d",
                      color: "#fc5c7d",
                      fontWeight: 600
                    }}>
                      Cancelar
                    </Button>
                    <Button design="Emphasized" onClick={handleSave} style={{
                      width: "48%",
                      borderRadius: "0.7rem",
                      background: "#6a82fb", // ← Color sólido en vez de gradiente
                      color: "#fff",
                      fontWeight: 600
                    }}>
                      Guardar
                    </Button>
                  </FlexBox>
                )}
              </>
            )}
          </FlexBox>
        </Card>
      </FlexBox>
    </Layout>
  );
}