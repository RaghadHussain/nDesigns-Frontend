import api from './api'

async function createDiscount(body){
    try{
        const response = await api.post(`/discounts`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function getAllDiscounts(){
    try{
        const response = await api.get(`/discounts`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function applyDiscount(code){
    try{
        const response = await api.post(`/discounts/apply`, { code });
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    createDiscount,
    getAllDiscounts,
    applyDiscount
}
