import api from './api'


async function getCart() {
    try {
        const response = await api.get(`/cart`);
        return response.data;

    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}


async function deleteCart() {
    try {
        const response = await api.delete(`/cart`);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

export {
    getCart,
    deleteCart
};