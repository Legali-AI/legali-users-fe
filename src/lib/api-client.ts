import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_CONFIG } from "./config";

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized access
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then((res) => res.data),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.post(url, data, config).then((res) => res.data),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.put(url, data, config).then((res) => res.data),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => apiClient.patch(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then((res) => res.data),
};
