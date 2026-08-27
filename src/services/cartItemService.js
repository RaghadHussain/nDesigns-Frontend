import api from './api'

async function createCartItem(body){
    try{
        const response = await api.post(`/cartItem`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}


async function updateCartItem(id, body){
    try{
        const response = await api.put(`/cartItem/${id}`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function deleteCartItem(id){
    try{
        const response = await api.delete(`/cartItem/${id}`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
  createCartItem,
  updateCartItem,
  deleteCartItem
};