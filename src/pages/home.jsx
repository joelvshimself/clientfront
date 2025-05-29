// src/components/Home.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  FlexBox,
  Button,
  Popover,
  Card
} from "@ui5/webcomponents-react";
import { LineChart, PieChart } from "@ui5/webcomponents-react-charts";
import { Toaster } from "react-hot-toast";

import "./home.css";
import { agregarNotificacion, mensajesNotificaciones } from "../components/Notificaciones";
import { getOrdenes } from "../services/ordenesService";
import { getInventario, getInventarioVendido } from "../services/inventarioService";
import { getForecast } from "../services/forecastService";
import Layout from "../components/Layout";

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/retail-store.js";
import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/bell.js";

// Utilidad para configuración de gráficos
function getChartConfig({ title, yAxisTitle = "Valor", dataLabel = true, xAxisTitle = "Día", legendPosition = "top" }) {
  return {
    title: { visible: true, text: title },
    legend: { visible: true, position: legendPosition, textStyle: { fontSize: 14 } },
    xAxis: {
      title: { visible: true, text: xAxisTitle },
      label: { rotation: 0, fontSize: 12 }
    },
    yAxis: {
      title: { visible: true, text: yAxisTitle },
      min: 0,
      label: { fontSize: 12 },
      grid: { visible: true }
    },
    tooltip: { visible: true },
    dataLabel: { visible: dataLabel }
  };
}

const drawerWidth = 240;

