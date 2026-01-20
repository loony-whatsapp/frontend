import axios from "axios";

export function Axios(URL: string) {
  const client = axios.create({
    baseURL: URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request interceptor
  // httpClient.interceptors.request.use((config) => {
  //   const token = localStorage.getItem("token")
  //   if (token) config.headers.Authorization = `Bearer ${token}`
  //   return config
  // })

  // Response interceptor

  let isRefreshing = false;
  let refreshSubscribers: any = [];

  // function subscribeTokenRefresh(cb: any) {
  //   refreshSubscribers.push(cb)
  // }

  function onRrefreshed() {
    refreshSubscribers.forEach((cb: any) => cb());
    refreshSubscribers = [];
  }

  client.interceptors.response.use(
    (response) => response,
    async (err) => {
      console.log("AuthClient error", err);
      const originalRequest = err.config;

      // If 401 and we haven’t retried yet
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Prevent multiple parallel refresh calls
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            await client.post("/refreshToken", {});
            isRefreshing = false;
            onRrefreshed();
            return client(originalRequest); // retry original
          } catch (refreshErr) {
            isRefreshing = false;

            // ❌ Refresh failed → redirect to login
            // window.location.href = "/login"
            return Promise.reject(refreshErr);
          }
        }

        // If another refresh is already happening, queue the request
        // return new Promise((resolve) => {
        //   subscribeTokenRefresh(() => {
        //     resolve(authHttpClient(originalRequest))
        //   })
        // })
      }

      return Promise.reject(err);
    },
  );

  return client;
}
