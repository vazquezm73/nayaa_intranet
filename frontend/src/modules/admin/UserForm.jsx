import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import FormInput from "../../components/common/Input";
import FormSelect from "../../components/common/FormSelect";
import PrimaryButton from "../../components/common/Button";
import { Save, ShieldCheck, X } from "lucide-react";

const UserForm = ({ onSave, onCancel, userToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "", // Solo se usará en creación
    role: "staff",
  });

  const isEditing = !!userToEdit;

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        role: userToEdit.role,
        password: "", // La contraseña no se edita aquí, se hace con el botón de llave
      });
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Quitamos el password del envío si estamos editando
        const { password, ...updateData } = formData;
        await api.put(`/users/${userToEdit._id}`, updateData);
      } else {
        await api.post("/users", formData);
      }
      onSave();
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar la solicitud");
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 relative">
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-3 border-b pb-4 mb-6">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
          <ShieldCheck size={20} />
        </div>
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-800">
          {isEditing ? "Actualizar Colaborador" : "Registrar Nuevo Colaborador"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nombre Completo"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
          <FormInput
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Rol de Acceso"
            options={[
              { _id: "admin", nombre: "Administrador" },
              { _id: "manager", nombre: "Manager" },
              { _id: "staff", nombre: "Staff Operativo" },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          {!isEditing && (
            <FormInput
              label="Contraseña Inicial"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 font-bold uppercase text-xs"
          >
            Cancelar
          </button>
          <PrimaryButton type="submit" icon={Save}>
            {isEditing ? "Guardar Cambios" : "Crear Cuenta"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
