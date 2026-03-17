import axios from "axios";

const API = axios.create({
  baseURL: "https://localloop-backend-7317.onrender.com/api",
});

export const getBusinesses = async () => {
  const response = await API.get("/business/approved");
  return response;
};