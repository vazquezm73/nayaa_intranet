import React from "react";
import PropTypes from "prop-types";

/**
 * Componente FormInput reutilizable.
 * Mantiene la estética de Nayaa con etiquetas en mayúsculas y bordes suaves.
 */
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 italic"
        >
          {label}{" "}
          {required && <span className="text-brand-primary font-bold">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`
                    w-full px-4 py-3 rounded-xl border bg-white
                    text-sm text-slate-800 placeholder:text-slate-300
                    transition-all duration-200 ease-in-out outline-none
                    shadow-sm
                    ${
                      error
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-slate-200 focus:border-[var(--nayaa-primary)] focus:ring-4 focus:ring-[var(--nayaa-primary)]/10"
                    }
                `}
      />

      {error && (
        <span className="text-[10px] text-red-500 font-bold ml-1 uppercase">
          {error}
        </span>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default FormInput;
