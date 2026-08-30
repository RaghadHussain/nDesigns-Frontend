import api from './api'

async function getDeliveryFee(){
    try{
        const response = await api.get(`/delivery-settings`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function createDeliveryFee(fee){
    try{
        const response = await api.post(`/delivery-settings`, { fee });
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    getDeliveryFee,
    createDeliveryFee
}
