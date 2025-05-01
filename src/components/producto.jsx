import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PetsIcon from "@mui/icons-material/Pets";
import BugReportIcon from "@mui/icons-material/BugReport";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import ForestIcon from "@mui/icons-material/Forest";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

export default function Producto() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img
          src="/viba1.png"
          alt="Carnes ViBa"
          style={{ width: "120px" }}
        />
      </Box>
      <Divider />
      {/* Opciones de menú */}
      <List sx={{ flex: 1 }}>
        <ListItemButton onClick={() => navigate("/home")}>
          <HomeIcon sx={{ mr: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton>
          <PetsIcon sx={{ mr: 2 }} />
          <ListItemText primary="Animales" />
        </ListItemButton>

        <ListItemButton sx={{ pl: 4 }}>
          <ChevronRightIcon sx={{ mr: 1 }} />
          <ListItemText primary="Mamíferos" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <BugReportIcon sx={{ mr: 1 }} />
          <ListItemText primary="Insectos" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <EmojiNatureIcon sx={{ mr: 1 }} />
          <ListItemText primary="Abejas" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }}>
          <ForestIcon sx={{ mr: 1 }} />
          <ListItemText primary="Bosque" />
        </ListItemButton>
      </List>
      <Divider />
      {/* Footer */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" display="block">
          © 2025 Carnes ViBa
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(90deg, #8B0000, #E53935)",
        }}
      >
        <Toolbar>
          {/* Ícono de menú (responsive) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Título */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Productos
          </Typography>
          {/* Texto "Cuenta" clickable */}
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/login")} // <--- Navegación al login
          >
            Cuenta
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Drawer para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer permanente en escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        {/* Contenido (ejemplo: 2 tarjetas clicables) */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 300,
                ":hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease",
                },
              }}
            >
              <CardActionArea
                sx={{ height: "100%" }}
                onClick={() => {
                  console.log("Cortando vacas según predicción de demanda...");
                  alert("¡Iniciando corte de vacas!");
                }}
              >
                <CardContent>
                  <Typography variant="caption">
                    Haz clic para “cortar vacas”
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: 300,
                ":hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease",
                },
              }}
            >
              <CardActionArea
                sx={{ height: "100%" }}
                onClick={() => {
                  console.log("Cortando vacas en función del tiempo de pedido...");
                  alert("¡Vacas en proceso de corte!");
                }}
              >
                <CardContent>
                  <Typography variant="caption">
                    Haz clic para “cortar vacas”
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
