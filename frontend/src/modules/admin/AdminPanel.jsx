import { useNavigate } from "react-router-dom";
import { Users, Server, FileText, Settings } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();

  const subModules = [
    {
      title: "Configuración de Catálogos",
      icon: Settings, // Necesitarás importar Settings de lucide-react
      color: "bg-slate-600",
      description:
        "Gestionar opciones de selects (Status, Tipos, Proveedores).",
      link: "/admin/catalogs",
    },
    {
      title: "Gestión de Clientes",
      icon: Users,
      color: "bg-blue-600",
      description: "Directorio de clientes, contactos y datos fiscales.",
      link: "/clients",
    },
    {
      title: "Inventario de Activos",
      icon: Server,
      color: "bg-indigo-600",
      description: "Servidores, hosting, IPs y recursos técnicos.",
      link: "/assets",
    },
    {
      title: "Contratos y Facturación",
      icon: FileText,
      color: "bg-emerald-600",
      description: "Control de costos de infraestructura y servicios.",
      link: "/admin/contracts",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subModules.map((module, idx) => {
          const isAvailable = module.link !== "#";

          return (
            <div
              key={idx}
              onClick={() => isAvailable && navigate(module.link)}
              className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all ${
                isAvailable
                  ? "hover:shadow-md hover:border-brand-primary cursor-pointer group"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div
                className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white shadow-inner`}
              >
                <module.icon size={24} />
              </div>
              <h3
                className={`text-lg font-bold text-slate-800 ${isAvailable ? "group-hover:text-brand-primary" : ""}`}
              >
                {module.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {module.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanel;
