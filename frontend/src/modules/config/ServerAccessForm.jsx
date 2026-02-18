import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Plus,
  Trash2,
  Save,
  X,
  ShieldCheck,
  Server,
  Edit3,
} from "lucide-react";

const ServerAccessForm = ({ accessId, onSave, onCancel }) => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset: "",
    sshInfo: { usuario: "root", password: "", puerto: 22 },
    serviciosAdicionales: [],
    notasGenerales: "",
  });

  // Estado para el Modal de Nuevo Servicio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    etiqueta: "",
    url_host: "",
    usuario: "",
    password: "",
    puerto: "",
    notas: "",
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
        setFormData({ ...data, asset: data.asset?._id || data.asset });
      } catch (e) {
        console.log("Iniciando nuevo formulario.");
      }
    }
  };

  // Función para confirmar y añadir el servicio desde el modal
  const confirmAddService = () => {
    if (!newService.etiqueta) return alert("La etiqueta es obligatoria");
    setFormData({
      ...formData,
      serviciosAdicionales: [...formData.serviciosAdicionales, newService],
    });
    setNewService({
      etiqueta: "",
      url_host: "",
      usuario: "",
      password: "",
      puerto: "",
      notas: "",
    });
    setIsModalOpen(false);
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
      alert("Error al guardar cambios.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xl relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 -m-6 mb-6 rounded-t-2xl border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800">
              {accessId
                ? "Documentación Técnica de Acceso"
                : "Nueva Ficha de Seguridad"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna Izquierda: Server y SSH */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Servidor
                </label>
                <select
                  required
                  disabled={accessId}
                  className="w-full p-2 text-sm font-bold border rounded-lg bg-slate-50"
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
                  SSH Principal (Root)
                </label>
                <input
                  placeholder="Usuario"
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
                  placeholder="Puerto"
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
                      sshInfo: {
                        ...formData.sshInfo,
                        password: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Lista de Servicios Existentes */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Servicios Documentados
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Plus size={14} /> Añadir Nuevo Servicio
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2">
              {formData.serviciosAdicionales.length === 0 && (
                <div className="text-center p-10 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase">
                  No hay servicios adicionales registrados
                </div>
              )}
              {formData.serviciosAdicionales.map((serv, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group hover:border-blue-300"
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
                    className="absolute top-2 right-2 text-red-300 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="col-span-full border-b pb-1 mb-1">
                      <input
                        placeholder="Etiqueta"
                        className="w-full text-[11px] font-black uppercase text-blue-700 focus:outline-none"
                        value={serv.etiqueta}
                        onChange={(e) =>
                          handleServiceChange(idx, "etiqueta", e.target.value)
                        }
                      />
                    </div>
                    <input
                      placeholder="Usuario"
                      className="p-2 text-xs border rounded bg-slate-50"
                      value={serv.usuario}
                      onChange={(e) =>
                        handleServiceChange(idx, "usuario", e.target.value)
                      }
                    />
                    <input
                      placeholder="Password"
                      className="p-2 text-xs border rounded bg-slate-50"
                      value={serv.password}
                      onChange={(e) =>
                        handleServiceChange(idx, "password", e.target.value)
                      }
                    />
                    <input
                      placeholder="IP o URL"
                      className="p-2 text-xs border rounded bg-slate-50"
                      value={serv.url_host}
                      onChange={(e) =>
                        handleServiceChange(idx, "url_host", e.target.value)
                      }
                    />
                    <input
                      placeholder="Puerto"
                      className="p-2 text-xs border rounded bg-slate-50"
                      value={serv.puerto}
                      onChange={(e) =>
                        handleServiceChange(idx, "puerto", e.target.value)
                      }
                    />
                    <div className="col-span-full">
                      <textarea
                        placeholder="Notas técnicas..."
                        className="w-full p-2 text-[10px] border rounded bg-slate-50 min-h-[40px]"
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
            className="px-6 py-2 text-xs font-black uppercase text-slate-400 hover:text-slate-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase shadow-xl hover:bg-emerald-700 flex items-center gap-2 transition-all"
          >
            <Save size={18} /> Guardar Todo
          </button>
        </div>
      </form>

      {/* SUB-MODAL PARA NUEVO SERVICIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic text-sm flex items-center gap-2">
                <Plus size={18} /> Nuevo Servicio Técnico
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Nombre del Servicio (Ej: VNC Principal)
                </label>
                <input
                  autoFocus
                  className="w-full p-2 border rounded-lg font-bold"
                  value={newService.etiqueta}
                  onChange={(e) =>
                    setNewService({ ...newService, etiqueta: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Usuario
                  </label>
                  <input
                    className="w-full p-2 text-sm border rounded-lg"
                    value={newService.usuario}
                    onChange={(e) =>
                      setNewService({ ...newService, usuario: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Password
                  </label>
                  <input
                    className="w-full p-2 text-sm border rounded-lg"
                    value={newService.password}
                    onChange={(e) =>
                      setNewService({ ...newService, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Host / IP
                  </label>
                  <input
                    className="w-full p-2 text-sm border rounded-lg"
                    value={newService.url_host}
                    onChange={(e) =>
                      setNewService({ ...newService, url_host: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Puerto
                  </label>
                  <input
                    className="w-full p-2 text-sm border rounded-lg"
                    value={newService.puerto}
                    onChange={(e) =>
                      setNewService({ ...newService, puerto: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Notas Técnicas Detalladas
                </label>
                <textarea
                  className="w-full p-2 text-xs border rounded-lg min-h-[80px]"
                  value={newService.notas}
                  onChange={(e) =>
                    setNewService({ ...newService, notas: e.target.value })
                  }
                />
              </div>
              <button
                type="button"
                onClick={confirmAddService}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-blue-700 transition-all mt-2"
              >
                Agregar a la Ficha del Servidor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerAccessForm;
