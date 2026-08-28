import api from './api'

async function checkout(body){
    try{
        const response = await api.post(`/orders/checkout`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    checkout
}
