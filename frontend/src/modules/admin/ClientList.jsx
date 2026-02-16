import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import {
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Edit2,
  Ban,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import PrimaryButton from "../../components/common/Button";
import ClientForm from "./ClientForm";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const statusQuery = showInactive ? "inactive" : "active";

      const { data } = await api.get("/clients", {
        params: {
          search: searchTerm,
          status: statusQuery,
        },
      });

      setClients(data);
    } catch (error) {
      console.error("Error al traer clientes", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showInactive]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClients();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchClients]);

  useEffect(() => {
    const handleGlobalClick = () => setActiveMenu(null);
    if (activeMenu) {
      window.addEventListener("click", handleGlobalClick);
    }
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [activeMenu]);

  const toggleClientStatus = async (client) => {
    const action = client.active ? "desactivar" : "reactivar";
    if (window.confirm(`¿Seguro que deseas ${action} este cliente?`)) {
      try {
        await api.put(`/clients/${client._id}`, { active: !client.active });
        fetchClients();
        setActiveMenu(null);
      } catch (error) {
        alert("Error al cambiar el estado");
      }
    }
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsCreating(true);
    setActiveMenu(null);
  };

  if (isCreating) {
    return (
      <ClientForm
        initialData={editingClient}
        onSave={() => {
          setIsCreating(false);
          setEditingClient(null);
          fetchClients();
        }}
        onCancel={() => {
          setIsCreating(false);
          setEditingClient(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de Acciones Superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white transition-all focus:ring-2 focus:ring-[#0062ff]"
            />
          </div>

          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
              showInactive
                ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
          >
            {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
            {showInactive ? "VIENDO INACTIVOS" : "VER INACTIVOS"}
          </button>
        </div>

        <PrimaryButton icon={UserPlus} onClick={() => setIsCreating(true)}>
          Nuevo Cliente
        </PrimaryButton>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Cliente / RFC</th>
                <th className="px-6 py-4 font-bold">Contacto</th>
                <th className="px-6 py-4 font-bold">Teléfono</th>
                <th className="px-6 py-4 font-bold">Tipo</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400 animate-pulse"
                  >
                    Cargando clientes...
                  </td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <tr
                    key={client._id}
                    className={`${!client.active ? "opacity-60 bg-slate-50/50" : ""} hover:bg-slate-50/80 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 uppercase text-sm tracking-tight">
                        {client.nombreComercial}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 bg-slate-100 inline-block px-1 rounded mt-1 uppercase">
                        {client.rfcTaxId || "SIN RFC"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">
                        {client.contactoNombre}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <Mail size={12} className="text-[#0062ff]" />
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {client.telefono || (
                          <span className="text-slate-300 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-blue-50 text-[#0062ff] text-[9px] font-black uppercase">
                        {client.tipoCliente?.nombre || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative overflow-visible">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === client._id ? null : client._id,
                          );
                        }}
                        className="p-2 text-slate-300 hover:text-[#0062ff] rounded-full hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {activeMenu === client._id && (
                        <div className="absolute right-10 top-0 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-[9999] py-2 animate-in fade-in zoom-in duration-150">
                          <button
                            onClick={() => handleOpenEdit(client)}
                            className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-3 hover:bg-slate-50 text-slate-600"
                          >
                            <Edit2 size={14} /> EDITAR
                          </button>

                          <div className="h-[1px] bg-slate-100 my-1"></div>

                          <button
                            onClick={() => toggleClientStatus(client)}
                            className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-3 transition-colors ${
                              client.active
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-emerald-500 hover:bg-emerald-50"
                            }`}
                          >
                            {client.active ? (
                              <>
                                <Ban size={14} /> DESACTIVAR
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} /> REACTIVAR
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-slate-400 italic"
                  >
                    No se encontraron clientes{" "}
                    {showInactive ? "inactivos" : "activos"}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
