import api from "./axios";

/* =========================
   CHECK VEHICLE
========================= */
export const checkVehicle = async (plateNumber) => {

    const response = await api.get(
        `/vehicles/check/${plateNumber}`
    );

    return response.data;
};