import React from "react";
import ProviderDashboard from "./components/ProviderDashboard";

const ContratosModule = () => {
  return (
    <div className="max-w-full mx-auto">
      {/* Eliminamos el título duplicado porque MainLayout ya lo muestra */}
      <ProviderDashboard />
    </div>
  );
};

export default ContratosModule;
