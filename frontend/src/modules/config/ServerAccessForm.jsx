import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Plus, Trash2, Save, X, ShieldCheck, Server } from "lucide-react";

const ServerAccessForm = ({ accessId, onSave, onCancel }) => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset: "",
    sshInfo: { usuario: "root", password: "", puerto: 22 },
    serviciosAdicionales: [],
    notasGenerales: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, [accessId]);

  const fetchInitialData = async () => {
    const { data: assetData } = await api.get("/assets");
    setAssets(assetData);

    if (accessId) {
      try {
        const { data } = await api.get(`/server-access/asset/${accessId}`);
        setFormData({
          ...data,
          asset: data.asset?._id || data.asset, // Asegurar que guardamos el ID
        });
      } catch (e) {
        console.log("No hay accesos previos, iniciando nuevo formulario.");
      }
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      serviciosAdicionales: [
        ...formData.serviciosAdicionales,
        {
          etiqueta: "",
          url_host: "",
          usuario: "",
          password: "",
          puerto: "",
          notas: "",
        },
      ],
    });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.serviciosAdicionales];
    newServices[index][field] = value;
    setFormData({ ...formData, serviciosAdicionales: newServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/server-access", formData);
      onSave();
    } catch (error) {
      alert(
        "Error al guardar: " +
          (error.response?.data?.message || "Error desconocido"),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in duration-300 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xl max-w-5xl mx-auto"
    >
      {/* Header Form */}
      <div className="flex justify-between items-center bg-white p-4 -m-6 mb-6 rounded-t-2xl border-b">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-lg font-black uppercase italic tracking-tight">
            {accessId
              ? "Actualizar Documentación de Acceso"
              : "Nueva Ficha de Seguridad"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lado Izquierdo: Server y SSH */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Servidor
              </label>
              <select
                required
                disabled={accessId}
                className="w-full p-2 text-sm font-bold border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500"
                value={formData.asset}
                onChange={(e) =>
                  setFormData({ ...formData, asset: e.target.value })
                }
              >
                <option value="">Seleccionar...</option>
                {assets.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t space-y-3">
              <label className="text-[10px] font-black uppercase text-blue-600 block">
                Acceso SSH Principal
              </label>
              <input
                placeholder="Usuario (root)"
                className="w-full p-2 text-xs border rounded-lg"
                value={formData.sshInfo.usuario}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sshInfo: { ...formData.sshInfo, usuario: e.target.value },
                  })
                }
              />
              <input
                placeholder="Puerto (22)"
                type="number"
                className="w-full p-2 text-xs border rounded-lg"
                value={formData.sshInfo.puerto}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sshInfo: { ...formData.sshInfo, puerto: e.target.value },
                  })
                }
              />
              <input
                placeholder="Contraseña SSH"
                className="w-full p-2 text-xs border rounded-lg bg-blue-50/30"
                value={formData.sshInfo.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sshInfo: { ...formData.sshInfo, password: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Lado Derecho: Servicios Dinámicos */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Servicios Adicionales (VNC, DB, Paneles)
            </h3>
            <button
              type="button"
              onClick={addService}
              className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus size={14} /> Añadir
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {formData.serviciosAdicionales.map((serv, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative group"
              >
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      serviciosAdicionales:
                        formData.serviciosAdicionales.filter(
                          (_, i) => i !== idx,
                        ),
                    })
                  }
                  className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                {/* Dentro del map de servicios adicionales, sustituye los inputs por esto */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <input
                      placeholder="Etiqueta (Ej: VNC)"
                      className="w-full p-2 text-[11px] font-black uppercase border-b border-blue-200 focus:outline-none"
                      value={serv.etiqueta}
                      onChange={(e) =>
                        handleServiceChange(idx, "etiqueta", e.target.value)
                      }
                    />
                  </div>
                  <input
                    placeholder="Usuario"
                    className="p-2 text-xs border rounded"
                    value={serv.usuario}
                    onChange={(e) =>
                      handleServiceChange(idx, "usuario", e.target.value)
                    }
                  />
                  <input
                    placeholder="Password"
                    className="p-2 text-xs border rounded"
                    value={serv.password}
                    onChange={(e) =>
                      handleServiceChange(idx, "password", e.target.value)
                    }
                  />
                  <input
                    placeholder="IP o URL"
                    className="p-2 text-xs border rounded"
                    value={serv.url_host}
                    onChange={(e) =>
                      handleServiceChange(idx, "url_host", e.target.value)
                    }
                  />
                  <input
                    placeholder="Puerto"
                    className="p-2 text-xs border rounded"
                    value={serv.puerto}
                    onChange={(e) =>
                      handleServiceChange(idx, "puerto", e.target.value)
                    }
                  />

                  {/* CAMBIO: Notas amplias ocupando todo el ancho abajo */}
                  <div className="col-span-2 md:col-span-3">
                    <textarea
                      placeholder="Notas técnicas del servicio (Instrucciones de acceso, IPs secundarias, configuraciones especiales...)"
                      className="w-full p-2 text-[11px] border rounded bg-slate-50 focus:bg-white min-h-[60px]"
                      value={serv.notas}
                      onChange={(e) =>
                        handleServiceChange(idx, "notas", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-xs font-black uppercase text-slate-400"
        >
          Descartar
        </button>
        <button
          type="submit"
          className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 flex items-center gap-2 transition-all"
        >
          <Save size={18} /> Guardar Documentación
        </button>
      </div>
    </form>
  );
};

export default ServerAccessForm;
