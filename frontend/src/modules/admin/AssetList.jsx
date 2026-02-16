import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import {
  Server,
  Search,
  MoreVertical,
  ExternalLink,
  Cpu,
  Database,
  Plus,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import PrimaryButton from "../../components/common/Button";
import AssetForm from "./AssetForm"; // Lo crearemos a continuación

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroUso, setFiltroUso] = useState("todos");

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/assets?search=${searchTerm}`;
      if (filtroUso !== "todos") {
        url += `&esCompartido=${filtroUso === "compartido"}`;
      }
      const { data } = await api.get(`/assets?search=${searchTerm}`);
      setAssets(data);
    } catch (error) {
      console.error("Error al traer activos", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filtroUso]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Manejo de colores de Status según el nombre del catálogo
  const getStatusColor = (statusName) => {
    const status = statusName?.toLowerCase() || "";
    if (status.includes("operativo") || status.includes("activo"))
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (status.includes("mantenimiento"))
      return "bg-amber-50 text-amber-600 border-amber-100";
    if (status.includes("suspendido"))
      return "bg-red-50 text-red-600 border-red-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  if (isCreating) {
    return (
      <AssetForm
        initialData={editingAsset}
        onSave={() => {
          setIsCreating(false);
          setEditingAsset(null);
          fetchAssets();
        }}
        onCancel={() => {
          setIsCreating(false);
          setEditingAsset(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y Búsqueda (Igual al anterior) */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 max-w-2xl gap-4">
            {/* Búsqueda existente */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar nombre, IP..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0062ff]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de Uso */}
            <select
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-[#0062ff] bg-white"
              value={filtroUso}
              onChange={(e) => setFiltroUso(e.target.value)}
            >
              <option value="todos">Todos los usos</option>
              <option value="dedicado">Dedicados</option>
              <option value="compartido">Compartidos</option>
            </select>
          </div>

          <PrimaryButton icon={Plus} onClick={() => setIsCreating(true)}>
            Nuevo Activo
          </PrimaryButton>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-4 font-bold">Activo / IP</th>
              <th className="px-6 py-4 font-bold">Uso / Tipo</th>
              <th className="px-6 py-4 font-bold">Cliente(s)</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {assets.map((asset) => (
              <tr
                key={asset._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 uppercase tracking-tight">
                    {asset.nombre}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
                    <ExternalLink size={10} /> {asset.ipPrincipal || "0.0.0.0"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit mb-1 ${
                        asset.esCompartido
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {asset.esCompartido ? "Compartido" : "Dedicado"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {asset.tipoAsset?.nombre}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {asset.clientes?.length > 1 ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">
                        Múltiples Clientes
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {asset.clientes.length} entidades vinculadas
                      </span>
                    </div>
                  ) : asset.clientes?.length === 1 ? (
                    <div className="font-semibold text-slate-700">
                      {asset.clientes[0].nombreComercial}
                    </div>
                  ) : (
                    <span className="text-slate-300 italic text-xs">
                      Sin asignar
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${getStatusColor(asset.status?.nombre)}`}
                  >
                    {asset.status?.nombre}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setEditingAsset(asset);
                      setIsCreating(true);
                    }}
                    className="p-2 text-slate-300 hover:text-brand-primary transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetList;
