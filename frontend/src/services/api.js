import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 12000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("greenstack_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    const requestUrl = error.config?.url || "";
    const isAuthRequest = requestUrl.startsWith("/auth/login") || requestUrl.startsWith("/auth/signup");

    if (error.response?.status === 401 && !isAuthRequest) {
      window.dispatchEvent(new Event("greenstack:unauthorized"));
    }

    return Promise.reject(new Error(message));
  },
);

const api = {
  auth: {
    login: async (payload) => (await client.post("/auth/login", payload)).data,
    signup: async (payload) => (await client.post("/auth/signup", payload)).data,
  },
  emissions: {
    list: async () => (await client.get("/emissions")).data,
    create: async (payload) => (await client.post("/emissions", payload)).data,
    summary: async () => (await client.get("/emissions/summary")).data,
  },
  suppliers: {
    list: async () => (await client.get("/suppliers")).data,
    create: async (payload) => (await client.post("/suppliers", payload)).data,
    requestData: async (supplierId) => (await client.post(`/suppliers/${supplierId}/request`)).data,
  },
  reports: {
    generate: async (params) => (await client.get("/reports/generate", { params })).data,
  },
  scenario: {
    simulate: async (payload) => (await client.post("/scenario/simulate", payload)).data,
  },
  settings: {
    get: async () => (await client.get("/settings")).data,
    update: async (payload) => (await client.put("/settings", payload)).data,
  },
};

export default api;
