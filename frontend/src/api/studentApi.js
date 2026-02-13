import api from "./axios.js"

export const getStudent = async () => {
  const response = await api.get("/students/")
    return response.data;
};