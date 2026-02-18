import { useNavigate } from "react-router-dom";
import { Users, Key } from "lucide-react";

const ConfigPanel = () => {
  const navigate = useNavigate();

  const subModules = [
    {
      title: "Gestión de Usuarios",
      icon: Users,
      color: "bg-purple-600",
      description: "Administrar staff, roles y permisos de acceso al sistema.",
      link: "/admin/users",
    },
    {
      title: "Accesos y Credenciales",
      icon: Key,
      color: "bg-amber-600",
      description: "Usuarios, passwords e información técnica de servidores.",
      link: "/admin/server-access",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subModules.map((module, idx) => (
          <div
            key={idx}
            onClick={() => navigate(module.link)}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-primary transition-all cursor-pointer group"
          >
            <div
              className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white shadow-inner`}
            >
              <module.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-primary">
              {module.title}
            </h3>
            <p className="text-sm text-slate-500 mt-2">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigPanel;
