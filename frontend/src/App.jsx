import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeDashboard from "./modules/shared/HomeDashboard";
import Login from "./modules/auth/Login";
import ClientList from "./modules/admin/ClientList";
import AssetList from "./modules/admin/AssetList";
import AdminPanel from "./modules/admin/AdminPanel"; // Este es el que sugerimos crear para el sub-menú
import CatalogManager from "./modules/admin/CatalogManager";
import ContratosModule from "./modules/contratos/index";
import UserList from "./modules/admin/UserList";
import ConfigPanel from "./modules/config/ConfigPanel";
import ServerAccessList from "./modules/config/ServerAccessList";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* LOGIN: Si hay token, redirige al dashboard */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* DASHBOARD: La raíz de la intranet */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <MainLayout title="Módulos Principales">
                <HomeDashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PANEL ADMIN: El menú intermedio para elegir Clientes o Assets */}
        <Route
          path="/admin"
          element={
            token ? (
              <MainLayout title="Asuntos Administrativos">
                <AdminPanel />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CLIENTES: Ahora con su propia ruta independiente */}
        <Route
          path="/clients"
          element={
            token ? (
              <MainLayout title="Gestión de Clientes">
                <ClientList />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ASSETS: Integrado correctamente al MainLayout */}
        <Route
          path="/assets"
          element={
            token ? (
              <MainLayout title="Inventario de Activos">
                <AssetList />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/catalogs"
          element={
            token ? (
              <MainLayout title="Configuración de Catálogos del Sistema">
                <CatalogManager />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* CONTRATOS: Nueva ruta integrada al Layout principal */}
        <Route
          path="/admin/contracts" // Usamos contracts para que coincida con el link del AdminPanel
          element={
            token ? (
              <MainLayout title="Contratos y Costos de Infraestructura">
                <ContratosModule />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            token ? (
              <MainLayout title="Configuración de Usuarios">
                <UserList />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/config"
          element={
            <MainLayout title="Configuración del Sistema">
              <ConfigPanel />
            </MainLayout>
          }
        />
        {/* PANEL CONFIGURACIÓN: El menú intermedio para Usuarios y Accesos */}
        <Route
          path="/admin/server-access"
          element={
            token ? (
              <MainLayout title="Configuración del Sistema">
                <ServerAccessList />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* RUTA POR DEFECTO */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
