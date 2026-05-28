import api from "./axios";

/* =========================
   CHECK VEHICLE
========================= */
export const checkVehicle = async (
    plateNumber
) => {

    const response = await api.get(
        `/vehicles/check/${plateNumber}`
    );

    return response.data;
};

/* =========================
   CREATE ENTRY REQUEST
========================= */
export const createEntryRequest =
    async (requestData) => {

        const response = await api.post(
            "/entry-requests",
            requestData
        );

        return response.data;
    };