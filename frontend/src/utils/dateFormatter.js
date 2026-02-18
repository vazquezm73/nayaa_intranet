export const formatDateMX = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Usamos Intl para forzar la zona horaria de México independientemente de dónde esté el cliente
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // Opcional: hour: '2-digit', minute: '2-digit'
  }).format(date);
};
