import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../utils/useAuth";



const API_URL = process.env.VITE_API_URL || "http://localhost:3000";
import { roleToPath } from "../utils/routesConfig";
import { getUserInfo } from "../services/authService"

export default function TwoFAScreen() {
  const [qr, setQr] = useState(null);
  const [token, setToken] = useState("");
  
  const navigate = useNavigate(); // 👈 Te falta esto


  useEffect(() => {
    const check2FA = async () => {
      const res = await fetch(`${API_URL}/auth/2fa/status`, {
        method: "POST",
        credentials: "include", // important: send cookies
      });

      const data = await res.json();
      if (data.twoFAEnabled) {
        setQr("yaActivado");
      }
    };

    check2FA(); // don't wait for email — just check
  }, []);


  const generate2FA = async () => {
    const res = await fetch(`${API_URL}/auth/2fa/generate`, {
      method: "POST",
      credentials: "include", // send cookies
    });

    const data = await res.json();
    setQr(data.qr);
  };

  const { setUser } = useAuth();

  const verify2FA = async () => {
    const res = await fetch(`${API_URL}/auth/2fa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }), // only send token (6-digit code)
    });

  const data = await res.json();
  if (data.success) {
    const userInfo = await getUserInfo(); 
    setUser(userInfo.data)
    const redirectPath = roleToPath[userInfo.data.role] || "/";
    navigate(redirectPath);             
  }
  else {
        alert("❌ Código incorrecto");
      }
  };


  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Mitad izquierda: formulario */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #8B0000, #E53935)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "16px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            color: "#000000",
          }}
        >
          <img
            src="/viba1.png"
            alt="Carnes ViBa"
            style={{ width: "150px", margin: "0 auto 20px auto" }}
          />

          <h2 style={{ marginBottom: "1rem", color: "#000" }}>
            Autenticación en 2 Pasos
          </h2>

          {qr === null && (
            <>
              <p style={{ color: "#000" }}>
                Presiona para generar tu código QR:
              </p>
              <button onClick={generate2FA}>Generar QR</button>
            </>
          )}

          {qr === "yaActivado" && (
            <p style={{ color: "#000" }}>
              Ya tienes activado Google Authenticator. Ingresa tu código:
            </p>
          )}

          {qr && qr !== "yaActivado" && (
            <img
              src={qr}
              alt="Escanea el código"
              style={{ marginTop: "1rem", width: "100%" }}
            />
          )}

          {(qr || qr === "yaActivado") && (
            <div style={{ marginTop: "1.5rem" }}>
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#333",
                  color: "#fff",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              />
              <button onClick={verify2FA}>Verificar Código</button>
            </div>
          )}
        </div>
      </div>

      {/* Mitad derecha: imagen */}
      <div
        style={{
          width: "50%",
          backgroundImage: "url('/carne.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
