import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://project-3-twitter-app-backend.onrender.com",
});

export default api;
