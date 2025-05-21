// src/components/Home.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShellBar,
  SideNavigation,
  SideNavigationItem,
  Title,
  Text,
  FlexBox,
  Button,
  Popover,
  Card
} from "@ui5/webcomponents-react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import { Toaster } from "react-hot-toast";

import "./Home.css";
import { agregarNotificacion, mensajesNotificaciones } from "./Notificaciones";
import { getVentas } from "../services/ventaService";
import { getOrdenes } from "../services/ordenesService";
import { getInventario } from "../services/inventarioService";

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/bell.js";

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const notiButtonRef = useRef(null);
  const [isSidebarOpen] = useState(true);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  // ── Inventario disponible ─────────────────────────────────────────
  const [inventario, setInventario] = useState([]);
  useEffect(() => {
    getInventario()
      .then(data => setInventario(data))
      .catch(console.error);
  }, []);

  // ── Ventas últimos 6 meses ─────────────────────────────────────────
  const [ventasDataExtended, setVentasDataExtended] = useState([]);
  useEffect(() => {
    getVentas()
      .then(raw => {
        const ahora = new Date();
        const filtradas = raw
          .map(x => ({ fecha: new Date(x.fecha), total: Number(x.total) }))
          .filter(({ fecha }) => {
            const diffMeses =
              (ahora.getFullYear() - fecha.getFullYear()) * 12 +
              (ahora.getMonth() - fecha.getMonth());
            return diffMeses >= 0 && diffMeses < 6;
          });

        const totalesPorMes = filtradas.reduce((acc, { fecha, total }) => {
          const key = fecha.toLocaleString("es-MX", { year: "numeric", month: "short" });
          acc[key] = (acc[key] || 0) + total;
          return acc;
        }, {});

        const ventasArray = Object.entries(totalesPorMes).map(
          ([mes, total]) => ({ mes, total })
        );

        const extended = ventasArray.map((d, i, arr) => {
          const ma =
            i >= 2
              ? Math.round((arr[i].total + arr[i - 1].total + arr[i - 2].total) / 3)
              : null;
          return { ...d, mediaMovil: ma };
        });

        setVentasDataExtended(extended);
      })
      .catch(console.error);
  }, []);

  // ── Órdenes recientes ───────────────────────────────────────────────
  const [ordenesData, setOrdenesData] = useState([]);
  useEffect(() => {
    getOrdenes()
      .then(raw =>
        setOrdenesData(
          raw.map(o => ({
            fecha: o.FECHA_EMISION,
            estado: o.ESTADO,
            solicitante: o.ID_USUARIO_SOLICITA,
            proveedor: o.ID_USUARIO_PROVEE
          }))
        )
      )
      .catch(console.error);
  }, []);

  const handleNavigationClick = e => {
    const route = e.detail.item.dataset.route;
    if (route) navigate(route);
  };

  // ── Datos dummy para notificaciones y leaderboard ────────────────
  const salesToday = { revenue: 3.66, salesCount: 68, revChange: -48, salesChange: -43 };
  const leaderBoard = [
    { name: "Mary", value: 785 },
    { name: "Rosie", value: 635 },
    { name: "Bret", value: 604 },
    { name: "Taylor", value: 506 },
    { name: "Ralph", value: 471 },
    { name: "Jamie", value: 306 },
    { name: "Erica", value: 209 },
    { name: "Miles", value: 142 }
  ];

  return (
    <div className="page">
      <ShellBar
        logo={<img src="/viba1.png" alt="ViBa" style={{ height: 40 }} />}
        primaryTitle="Dashboard"
        onProfileClick={() => navigate("/login")}
        profile={{ image: "/viba1.png" }}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          background: "#B71C1C",
          color: "white",
          zIndex: 1201
        }}
      />

      {isSidebarOpen && (
        <div
          style={{
            width: drawerWidth,
            marginTop: "3.5rem",
            height: "calc(100vh - 3.5rem)",
            backgroundColor: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
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

      <div className="main">
        <div className="content" style={{ padding: "1.5rem" }}>
          <Title style={{ fontSize: "2.5rem" }}>¡Bienvenido a Logiviba!</Title>
          <Text style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
            Tu sistema de gestión logística inteligente
          </Text>

          {/* Today's widgets */}
          <FlexBox wrap style={{ gap: "1rem", marginBottom: "2rem" }}>
            {/* Today's sales */}
            <Card heading="Today's sales" style={{ flex: '1 1 250px', padding: '1rem' }}>
              <Title>${salesToday.revenue.toFixed(2)}k</Title>
              <Text>Revenue</Text>
              <Text style={{ color: salesToday.revChange < 0 ? '#d32f2f' : '#388e3c' }}>
                {Math.abs(salesToday.revChange)}% vs last week
              </Text>

              <Title style={{ marginTop: '1rem' }}>{salesToday.salesCount}</Title>
              <Text>Number of sales</Text>
              <Text style={{ color: salesToday.salesChange < 0 ? '#d32f2f' : '#388e3c' }}>
                {Math.abs(salesToday.salesChange)}% vs last week
              </Text>
            </Card>

            {/* Stock por producto */}
            <Card heading="Stock por producto" style={{ flex: '2 1 500px', padding: '1rem' }}>
              <div className="tableWrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style={{ textAlign: 'right' }}>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.PRODUCTO}</td>
                        <td style={{ textAlign: 'right' }}>{item.CANTIDAD}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Leaderboard */}
            <Card heading="Today's leaderboard" style={{ flex: '1 1 200px', padding: '1rem' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {leaderBoard.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: 'right' }}>${item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </FlexBox>

          {/* Charts */}
          <FlexBox wrap style={{ gap: "1rem" }}>
            {/* Ventas últimos 6 meses */}
            <Card
              heading="Ventas últimos 6 meses"
              style={{
                minWidth: "340px",
                flex: "1 1 640px",
                background: "linear-gradient(120deg, #fafbfd 0%, #f1f6fa 100%)",
                borderRadius: "18px",
                boxShadow: "0 8px 32px rgba(40,40,80,0.08)",
                border: "1.5px solid #e2eafc",
                padding: "0.75rem"
              }}
            >
              <div style={{ height: "370px", padding: "1.5rem 1rem 1rem 1rem" }}>
                <LineChart
                  dataset={ventasDataExtended}
                  dimensions={[{ accessor: "mes", label: "Mes" }]}
                  measures={[
                    {
                      accessor: "total",
                      label: "Total Ventas",
                      formatter: value =>
                        new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                          maximumFractionDigits: 0
                        }).format(value)
                    },
                    {
                      accessor: "mediaMovil",
                      label: "Media Móvil (3m)",
                      formatter: value =>
                        value
                          ? new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                              maximumFractionDigits: 0
                            }).format(value)
                          : ""
                    }
                  ]}
                  width="100%"
                  height="100%"
                  config={{
                    title: { visible: true, text: "Ventas últimos 6 meses" },
                    lineType: "Monotone",
                    dataPoint: { visible: true, size: 7, hover: { scale: 1.35 } },
                    tooltip: { visible: true },
                    legend: { visible: true, position: "bottom" },
                    plotArea: { gridline: { visible: true } },
                    xAxis: {
                      visible: true,
                      title: { visible: true, text: "Mes" },
                      label: { rotation: 0 }
                    },
                    yAxis: {
                      visible: true,
                      title: { visible: true, text: "Ventas (MXN)" },
                      label: {
                        formatter: v =>
                          new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            maximumFractionDigits: 0
                          }).format(v)
                      }
                    },
                    animation: { initial: { enabled: true } }
                  }}
                  style={{
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.97)",
                    boxShadow: "0 2px 8px rgba(80,80,80,0.04)"
                  }}
                />
              </div>
            </Card>

            {/* Órdenes Recientes */}
            <Card
              heading="Órdenes Recientes"
              style={{ flex: "1 1 300px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              <div className="tableWrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha Emisión</th>
                      <th>Estado</th>
                      <th>Solicitante</th>
                      <th>Proveedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenesData.slice(0, 5).map((o, i) => (
                      <tr key={i}>
                        <td>{new Date(o.fecha).toLocaleDateString()}</td>
                        <td>{o.estado}</td>
                        <td>{o.solicitante}</td>
                        <td>{o.proveedor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </FlexBox>
        </div>
      </div>

      {/* Notificaciones */}
      <div style={{ position: "fixed", top: 10, right: 60, zIndex: 1500 }}>
        <Button icon="bell" design="Transparent" ref={notiButtonRef} onClick={() => setOpenNotificaciones(true)} />
        <span style={{ position: "absolute", top: -4, right: -4, backgroundColor: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: 10, fontWeight: "bold" }}>
          {notificaciones.length}
        </span>
      </div>
      {notiButtonRef.current && (
        <Popover headerText="Notificaciones recientes" open={openNotificaciones} opener={notiButtonRef.current} onClose={() => setOpenNotificaciones(false)}>
          <FlexBox direction="Column" style={{ padding: "1rem", gap: "0.5rem", maxHeight: 300, overflowY: "auto" }}>
            {notificaciones.map(n => (
              <div key={n.id} style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                <Text>{n.mensaje}</Text>
              </div>
            ))}
            <Button onClick={() => agregarNotificacion("success", mensajesNotificaciones.exito, setNotificaciones)}>Agregar Éxito</Button>
            <Button onClick={() => agregarNotificacion("info", mensajesNotificaciones.info, setNotificaciones)}>Agregar Info</Button>
            <Button onClick={() => agregarNotificacion("error", mensajesNotificaciones.error, setNotificaciones)}>Agregar Error</Button>
          </FlexBox>
        </Popover>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
