// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Producto from "./components/producto";
import Usuarios from "./components/usuarios";
import Ordenes from "./components/orden/orden";
import Venta from "./components/venta/venta";
import TwoFAScreen from "./components/TwoFAScreen";
import SeleccionProveedor from "./components/orden/SeleccionProveedor";
import SeleccionProducto from "./components/orden/SeleccionProducto";
import ConfirmarOrden from "./components/orden/ConfirmarOrden";
import SeleccionVenta from "./components/venta/SeleccionVenta";
import ConfirmarVenta from "./components/venta/ConfirmarVenta";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/orden" element={<Ordenes />} />
        <Route path="/venta" element={<Venta />} />
        <Route path="/orden/nueva/proveedor" element={<SeleccionProveedor />} />
        <Route path="/orden/nueva/producto" element={<SeleccionProducto />} />
        <Route path="/orden/nueva/confirmar" element={<ConfirmarOrden />} />
        <Route path="/venta/nueva" element={<SeleccionVenta />} />
        <Route path="/venta/nueva/confirmar" element={<ConfirmarVenta />} />
        <Route path="/2fa" element={<TwoFAScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
