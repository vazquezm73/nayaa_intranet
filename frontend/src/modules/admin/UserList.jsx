import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Shield,
  Mail,
  Power,
  Key,
  ArrowLeft,
  Edit,
} from "lucide-react";
import api from "../../api/axios";
import PrimaryButton from "../../components/common/Button";
import UserForm from "./UserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Obtenemos el usuario actual para protecciones de seguridad
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    // Protección: No permitir que el admin se desactive a sí mismo
    if (user._id === currentUser.id) {
      alert("No se puede deshabilitar el administrador del Sistema");
      return;
    }
    try {
      await api.put(`/users/${user._id}`, { active: !user.active });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Error al cambiar estado");
    }
  };

  const handleResetPassword = async (user) => {
    const newPass = prompt(`Nueva contraseña temporal para ${user.nombre}:`);
    if (!newPass) return;
    if (newPass.length < 6)
      return alert("La contraseña debe tener al menos 6 caracteres");

    try {
      await api.patch(`/users/${user._id}/password`, { password: newPass });
      alert("Contraseña actualizada con éxito");
    } catch (error) {
      alert("Error al actualizar contraseña");
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] mb-4 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} /> Volver al listado
        </button>
        <UserForm
          userToEdit={editingUser}
          onSave={handleCloseForm}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Módulo */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 leading-none">
            Configuración de Usuarios
          </h2>
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
            Control de accesos y perfiles del sistema
          </span>
        </div>
        <PrimaryButton icon={UserPlus} onClick={handleAddNew}>
          Añadir Miembro
        </PrimaryButton>
      </div>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className={`bg-white rounded-[2rem] border p-6 transition-all shadow-sm ${
              !user.active
                ? "opacity-50 grayscale bg-slate-50"
                : "hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl ${user.active ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-400"}`}
              >
                <Shield size={20} />
              </div>
              <span
                className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${
                  user.role === "admin"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-purple-50 text-purple-600 border-purple-100"
                }`}
              >
                {user.role}
              </span>
            </div>

            <h3 className="font-black text-slate-800 uppercase italic text-lg leading-tight">
              {user.nombre}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
              <Mail size={12} /> {user.email}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
              <span
                className={`text-[10px] font-black uppercase tracking-tighter ${
                  user.active ? "text-emerald-500" : "text-red-400"
                }`}
              >
                ● {user.active ? "Activo" : "Inactivo"}
              </span>

              <div className="flex gap-1">
                {/* Botón Editar */}
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-lg text-slate-400 transition-colors"
                  title="Editar Perfil"
                >
                  <Edit size={16} />
                </button>

                {/* Botón Password */}
                <button
                  onClick={() => handleResetPassword(user)}
                  className="p-2 hover:bg-amber-50 hover:text-amber-500 rounded-lg text-slate-400 transition-colors"
                  title="Cambiar Contraseña"
                >
                  <Key size={16} />
                </button>

                {/* Botón Power (Desactivar) */}
                <button
                  onClick={() => toggleStatus(user)}
                  disabled={user._id === currentUser.id}
                  className={`p-2 rounded-lg transition-colors ${
                    user._id === currentUser.id
                      ? "opacity-10 cursor-not-allowed text-slate-300"
                      : user.active
                        ? "hover:bg-red-50 text-red-400"
                        : "hover:bg-emerald-50 text-emerald-400"
                  }`}
                  title={
                    user._id === currentUser.id
                      ? "No puedes desactivarte a ti mismo"
                      : "Cambiar Estado"
                  }
                >
                  <Power size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
