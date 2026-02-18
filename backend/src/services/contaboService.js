const axios = require("axios");
const Asset = require("../models/Asset");
const Catalog = require("../models/Catalog");

/**
 * Obtiene el token de acceso de OAuth2 de Contabo
 */
const getContaboToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", process.env.CONTABO_CLIENT_ID);
  params.append("client_secret", process.env.CONTABO_CLIENT_SECRET);
  params.append("username", process.env.CONTABO_API_USER);
  params.append("password", process.env.CONTABO_API_PASS);

  const { data } = await axios.post(
    "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token",
    params,
  );
  return data.access_token;
};

/**
 * Sincroniza los activos técnicos desde la API de Contabo
 */
const syncContaboAssets = async () => {
  try {
    const token = await getContaboToken();

    // Buscamos el ID del proveedor "Contabo" en tu catálogo para asegurar consistencia
    const proveedorContabo = await Catalog.findOne({ nombre: /Contabo/i });

    const {
      data: { data: instances },
    } = await axios.get("https://api.contabo.com/v1/compute/instances", {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-request-id": require("crypto").randomUUID(),
      },
    });

    let updated = 0;

    for (const inst of instances) {
      // Preparamos el objeto de actualización
      const updateData = {
        // Marcamos el nombre con (API) para que confirmes la sincronización
        nombre: `(API) ${inst.displayName || inst.name}`,
        ipPrincipal: inst.ipConfig?.v4?.ip || "0.0.0.0",
        "recursos.ram": `${inst.ramMb / 1024} GB`,
        "recursos.cpu": `${inst.cpuCores} Cores`,
        "recursos.disco": `${inst.diskMb / 1024} GB`,
        "recursos.os": inst.osType,
        "recursos.ubicacion": inst.regionName || "N/A",
        "recursos.ipv6": inst.ipConfig?.v6?.ip || "N/A",
        active: inst.status === "running",
        // Asignamos el proveedor por si es un asset nuevo detectado
        proveedor: proveedorContabo ? proveedorContabo._id : null,
      };

      // Ejecutamos la actualización basada en el externalId que configuraste manualmente
      const res = await Asset.updateOne(
        { externalId: inst.instanceId.toString() },
        { $set: updateData },
      );

      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        updated++;
      }
    }

    return {
      success: true,
      total: instances.length,
      updated,
    };
  } catch (error) {
    console.error(
      "Error en syncContaboAssets Service:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

module.exports = { syncContaboAssets };
