
import api from './api'

async function signUp(formData){
    const response = await api.post('/auth/sign-up',formData)
}

async function signIn(formData){
    const response = await api.post('/auth/sign-in',formData)
    localStorage.setItem('token', response.data.accessToken);
    return response.data.user
}


async function getCurrentUser(){

    const response = await api.get(
        "/auth/me"
    );


    return response.data;

}



function logout(){

    localStorage.removeItem("token");

}

async function updateUserDetails(id, body){
    try{
        const response = await api.put(`/auth/${id}/editDetails`, body);
        return response.data;
    }catch(err){
        throw new Error (err.response?.data?.message || err.message);
    }
}

export {
  signUp,
  signIn,
  getCurrentUser,
  logout,
  updateUserDetails
};

