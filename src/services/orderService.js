import api from './api'

async function getMyOrders(){
    try{
        const response = await api.get(`/orders`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function getAllOrders(){
    try{
        const response = await api.get(`/orders/admin`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function getOrderById(id){
    try{
        const response = await api.get(`/orders/${id}`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function updateOrderStatus(id, status){
    try{
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function cancelOrder(id){
    try{
        const response = await api.patch(`/orders/${id}/cancel`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
}
