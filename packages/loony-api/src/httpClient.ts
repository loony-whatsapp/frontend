import axios from "axios";

export function Axios(URL: string) {
  const client = axios.create({
    baseURL: URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Attach JWT token to every request
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  let isRefreshing = false;
  let refreshSubscribers: Array<() => void> = [];

  function onRefreshed() {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
  }

  client.interceptors.response.use(
    (response) => response,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            await client.post("/auth/refresh", {});
            isRefreshing = false;
            onRefreshed();
            return client(originalRequest);
          } catch (refreshErr) {
            isRefreshing = false;
            // Clear stale token and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
            return Promise.reject(refreshErr);
          }
        }
      }

      return Promise.reject(err);
    },
  );

  return client;
}
