import { useNavigate } from "react-router-dom";
import { Briefcase, BookOpen, Headset, Users, Settings } from "lucide-react";

const CategoryCard = ({ title, icon: Icon, color, description, link }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        console.log("Navegando a:", link); // Añade este console.log para debuguear
        if (link) navigate(link);
      }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-primary transition-all cursor-pointer group"
    >
      <div
        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white`}
      >
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-primary">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
  );
};
const HomeDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard
        title="Asuntos Administrativos"
        icon={Briefcase}
        color="bg-blue-600"
        description="Gestión de clientes, contratos, assets y facturación."
        link="/admin"
      />
      <CategoryCard
        title="Base de Conocimiento"
        icon={BookOpen}
        color="bg-emerald-600"
        description="Manuales técnicos, procedimientos y documentación interna."
      />
      <CategoryCard
        title="Atención a Clientes"
        icon={Headset}
        color="bg-amber-600"
        description="Tickets de soporte, monitoreo y logs de servicio."
      />
      <CategoryCard
        title="Recursos Humanos"
        icon={Users}
        color="bg-purple-600"
        description="Expedientes del staff, roles y permisos."
      />
      <CategoryCard
        title="Configuración"
        icon={Settings}
        color="bg-slate-600"
        description="Parámetros del sistema."
        link="/admin/config"
      />
    </div>
  );
};

export default HomeDashboard;
