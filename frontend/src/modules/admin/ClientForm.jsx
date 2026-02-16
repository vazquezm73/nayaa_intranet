import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Save, X } from "lucide-react";
import api from "../../api/axios";
import FormInput from "../../components/common/Input";
import FormSelect from "../../components/common/FormSelect";
import PrimaryButton from "../../components/common/Button";

const ClientForm = ({ onSave, onCancel, initialData }) => {
  const [tiposCliente, setTiposCliente] = useState([]);

  // Si initialData existe, lo usamos para rellenar campos (mapeando el ID del catálogo)
  const [formData, setFormData] = useState({
    nombreComercial: initialData?.nombreComercial || "",
    razonSocial: initialData?.razonSocial || "",
    rfcTaxId: initialData?.rfcTaxId || "",
    tipoCliente:
      initialData?.tipoCliente?._id || initialData?.tipoCliente || "", // Maneja objeto o ID
    contactoNombre: initialData?.contactoNombre || "",
    email: initialData?.email || "",
    telefono: initialData?.telefono || "",
    direccion: {
      calle: initialData?.direccion?.calle || "",
      ciudad: initialData?.direccion?.ciudad || "",
      estado: initialData?.direccion?.estado || "",
      pais: initialData?.direccion?.pais || "México",
    },
    observaciones: initialData?.observaciones || "",
  });

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const { data } = await api.get("/catalogs?tipo=tipo_cliente");
        setTiposCliente(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCatalogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((p) => ({
        ...p,
        [parent]: { ...p[parent], [child]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      // Asegurarnos que si está vacío envíe null, no un string vacío
      rfcTaxId:
        formData.rfcTaxId && formData.rfcTaxId.trim() !== ""
          ? formData.rfcTaxId.trim().toUpperCase()
          : null,
    };

    console.log("📤 Enviando datos:", dataToSubmit);

    try {
      if (initialData?._id) {
        const response = await api.put(
          `/clients/${initialData._id}`,
          dataToSubmit,
        );
        console.log("✅ Respuesta del servidor:", response.data);
      } else {
        const response = await api.post("/clients", dataToSubmit);
        console.log("✅ Respuesta del servidor:", response.data);
      }
      onSave();
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Error response:", error.response);
      alert(
        error.response?.data?.message ||
          error.response?.data?.details ||
          "Error en la operación",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
      <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center">
        <h3 className="font-black uppercase italic tracking-tighter text-xl">
          {initialData ? "Editar Cliente" : "Alta de Cliente"}
        </h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2">
          <FormInput
            label="Nombre Comercial"
            name="nombreComercial"
            value={formData.nombreComercial}
            onChange={handleChange}
            required
          />
        </div>
        <FormSelect
          label="Tipo de Cliente"
          name="tipoCliente"
          value={formData.tipoCliente}
          onChange={handleChange}
          options={tiposCliente}
          required
        />
        <FormInput
          label="RFC / Tax ID"
          name="rfcTaxId"
          value={formData.rfcTaxId}
          onChange={handleChange}
        />
        <FormInput
          label="Nombre de Contacto"
          name="contactoNombre"
          value={formData.contactoNombre}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <FormInput
          label="Ciudad"
          name="direccion.ciudad"
          value={formData.direccion.ciudad}
          onChange={handleChange}
        />

        <div className="md:col-span-3 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 font-bold text-xs uppercase"
          >
            Cancelar
          </button>
          <PrimaryButton type="submit" icon={Save}>
            {initialData ? "Guardar Cambios" : "Finalizar Registro"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

ClientForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
export default ClientForm;
