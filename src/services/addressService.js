import api from './api'

async function createAddress(body){
    try{
        const response = await api.post(`/products`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function getAllProducts(){
    try{
        const response = await api.get(`/products`);
        return response.data;

    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function getProductById(id){
    try{
        const response = await api.get(`/products/${id}`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function updateProduct(id, body){
    try{
        const response = await api.put(`/products/${id}`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

async function deleteProduct(id){
    try{
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
  
};