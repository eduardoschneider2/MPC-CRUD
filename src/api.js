import axios from "axios";

const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

const api = axios.create({
  baseURL: "https://escola.agendaedu.com/schools/",
});

api.interceptors.request.use((config) => {
  const token = getTokenFromUrl();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
