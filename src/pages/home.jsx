// src/components/Home.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  Title,
  Text,
  FlexBox,
  Card,
  Icon
} from "@ui5/webcomponents-react";
import { LineChart, PieChart } from "@ui5/webcomponents-react-charts";
import PropTypes from "prop-types";

import "./home.css";
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

// Sparkline config para KPIs
const sparkConfig = {
  legend: { visible: false },
  xAxis: {
    visible: false,
    title: { visible: false },
    label: { visible: false },
    grid: { visible: false },
    line: { visible: false },    // oculta la línea del eje X
    tick: { visible: false }     // oculta las marcas del eje X
  },
  yAxis: {
    visible: false,
    title: { visible: false },
    label: { visible: false },
    grid: { visible: false },
    line: { visible: false },    // oculta la línea del eje Y
    tick: { visible: false }     // oculta las marcas del eje Y
  },
  tooltip: { visible: false },
  dataLabel: { visible: false },
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

// Componente reutilizable para KPI pequeño
export function SmallKPI({ icon, iconStyle, label, value, valueStyle, extra }) {
  return (
    <Card style={{ background: "transparent", boxShadow: "none", border: "none", padding: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", background: "transparent", borderRadius: 8 }}>
        <Icon name={icon} style={iconStyle} />
        <Text>{label}</Text>
        <Text style={valueStyle}>{value}</Text>
        {extra}
      </div>
    </Card>
  );
}

SmallKPI.propTypes = {
  icon: PropTypes.string.isRequired,
  iconStyle: PropTypes.object,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  valueStyle: PropTypes.object,
  extra: PropTypes.node
};

export default function Home() {
  // Stock
  const [inventario, setInventario] = useState([]);
  useEffect(() => {
    getInventario().then(setInventario).catch(console.error);
  }, []);

  // Órdenes últimos 6 meses
  const [ordenesChartData, setOrdenesChartData] = useState([]);
  function parseMes(mesStr) {
    if (!mesStr) return new Date(0, 0, 1);
    const [mes, año] = mesStr.split(" ");
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const mesLimpio = mes.replace(".", "").toLowerCase();
    const mesIdx = meses.indexOf(mesLimpio);
    return new Date(Number(año), mesIdx === -1 ? 0 : mesIdx, 1);
  }
  useEffect(() => {
    getOrdenes()
      .then(raw => {
        const ahora = new Date();
        const meses = Array.from({ length: 6 }).map((_, i) => new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1)
          .toLocaleString("es-MX", { year: "numeric", month: "short" })
        );
        const conteo = raw.reduce((acc, o) => {
          const d = new Date(o.FECHA_EMISION);
          const key = d.toLocaleString("es-MX", { year: "numeric", month: "short" });
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const arr = meses.map(mes => ({ mes, total: conteo[mes] || 0 }));
        const extended = arr.map((d, i, a) => ({
          mes: d.mes,
          total: d.total,
          mediaMovil: i >= 2 ? Math.round((a[i].total + a[i - 1].total + a[i - 2].total) / 3) : null
        }));
        setOrdenesChartData(extended);
      })
      .catch(console.error);
  }, []);

  // Costos Compra últimos 36 meses
  const [costChartData, setCostChartData] = useState([]);
  useEffect(() => {
    getOrdenes()
      .then(raw => {
        const ahora = new Date();
        const start = new Date(ahora.getFullYear(), ahora.getMonth() - 35, 1);
        const months = Array.from({ length: 36 }).map((_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1)
          .toLocaleString("es-MX", { year: "numeric", month: "short" })
        );
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

  // Órdenes recientes
  const [ordenesData, setOrdenesData] = useState([]);
  useEffect(() => {
    getOrdenes()
      .then(raw =>
        setOrdenesData(raw.map(o => ({
          id: o.ID_ORDEN,
          fecha: o.FECHA_EMISION,
          estado: o.ESTADO,
          solicitante: o.ID_USUARIO_SOLICITA,
          proveedor: o.ID_USUARIO_PROVEE
        })) )
      )
      .catch(console.error);
  }, []);

  // Productos más vendidos
  const [productosVendidos, setProductosVendidos] = useState([]);
  useEffect(() => {
    getInventarioVendido()
      .then(data => {
        const top = data.sort((a, b) => b.CANTIDAD - a.CANTIDAD).slice(0, 8)
          .map(item => ({ producto: item.PRODUCTO, vendido: item.CANTIDAD, id: item.PRODUCTO }));
        setProductosVendidos(top);
      })
      .catch(console.error);
  }, []);

  // Forecast próximos 6 días
  const [forecastData, setForecastData] = useState([]);
  useEffect(() => {
    getForecast()
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(a.TIME) - new Date(b.TIME));
        setForecastData(sorted.slice(0, 6).map(d => ({
          fecha: new Date(d.TIME).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }),
          prediccion: Number(d.FORECAST),
          max: Number(d.PREDICTION_INTERVAL_MAX),
          min: Number(d.PREDICTION_INTERVAL_MIN),
          id: d.TIME
        })));
      })
      .catch(console.error);
  }, []);

  // KPIs para Costos Compra últimos 36 meses
  const totalCost = costChartData.reduce((acc, d) => acc + d.totalCost, 0);
  const avgCost = costChartData.length ? Math.round(totalCost / costChartData.length) : 0;
  const maxMonth = costChartData.reduce((max, d) => d.totalCost > max.totalCost ? d : max, { totalCost: 0 });
  const minMonth = costChartData.reduce((min, d) => d.totalCost < min.totalCost ? d : min, { totalCost: Infinity });

  // Comparativa con el año anterior
  const last12 = costChartData.slice(-12);
  const prev12 = costChartData.slice(-24, -12);
  const last12Sum = last12.reduce((acc, d) => acc + d.totalCost, 0);
  const prev12Sum = prev12.reduce((acc, d) => acc + d.totalCost, 0);
  const diff = last12Sum - prev12Sum;

  let trend;
  let trendColor;
  if (diff > 0) {
    trend = "↑";
    trendColor = "#d32f2f";
  } else if (diff < 0) {
    trend = "↓";
    trendColor = "#388e3c";
  } else {
    trend = "-";
    trendColor = "#888";
  }

  // KPIs para Órdenes últimos 6 meses
  const maxOrderMonth = ordenesChartData.reduce((max, d) => (d.total > (max.total ?? -Infinity) ? d : max), { mes: "", total: -Infinity });
  const minOrderMonth = ordenesChartData.reduce((min, d) => (d.total !== null && d.total < (min.total ?? Infinity) ? d : min), { mes: "", total: Infinity });

  const growth = ordenesChartData.length > 1 && ordenesChartData[0].total > 0
    ? Math.round(((ordenesChartData[ordenesChartData.length - 1].total - ordenesChartData[0].total) / ordenesChartData[0].total) * 100)
    : 0;

  // Estilo para los valores de los KPIs pequeños
  const valueStyle = { fontSize: 22, fontWeight: 700, color: "#222", marginBottom: 0 };

  return (
    <Layout>
      <Title style={{ fontSize: "2.5rem" }}>
        <Icon name="home" style={{ verticalAlign: "middle", marginRight: 8 }} />
        ¡Bienvenido a Logiviba!
      </Title>
      <Text style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Tu sistema de gestión logística inteligente
      </Text>

      {/* Stock y Órdenes Recientes en 25% / 75% */}
      <FlexBox direction="Row" style={{ gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Stock por producto */}
        <Card style={{ background: "transparent", boxShadow: "none", border: "none", padding: 0 }}>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: "1rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <Title level="H4" style={{ marginBottom: "0.75rem" }}>
              <Icon name="retail-store" style={{ marginRight: 6 }} />
              Stock por producto
            </Title>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: "right" }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {inventario.length === 0
                    ? (
                      <tr>
                        <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                          No hay productos en inventario para mostrar
                        </td>
                      </tr>
                    )
                    : inventario.map(item => (
                        <tr key={item.PRODUCTO}>
                          <td>{item.PRODUCTO}</td>
                          <td style={{ textAlign: "right" }}>{item.CANTIDAD}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Órdenes Recientes */}
        <Card style={{ background: "transparent", boxShadow: "none", border: "none", padding: 0 }}>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: "1rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <Title level="H4" style={{ marginBottom: "0.75rem" }}>
              <Icon name="shipping-status" style={{ marginRight: 6 }} />
              Órdenes Recientes
            </Title>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {ordenesData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <span>No hay órdenes recientes para mostrar</span>
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
          </div>
        </Card>
      </FlexBox>

      {/* Órdenes últimos 6 meses: gráfica grande + 3 KPIs pequeños */}
      <FlexBox
        direction="Row"
        style={{
          gap: "1.5rem",
          marginBottom: "1.5rem",
          alignItems: "center" // centrar verticalmente gráfico y KPI
        }}
      >
        {/* 1) Gráfica completa de órdenes */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level="H4" style={{ marginBottom: 8 }}>
            <Icon name="shipping-status" style={{ verticalAlign: "middle", marginRight: 6 }} />
            Órdenes últimos 6 meses
          </Title>
          <Card style={{ height: 420, display: "flex", flexDirection: "column" }}>
            {ordenesChartData.every(d => d.total === 0) ? (
              <div style={{
                flex: 1, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}>
                <span>No se registraron órdenes en este periodo</span>
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
                config={getChartConfig({
                  title: "",
                  yAxisTitle: "Órdenes",
                  xAxisTitle: "Mes",
                  dataLabel: false
                })}
              />
            )}
          </Card>
        </div>

        {/* 2) Tres KPIs pequeños */}
        <FlexBox
          direction="Column"
          style={{
            gap: "1rem",
            width: 160,
            marginTop: "2rem"
          }}
        >
          <SmallKPI
            icon="navigation-right-arrow"
            iconStyle={{ color: "#388e3c" }}
            label="Mes pico"
            value={maxOrderMonth.mes}
            valueStyle={valueStyle}
            extra={
              <div style={{
                background: "#e8f5e9",
                padding: "4px 8px",
                borderRadius: 4,
                color: "#388e3c",
                fontWeight: 600
              }}>
                {maxOrderMonth.total}
              </div>
            }
          />
          <SmallKPI
            icon="navigation-right-arrow"
            iconStyle={{ color: "#d32f2f", transform: "rotate(180deg)" }}
            label="Mes valle"
            value={minOrderMonth.mes}
            valueStyle={valueStyle}
            extra={
              <div style={{
                background: "#ffebee",
                padding: "4px 8px",
                borderRadius: 4,
                color: "#d32f2f",
                fontWeight: 600
              }}>
                {minOrderMonth.total !== Infinity ? minOrderMonth.total : 0}
              </div>
            }
          />
          <SmallKPI
            icon="shipping-status"
            iconStyle={{ color: "#ffa000" }}
            label="Crecimiento"
            value={`${growth}%`}
            valueStyle={valueStyle}
          />
        </FlexBox>
      </FlexBox>

      {/* Costos Compra últimos 36 meses */}
      <Title level="H4" style={{ marginBottom: 8 }}>Costos Compra últimos 36 meses</Title>
      <Card style={{
        marginBottom: "1rem",
        background: "transparent",    
        padding: 0,                   
        boxShadow: "none",            
        border: "none",               
        borderRadius: 0               
      }}>
        {/* KPIs */}
        <div style={{
          display: "flex",
          gap: "2rem",
          marginBottom: "1.2rem",
          flexWrap: "wrap",
          justifyContent: "flex-start"
        }}>
          <div style={{
            minWidth: 140,
            padding: "0.8rem 1rem",   
            background: "#fff",        
            borderRadius: 8            
          }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Total 36 meses</Text>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#388e3c" }}>${totalCost.toLocaleString()}</div>
          </div>
          <div style={{
            minWidth: 140,
            padding: "0.8rem 1rem",
            background: "#fff",
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Promedio mensual</Text>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#222" }}>${avgCost.toLocaleString()}</div>
          </div>
          <div style={{
            minWidth: 140,
            padding: "0.8rem 1rem",
            background: "#fff",
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Mes más caro</Text>
            <div style={{ fontSize: 20, fontWeight: 500 }}>
              {maxMonth.mes}: <span style={{ color: "#d32f2f" }}>${maxMonth.totalCost.toLocaleString()}</span>
            </div>
          </div>
          <div style={{
            minWidth: 140,
            padding: "0.8rem 1rem",
            background: "#fff",
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Mes más barato</Text>
            <div style={{ fontSize: 20, fontWeight: 500 }}>
              {minMonth.mes}: <span style={{ color: "#1976d2" }}>${minMonth.totalCost.toLocaleString()}</span>
            </div>
          </div>
          <div style={{
            minWidth: 140,
            padding: "0.8rem 1rem",
            background: "#fff",
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#222" }}>Vs. año anterior</Text>
            <div style={{ fontSize: 20, fontWeight: 500, color: trendColor }}>
              {trend} ${Math.abs(diff).toLocaleString()}
            </div>
          </div>
        </div>
        {/* Gráfico con tooltips personalizados */}
        <LineChart
          dataset={costChartData}
          dimensions={[{ accessor: "mes", label: "Mes" }]}
          measures={[
            {
              accessor: "totalCost",
              label: "Costo Compra (MXN)",
              color: "#388e3c",
              formatter: (v) => `$${v.toLocaleString()}`
            }
          ]}
          width="100%"
          height="300px"
          config={{
            ...getChartConfig({ title: "Costos Compra últimos 36 meses", yAxisTitle: "MXN", dataLabel: false, xAxisTitle: "Mes" }),
            tooltip: {
              visible: true,
              formatter: (params) => {
                const { data } = params;
                return `<b>${data.mes}</b><br/>Costo: <b>$${data.totalCost.toLocaleString()}</b>`;
              }
            }
          }}
        />
      </Card>

      {/* Productos más vendidos - Gráfica de pastel */}
      <Title level="H4" style={{ marginBottom: 8 }}>Productos más vendidos</Title>
      <Card style={{ marginBottom: "1.5rem" }}>
        {productosVendidos.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <span>No hay productos vendidos para mostrar</span>
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
            <span>No hay datos de predicción para mostrar</span>
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
    </Layout>
  );
}