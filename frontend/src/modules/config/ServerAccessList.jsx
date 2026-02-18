import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import ServerAccessForm from "./ServerAccessForm";
import {
  Search,
  Plus,
  ShieldCheck,
  Copy,
  Eye,
  Edit3,
  Key,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  X,
} from "lucide-react";

const ServerAccessList = () => {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedServer, setExpandedServer] = useState(null); // Para el toggle de servidores
  const [selectedService, setSelectedService] = useState(null); // Para el Modal de detalles
  const [copiedId, setCopiedId] = useState(null);
  const [view, setView] = useState("list");
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  useEffect(() => {
    if (view === "list") fetchAccesses();
  }, [view]);

  const fetchAccesses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/server-access");
      setAccesses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error", error);
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAccesses = accesses.filter(
    (acc) =>
      acc.asset?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.asset?.ipPrincipal?.includes(searchTerm),
  );

  if (view === "form")
    return (
      <ServerAccessForm
        accessId={selectedAssetId}
        onSave={() => setView("list")}
        onCancel={() => setView("list")}
      />
    );

  return (
    <div className="space-y-4">
      {/* Herramientas */}
      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar servidor..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setSelectedAssetId(null);
            setView("form");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-md"
        >
          <Plus size={18} /> Registrar
        </button>
      </div>

      {/* Lista tipo Acordeón */}
      <div className="space-y-2">
        {filteredAccesses.map((acc) => (
          <div
            key={acc._id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all"
          >
            {/* Cabecera Colapsable */}
            <div
              className={`p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors ${expandedServer === acc._id ? "bg-slate-50 border-b" : ""}`}
              onClick={() =>
                setExpandedServer(expandedServer === acc._id ? null : acc._id)
              }
            >
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-2 rounded-lg text-white">
                  <ShieldCheck size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-black uppercase italic text-sm text-slate-800">
                    {acc.asset?.nombre}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                    {acc.asset?.ipPrincipal}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAssetId(acc.asset?._id);
                    setView("form");
                  }}
                  className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                {expandedServer === acc._id ? (
                  <ChevronUp size={20} className="text-slate-400" />
                ) : (
                  <ChevronDown size={20} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Contenido Expandible */}
            {expandedServer === acc._id && (
              <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
                {/* Info SSH */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 tracking-widest">
                    Acceso SSH Principal
                  </span>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold">U: {acc.sshInfo?.usuario}</span>
                    <button
                      onClick={() =>
                        copyToClipboard(acc.sshInfo?.password, `${acc._id}-ssh`)
                      }
                      className="text-blue-600 flex items-center gap-1"
                    >
                      {copiedId === `${acc._id}-ssh` ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}{" "}
                      Clave
                    </button>
                  </div>
                </div>

                {/* Servicios Adicionales */}
                {acc.serviciosAdicionales?.map((serv, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-lg hover:border-blue-200 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <span className="text-[10px] font-black text-blue-700 uppercase italic leading-none">
                        {serv.etiqueta}
                      </span>
                      <p className="text-[9px] text-slate-400 font-mono mt-1">
                        {serv.usuario}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedService(serv)}
                      className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLES DEL SERVICIO */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic text-sm tracking-widest">
                {selectedService.etiqueta}
              </h3>
              <button
                onClick={() => setSelectedService(null)}
                className="hover:bg-white/10 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Usuario
                  </p>
                  <p className="font-mono text-sm font-bold bg-slate-50 p-2 rounded border">
                    {selectedService.usuario || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Puerto
                  </p>
                  <p className="font-mono text-sm font-bold bg-slate-50 p-2 rounded border">
                    {selectedService.puerto || "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-1 relative">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Contraseña
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    type="text"
                    value={selectedService.password}
                    className="w-full font-mono text-sm font-bold bg-blue-50 text-blue-700 p-2 rounded border border-blue-100"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(selectedService.password, "modal")
                    }
                    className="bg-blue-600 text-white px-3 rounded-lg"
                  >
                    {copiedId === "modal" ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Host / URL
                </p>
                <p className="font-mono text-xs text-blue-600 truncate">
                  {selectedService.url_host || "N/A"}
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Notas Técnicas
                </p>
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs leading-relaxed italic border border-amber-100 whitespace-pre-wrap">
                  {selectedService.notas || "Sin observaciones adicionales."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerAccessList;
