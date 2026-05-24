import api from "./axios";

/* =========================
   GET MY REQUESTS
========================= */
export const getMyRequests = async () => {

    const response = await api.get(
        "/entry-requests"
    );

    return response.data;
};

/* =========================
   CREATE REQUEST
========================= */
export const createEntryRequest = async (data) => {

    const response = await api.post(
        "/entry-requests",
        data
    );

    return response.data;
};