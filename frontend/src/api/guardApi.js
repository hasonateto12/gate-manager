import api from "./axios";

// CREATE ENTRY REQUEST
export const createEntryRequest = async (data) => {

    const response = await api.post(
        "/guard/entry-request",
        data
    );

    return response.data;
};

// GET MY REQUESTS
export const getMyRequests = async () => {

    const response = await api.get(
        "/entry-requests"
    );

    return response.data;
};