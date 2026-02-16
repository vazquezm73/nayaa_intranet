import React from "react";
import PropTypes from "prop-types";

/**
 * PrimaryButton: Recuperando el estilo visual exacto que funcionaba
 */
const PrimaryButton = ({
  children,
  onClick,
  icon: Icon,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                flex items-center justify-center gap-2 
                bg-[#0062ff] 
                px-6 py-2 
                rounded-xl 
                shadow-lg 
                transition-all 
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
            `}
    >
      {Icon && <Icon size={20} className="text-white" />}
      <span className="text-white font-bold">{children}</span>
    </button>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
};

export default PrimaryButton;
