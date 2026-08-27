import api from './api'

async function getVariantById(variantId) {
    try {
        const response = await api.get(`/variants/${variantId}`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);

    }
}

async function updateVariant(variantId, body) {
    try {
        const response = await api.put(`/variants/${variantId}`, body)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function deleteVariant(variantId) {
    try {
        const response = await api.delete(`/variants/${variantId}`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function createVariant(productId, body) {
    try {
        const response = await api.post(`/products/${productId}/variants`, body)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function getVariantByProduct(productId) {
    try {
        const response = await api.get(`/products/${productId}/variants`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}


export {
    getVariantById,
    updateVariant,
    deleteVariant,
    createVariant,
    getVariantByProduct
}