import api from './api'

async function getLoyaltySetting(){
    try{
        const response = await api.get(`/points`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function createLoyaltySetting(pointsPerBHD){
    try{
        const response = await api.post(`/points`, { pointsPerBHD });
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    getLoyaltySetting,
    createLoyaltySetting
}
