import axios from "axios";

export const api = axios.create({

    baseURL: "http://localhost:3000"

});

export async function createPayment(data: {
    type: string;
    amount: number;
    sourceCurrency: string;
    destinationCurrency: string;
    recipient: string;
}) {

    const response =
        await api.post("/payments", data);

    return response.data;

}

export async function getPayment(id: string) {

    const response =
        await api.get(`/payments/${id}`);

    return response.data;

}

export async function getEvents(id: string) {

    const response =
        await api.get(`/payments/${id}/events`);

    return response.data;

}