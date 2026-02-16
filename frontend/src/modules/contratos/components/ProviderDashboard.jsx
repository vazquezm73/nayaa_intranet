import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import {
  Server,
  Calendar,
  Globe,
  Monitor,
  Hash,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";

const ProviderDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data } = await api.get("/assets");
        const contaboAssets = data.filter(
          (a) => a.proveedor?.nombre === "Contabo",
        );
        setAssets(contaboAssets);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar activos", error);
      }
    };
    fetchAssets();
  }, []);

  const calculateDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const totalMensual = assets.reduce(
    (acc, curr) => acc + (curr.costoMensual || 0),
    0,
  );
  const totalAnual = assets.reduce(
    (acc, curr) => acc + (curr.costoAnual || 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* KPI CARDS MÁS COMPACTOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] p-4 rounded-2xl text-white shadow-lg flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <TrendingUp size={20} className="text-blue-400" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest opacity-60 block">
              Gasto Mensual
            </span>
            <div className="text-xl font-black italic">
              €{totalMensual.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-emerald-700 p-4 rounded-2xl text-white shadow-lg flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <ShieldCheck size={20} className="text-emerald-300" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest opacity-60 block">
              Proyección Anual
            </span>
            <div className="text-xl font-black italic">
              €{totalAnual.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DETALLADA */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex justify-between items-center">
          <span className="text-[9px] font-black uppercase text-slate-500">
            Inventario Técnico Contabo GmbH
          </span>
          <span className="text-[9px] font-black text-blue-600 uppercase">
            {assets.length} Servidores Activos
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white uppercase text-[8px] tracking-[0.15em]">
              <th className="px-6 py-3">Servidor & Conectividad</th>
              <th className="px-6 py-3">Especificaciones Hardware</th>
              <th className="px-6 py-3">Software & Red Extendida</th>
              <th className="px-6 py-3 text-center">Inversión (M/A)</th>
              <th className="px-6 py-3 text-right">Vencimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((asset) => {
              const daysLeft = calculateDaysLeft(asset.fechaVencimiento);
              return (
                <tr
                  key={asset._id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Nombre y IPs */}
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800 uppercase italic text-sm leading-none">
                      {asset.nombre}
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tight">
                      {asset.hostname}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Activity size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-700 font-mono">
                        {asset.ipPrincipal || "0.0.0.0"}
                      </span>
                    </div>
                  </td>

                  {/* Hardware */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
                        <Server size={12} className="text-slate-400" />
                        {asset.recursos?.cpu} / {asset.recursos?.ram}GB RAM
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 italic pl-5">
                        <Globe size={10} /> {asset.recursos?.ubicacion || "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* Software e IP v6 */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase font-black italic">
                        <Monitor size={12} className="text-slate-400" />
                        {asset.recursos?.os || "N/A"}
                      </div>
                      <div className="flex items-start gap-2 text-[9px] text-slate-400 font-mono leading-tight max-w-[180px]">
                        <Hash size={10} className="mt-0.5 shrink-0" />
                        <span className="break-all">
                          {asset.recursos?.ipv6 || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Costos */}
                  <td className="px-6 py-4 text-center">
                    <div className="font-black text-slate-800 text-sm">
                      €{asset.costoMensual?.toFixed(2)}
                    </div>
                    <div className="text-[9px] font-bold text-emerald-600 uppercase">
                      Anual: €{asset.costoAnual?.toFixed(2)}
                    </div>
                  </td>

                  {/* Fecha de Pago */}
                  <td className="px-6 py-4 text-right">
                    <div className="text-[10px] font-black text-slate-700">
                      {new Date(asset.fechaVencimiento).toLocaleDateString()}
                    </div>
                    <div
                      className={`text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded inline-block ${daysLeft < 15 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {daysLeft} días
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProviderDashboard;
