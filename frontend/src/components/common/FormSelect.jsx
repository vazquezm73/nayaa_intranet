// src/components/common/FormSelect.jsx
import React from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <div className="flex flex-col gap-2 w-full relative">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-4 focus:ring-[#0062ff]/10 focus:border-[#0062ff] transition-all appearance-none cursor-pointer pr-10"
      >
        <option value="">{placeholder || "Seleccione una opción"}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.nombre}
          </option>
        ))}
      </select>
      {/* Icono de flecha personalizado para que no se vea el default del navegador */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

FormSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default FormSelect;
