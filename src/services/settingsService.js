import api from './api'

async function getSettings(){
    try{
        const response = await api.get(`/settings`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function createSettings(deliveryFee, pointsPerBHD){
    try{
        const response = await api.post(`/settings`, { deliveryFee, pointsPerBHD });
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    getSettings,
    createSettings
}
