// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTES
import Login from "./components/login";
import Producto from "./components/producto";
import TwoFAScreen from "./components/TwoFAScreen";

// PÁGINAS
import Home from "./pages/home";
import Usuarios from "./pages/usuarios";

// ORDEN
import Ordenes from "./pages/orden/orden";
import SeleccionProveedor from "./pages/orden/SeleccionProveedor";
import SeleccionProducto from "./pages/orden/SeleccionProducto";
import ConfirmarOrden from "./pages/orden/ConfirmarOrden";

// VENTA
import Venta from "./pages/venta/venta";
import SeleccionVenta from "./pages/venta/SeleccionVenta";
import ConfirmarVenta from "./pages/venta/ConfirmarVenta";

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
