import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import Producto from "./components/producto";
import Usuarios from "./components/usuarios";
import Ordenes from "./components/orden";
import Venta from "./components/venta"; 
import TwoFAScreen from './components/TwoFAScreen';



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
        <Route path="/venta" element={<Venta />} /> {/* <-- Agregas la ruta */}
        <Route path="/2fa" element={<TwoFAScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
