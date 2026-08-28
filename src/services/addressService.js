import api from './api'

async function createAddress(body){
    try{
        const response = await api.post(`/address`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}


async function getUserAddress(){
    try{
        const response = await api.get(`/address`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function updateAddress(id, body){
    try{
        const response = await api.put(`/address/${id}`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function deleteAddress(id){
    try{
        const response = await api.delete(`/address/${id}`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
  createAddress,
  getUserAddress,
  updateAddress,
  deleteAddress
};