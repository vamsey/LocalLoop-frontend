import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getBusinesses = async () => {
  const response = await API.get("/business/approved");
  return response;
};