import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Server,
  DollarSign,
  Activity,
  Cpu,
  Users,
} from "lucide-react";
import api from "../../api/axios";
import FormInput from "../../components/common/Input";
import FormSelect from "../../components/common/FormSelect";
import PrimaryButton from "../../components/common/Button";

const AssetForm = ({ onSave, onCancel, initialData }) => {
  const [clientes, setClientes] = useState([]);
  const [tiposAsset, setTiposAsset] = useState([]);
  const [estados, setEstados] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [moneda, setMoneda] = useState([]);

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    // CAMBIO: Inicializamos como array
    clientes: initialData?.clientes?.map((c) => c._id || c) || [],
    tipoAsset: initialData?.tipoAsset?._id || initialData?.tipoAsset || "",
    status: initialData?.status?._id || initialData?.status || "",
    proveedor: initialData?.proveedor?._id || initialData?.proveedor || "",
    ipPrincipal: initialData?.ipPrincipal || "",
    hostname: initialData?.hostname || "",
    recursos: {
      cpu: initialData?.recursos?.cpu || "",
      ram: initialData?.recursos?.ram || "",
      disco: initialData?.recursos?.disco || "",
      ubicacion: initialData?.recursos?.ubicacion || "",
      os: initialData?.recursos?.os || "",
      ipv6: initialData?.recursos?.ipv6 || "",
    },
    esCompartido: initialData?.esCompartido || false, // Nuevo campo
    costoMensual: initialData?.costoMensual || 0,
    costoAnual: initialData?.costoAnual || 0,
    moneda: initialData?.moneda || "MXN",
    fechaVencimiento: initialData?.fechaVencimiento
      ? initialData.fechaVencimiento.split("T")[0]
      : "",
    observaciones: initialData?.observaciones || "",
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [resCli, resCat] = await Promise.all([
          api.get("/clients"),
          api.get("/catalogs"),
        ]);
        setClientes(
          resCli.data.map((c) => ({ _id: c._id, nombre: c.nombreComercial })),
        );
        setTiposAsset(resCat.data.filter((c) => c.tipo === "tipo_asset"));
        setEstados(resCat.data.filter((c) => c.tipo === "status_asset"));
        setProveedores(resCat.data.filter((c) => c.tipo === "proveedor"));
        setMoneda(resCat.data.filter((c) => c.tipo === "moneda"));
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "esCompartido") {
      setFormData((prev) => ({ ...prev, esCompartido: checked, clientes: [] }));
      return;
    }

    if (name === "clientes") {
      // Si es múltiple, manejamos el array. Si no, lo envolvemos en array.
      const val = Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      );
      setFormData((prev) => ({ ...prev, clientes: val }));
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData?._id) {
        await api.put(`/assets/${initialData._id}`, formData);
      } else {
        await api.post("/assets", formData);
      }
      onSave();
    } catch (error) {
      alert(error.response?.data?.message || "Error al guardar el activo");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header idéntico al anterior */}
      <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0062ff] rounded-lg">
            <Server size={20} />
          </div>
          <h3 className="font-black uppercase italic tracking-tighter text-xl">
            {initialData ? "Editar Activo" : "Nuevo Activo"}
          </h3>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3 border-b border-slate-100 pb-4 mb-2 flex justify-between items-center">
            <h4 className="flex items-center gap-2 text-slate-800 font-bold uppercase text-xs tracking-widest">
              <DollarSign size={14} className="text-[#0062ff]" /> Información
              Comercial
            </h4>
            {/* Toggle para Tipo de Uso */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="esCompartido"
                checked={formData.esCompartido}
                onChange={handleChange}
                className="w-4 h-4 text-[#0062ff] rounded"
              />
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">
                Servidor Compartido (Multi-cliente)
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Nombre Identificador"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: MXSERVER7"
            />
          </div>

          {/* Selector de Clientes Dinámico */}
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
              {formData.esCompartido
                ? "Clientes Vinculados (Multiselección)"
                : "Cliente Único"}
            </label>
            <select
              name="clientes"
              multiple={formData.esCompartido}
              value={formData.clientes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0062ff] outline-none transition-all text-sm bg-slate-50"
              required
            >
              {!formData.esCompartido && (
                <option value="">Seleccionar Cliente...</option>
              )}
              {clientes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {formData.esCompartido && (
              <p className="text-[9px] text-slate-400 mt-1 italic">
                Mantén Ctrl (o Cmd) para seleccionar varios
              </p>
            )}
          </div>

          <FormInput
            label="Costo Mensual"
            name="costoMensual"
            type="number"
            value={formData.costoMensual}
            onChange={handleChange}
          />
          <FormInput
            label="Costo Anual"
            name="costoAnual"
            type="number"
            value={formData.costoAnual}
            onChange={handleChange}
          />
          <FormInput
            label="Vencimiento"
            name="fechaVencimiento"
            type="date"
            value={formData.fechaVencimiento}
            onChange={handleChange}
          />

          {/* SECCIÓN 2: DATOS TÉCNICOS (Igual a la anterior) */}
          <div className="md:col-span-3 border-b border-slate-100 pb-4 mt-4 mb-2">
            <h4 className="flex items-center gap-2 text-slate-800 font-bold uppercase text-xs tracking-widest">
              <Cpu size={14} className="text-[#0062ff]" /> Especificaciones
              Técnicas
            </h4>
          </div>

          <FormInput
            label="IP Principal"
            name="ipPrincipal"
            value={formData.ipPrincipal}
            onChange={handleChange}
            placeholder="0.0.0.0"
          />
          <FormInput
            label="Hostname"
            name="hostname"
            value={formData.hostname}
            onChange={handleChange}
            placeholder="srv.nayaa.com"
          />
          <FormSelect
            label="Proveedor"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            options={proveedores}
          />

          <FormInput
            label="CPU"
            name="recursos.cpu"
            value={formData.recursos.cpu}
            onChange={handleChange}
          />
          <FormInput
            label="RAM"
            name="recursos.ram"
            value={formData.recursos.ram}
            onChange={handleChange}
          />
          <FormInput
            label="Disco"
            name="recursos.disco"
            value={formData.recursos.disco}
            onChange={handleChange}
          />
          <FormInput
            label="Ubicacion"
            name="recursos.ubicacion"
            value={formData.recursos.ubicacion}
            onChange={handleChange}
          />
          <FormInput
            label="Sistema Operativo"
            name="recursos.os"
            value={formData.recursos.os}
            onChange={handleChange}
          />
          <FormInput
            label="IP v6"
            name="recursos.ipv6"
            value={formData.recursos.ipv6}
            onChange={handleChange}
          />
          {/* SECCIÓN 3: CLASIFICACIÓN (Igual a la anterior) */}
          <div className="md:col-span-3 border-b border-slate-100 pb-4 mt-4 mb-2">
            <h4 className="flex items-center gap-2 text-slate-800 font-bold uppercase text-xs tracking-widest">
              <Activity size={14} className="text-[#0062ff]" /> Clasificación
            </h4>
          </div>

          <FormSelect
            label="Tipo Asset"
            name="tipoAsset"
            value={formData.tipoAsset}
            onChange={handleChange}
            options={tiposAsset}
            required
          />
          <FormSelect
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={estados}
            required
          />
          <FormSelect
            label="Moneda"
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            options={moneda}
          />

          <div className="md:col-span-3">
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-slate-200 outline-none min-h-[100px]"
              placeholder="Observaciones..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 font-bold text-xs uppercase"
          >
            Descartar
          </button>
          <PrimaryButton type="submit" icon={Save}>
            {initialData ? "Actualizar" : "Guardar"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;
