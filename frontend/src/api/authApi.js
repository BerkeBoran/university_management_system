import api from "./axios.js"

export const LoginUser = async (data) => {
    const response = await api.post("/login/",
        {
            username,
            password,
        });
    return response.data;
};

export const RefreshToken = async (data) => {
    const response = await api.post("/token/refresh/",{
        refresh
    });
    return response.data
};