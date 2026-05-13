import axios from "axios";

export function Axios(URL: string) {
  const client = axios.create({
    baseURL: URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Attach JWT token to every outgoing request
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // On 401 the token is expired or invalid — clear auth state and reload to login
  client.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      }
      return Promise.reject(err);
    },
  );

  return client;
}
