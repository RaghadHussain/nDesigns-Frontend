import api from './api'

async function createCategory(body) {
    try {
        const response = await api.post(`/categories`, body)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function getAllCategories() {
    try {
        const response = await api.get(`/categories`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function getCategoryById(id) {
    try {
        const response = await api.get(`/categories/${id}`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function updateCategory(id, body) {
    try {
        const response = await api.put(`/categories/${id}`, body)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

async function deleteCategory(id) {
    try {
        const response = await api.delete(`/categories/${id}`)
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message);
    }
}

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}