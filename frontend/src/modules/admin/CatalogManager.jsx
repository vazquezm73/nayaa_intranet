import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Settings, ListFilter, Save } from "lucide-react";
import api from "../../api/axios";
import PrimaryButton from "../../components/common/Button";
import FormInput from "../../components/common/Input";

const CatalogManager = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("tipo_asset");

  // Lista de tipos conocidos para el sidebar
  // Dentro de CatalogManager.jsx

  const catalogTypes = [
    // CATEGORÍAS PARA CLIENTES
    { id: "tipo_cliente", label: "Tipos de Cliente (VIP, Corp)" },
    { id: "sector_cliente", label: "Sectores (IT, Salud, etc)" },

    // CATEGORÍAS PARA ACTIVOS (ASSETS)
    { id: "tipo_asset", label: "Tipos de Activo (VPS, Host)" },
    { id: "status_asset", label: "Estados de Activo" },
    { id: "proveedor", label: "Proveedores Técnicos" },

    // CATEGORÍAS FINANCIERAS
    { id: "moneda", label: "Divisas (MXN, USD)" },
    { id: "periodo_pago", label: "Periodos de Pago" },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "tipo_asset",
    descripcion: "",
    valorExtra: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/catalogs?tipo=${selectedType}`);
      setCatalogs(data);
    } catch (error) {
      console.error("Error al cargar catálogos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [selectedType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/catalogs/${editingId}`, formData);
      } else {
        await api.post("/catalogs", formData);
      }
      setFormData({
        nombre: "",
        tipo: selectedType,
        descripcion: "",
        valorExtra: "",
      });
      setEditingId(null);
      fetchCatalogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas inactivar este elemento?")) return;
    try {
      await api.delete(`/catalogs/${id}`);
      fetchCatalogs();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* SIDEBAR DE TIPOS */}
      <div className="w-full lg:w-64 space-y-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ListFilter size={14} /> Categorías
        </h4>
        {catalogTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedType(t.id);
              setFormData({ ...formData, tipo: t.id });
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedType === t.id
                ? "bg-[#0062ff] text-white shadow-lg shadow-blue-200"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 space-y-6">
        {/* FORMULARIO RÁPIDO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="md:col-span-1">
            <FormInput
              label="Nombre del Elemento"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>
          <div className="md:col-span-1">
            <FormInput
              label="Valor Extra (Opcional)"
              value={formData.valorExtra}
              onChange={(e) =>
                setFormData({ ...formData, valorExtra: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <PrimaryButton type="submit" icon={editingId ? Edit : Save}>
              {editingId ? "Actualizar" : "Agregar"}
            </PrimaryButton>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    nombre: "",
                    tipo: selectedType,
                    descripcion: "",
                    valorExtra: "",
                  });
                }}
                className="p-2 text-slate-400"
              >
                <Plus className="rotate-45" />
              </button>
            )}
          </div>
        </form>

        {/* TABLA DE VALORES */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nombre
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Valor Extra
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {catalogs.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {item.nombre}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {item.valorExtra || "-"}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setFormData(item);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {catalogs.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-slate-400 italic"
                  >
                    No hay elementos en esta categoría.
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

export default CatalogManager;