export default function Home() {
  const navigate = useNavigate();
  const notiButtonRef = useRef(null);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  // Stock
  const [inventario, setInventario] = useState([]);
  useEffect(() => {
    getInventario().then(setInventario).catch(console.error);
  }, []);

  // 6 meses
  const [ordenesChartData, setOrdenesChartData] = useState([]);
  function parseMes(mesStr) {
    if (!mesStr) return new Date(0, 0, 1);
    const [mes, año] = mesStr.split(" ");
    const meses = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic"
    ];
    const mesLimpio = mes.replace(".", "").toLowerCase();
    const mesIdx = meses.indexOf(mesLimpio);
    return new Date(Number(año), mesIdx === -1 ? 0 : mesIdx, 1);
  }
  useEffect(() => {
    getOrdenes()
      .then(raw => {
        const ahora = new Date();
        const meses = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1);
          return d.toLocaleString("es-MX", { year: "numeric", month: "short" });
        });
        const conteo = raw.reduce((acc, o) => {
          const d = new Date(o.FECHA_EMISION);
          const key = d.toLocaleString("es-MX", { year: "numeric", month: "short" });
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        // Arreglo ordenado y completo de meses
        const arr = meses.map(mes => ({
          mes,
          total: conteo[mes] || 0
        }));

        const extended = arr.map((d, i, a) => ({
          mes: d.mes,
          total: d.total,
          mediaMovil:
            i >= 2
              ? Math.round((a[i].total + a[i - 1].total + a[i - 2].total) / 3)
              : null
        }));

        setOrdenesChartData(extended);
      })
      .catch(console.error);
  }, []);

  // Costo compra últimos 36 meses
  const [costChartData, setCostChartData] = useState([]);
  useEffect(() => {
    getOrdenes()
      .then(raw => {
        const ahora = new Date();
        const start = new Date(ahora.getFullYear(), ahora.getMonth() - 35, 1);
        const months = Array.from({ length: 36 }).map((_, i) => {
          const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
          return d.toLocaleString("es-MX", { year: "numeric", month: "short" });
        });
        const costos = raw.reduce((acc, o) => {
          const d = new Date(o.FECHA_EMISION);
          if (d >= start) {
            const key = d.toLocaleString("es-MX", { year: "numeric", month: "short" });
            acc[key] = (acc[key] || 0) + Number(o.COSTO_COMPRA || 0);
          }
          return acc;
        }, {});
        const data = months.map(mes => ({ mes, totalCost: costos[mes] || 0 }));
        data.sort((a, b) => parseMes(a.mes) - parseMes(b.mes));
        setCostChartData(data);
      })
      .catch(console.error);
  }, []);

  // Ordenes recientes
  const [ordenesData, setOrdenesData] = useState([]);
  useEffect(() => {
    getOrdenes()
      .then(raw =>
        setOrdenesData(
          raw.map(o => ({
            id: o.ID_ORDEN, // Usar un id único si está disponible
            fecha: o.FECHA_EMISION,
            estado: o.ESTADO,
            solicitante: o.ID_USUARIO_SOLICITA,
            proveedor: o.ID_USUARIO_PROVEE
          }))
        )
      )
      .catch(console.error);
  }, []);

  // Productos más vendidos (gráfica de pastel)
  const [productosVendidos, setProductosVendidos] = useState([]);
  useEffect(() => {
    getInventarioVendido()
      .then(data => {
        // data = [{ PRODUCTO, CANTIDAD }, …]
        const top = data
          .sort((a, b) => b.CANTIDAD - a.CANTIDAD)
          .slice(0, 8)
          .map(item => ({
            producto: item.PRODUCTO,
            vendido: item.CANTIDAD,
            id: item.PRODUCTO // Usar producto como id único
          }));
        setProductosVendidos(top);
      })
      .catch(console.error);
  }, []);

  // Estado para el forecast
  const [forecastData, setForecastData] = useState([]);
  useEffect(() => {
    getForecast()
      .then(data => {
        // Ordenar por fecha ascendente
        const sorted = [...data].sort((a, b) => new Date(a.TIME) - new Date(b.TIME));
        setForecastData(
          sorted.slice(0, 6).map(d => ({
            fecha: new Date(d.TIME).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }),
            prediccion: Number(d.FORECAST),
            max: Number(d.PREDICTION_INTERVAL_MAX),
            min: Number(d.PREDICTION_INTERVAL_MIN),
            id: d.TIME // Usar TIME como id único
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <Title style={{ fontSize: "2.5rem" }}>¡Bienvenido a Logiviba!</Title>
      <Text style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Tu sistema de gestión logística inteligente
      </Text>

      {/* Stock por producto */}
      <Title level="H4" style={{ marginBottom: 8 }}>Stock por producto</Title>
      <Card style={{ marginBottom: "1.5rem" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th style={{ textAlign: "right" }}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.PRODUCTO}>
                <td>{item.PRODUCTO}</td>
                <td style={{ textAlign: "right" }}>{item.CANTIDAD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Ordenes últimos 6 meses y Ordenes Recientes alineados */}
      <FlexBox direction="Row" style={{ gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Gráfica de órdenes */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level="H4" style={{ marginBottom: 8 }}>Órdenes últimos 6 meses</Title>
          <Card style={{ height: 420, display: "flex", flexDirection: "column" }}>
            {ordenesChartData.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span>Cargando...</span>
              </div>
            ) : (
              <LineChart
                dataset={ordenesChartData}
                dimensions={[{ accessor: "mes", label: "Mes" }]}
                measures={[
                  { accessor: "total", label: "Total Órdenes", color: "#1976d2" },
                  { accessor: "mediaMovil", label: "Media Móvil (3m)", color: "#d32f2f" }
                ]}
                width="100%"
                height="350px"
                config={getChartConfig({ title: "Órdenes últimos 6 meses", yAxisTitle: "Órdenes", xAxisTitle: "Mes" })}
              />
            )}
          </Card>
        </div>

        {/* Tabla de ordenes recientes */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level="H4" style={{ marginBottom: 8 }}>Órdenes Recientes</Title>
          <Card style={{ height: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {ordenesData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <span>Cargando...</span>
                </div>
              ) : (
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
                    {ordenesData.slice(0, 5).map(o => (
                      <tr key={o.id || o.fecha}>
                        <td>{new Date(o.fecha).toLocaleDateString()}</td>
                        <td>{o.estado}</td>
                        <td>{o.solicitante}</td>
                        <td>{o.proveedor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </FlexBox>

      {/* Costos Compra últimos 36 meses */}
      <Title level="H4" style={{ marginBottom: 8 }}>Costos Compra últimos 36 meses</Title>
      <Card>
        <LineChart
          dataset={costChartData}
          dimensions={[{ accessor: "mes", label: "Mes" }]}
          measures={[{ accessor: "totalCost", label: "Costo Compra (MXN)", color: "#388e3c" }]}
          width="100%"
          height="300px"
          config={getChartConfig({ title: "Costos Compra últimos 36 meses", yAxisTitle: "MXN", dataLabel: false, xAxisTitle: "Mes" })}
        />
      </Card>

      {/* Productos más vendidos - Gráfica de pastel */}
      <Title level="H4" style={{ marginBottom: 8 }}>Productos más vendidos</Title>
      <Card style={{ marginBottom: "1.5rem" }}>
        {productosVendidos.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <span>Cargando...</span>
          </div>
        ) : (
          <PieChart
            dataset={productosVendidos}
            dimension={{ accessor: "producto", label: "Producto" }}
            measure={{ accessor: "vendido", label: "Cantidad Vendida", color: "#1976d2" }}
            width="100%"
            height="300px"
            config={{
              title: { visible: true, text: "Productos más vendidos" },
              legend: { visible: true, position: "right", textStyle: { fontSize: 14 } },
              tooltip: { visible: true },
              dataLabel: { visible: true }
            }}
          />
        )}
      </Card>

      {/* Predicción próximos 6 días */}
      <Title level="H4" style={{ marginBottom: 8 }}>Predicción próximos 6 días</Title>
      <Card style={{ marginBottom: "1.5rem" }}>
        {forecastData.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <span>Cargando...</span>
          </div>
        ) : (
          <LineChart
            dataset={forecastData}
            dimensions={[{ accessor: "fecha", label: "Día" }]}
            measures={[
              { accessor: "prediccion", label: "Predicción", color: "#ffa000" },
              { accessor: "max", label: "Máximo", color: "#388e3c" },
              { accessor: "min", label: "Mínimo", color: "#d32f2f" }
            ]}
            width="100%"
            height="300px"
            config={getChartConfig({ title: "Predicción próximos 6 días" })}
          />
        )}
      </Card>

      {/* Notificaciones */}
      <div style={{ position: "fixed", top: 10, right: 60, zIndex: 1500 }}>
        <Button
          icon="bell"
          design="Transparent"
          ref={notiButtonRef}
          onClick={() => setOpenNotificaciones(true)}
        />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: 10,
            fontWeight: "bold"
          }}
        >
          {notificaciones.length}
        </span>
      </div>
      {notiButtonRef.current && (
        <Popover
          headerText="Notificaciones recientes"
          open={openNotificaciones}
          opener={notiButtonRef.current}
          onClose={() => setOpenNotificaciones(false)}
        >
          <FlexBox
            direction="Column"
            style={{ padding: "1rem", gap: "0.5rem", maxHeight: 300, overflowY: "auto" }}
          >
            {notificaciones.map(n => (
              <div key={n.id} style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                <Text>{n.mensaje}</Text>
              </div>
            ))}
            <Button
              onClick={() => agregarNotificacion("success", mensajesNotificaciones.exito, setNotificaciones)}
            >
              Agregar Éxito
            </Button>
            <Button
              onClick={() => agregarNotificacion("info", mensajesNotificaciones.info, setNotificaciones)}
            >
              Agregar Info
            </Button>
            <Button
              onClick={() => agregarNotificacion("error", mensajesNotificaciones.error, setNotificaciones)}
            >
              Agregar Error
            </Button>
          </FlexBox>
        </Popover>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </Layout>
  );
}