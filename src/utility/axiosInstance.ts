import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";


function updateAuthToken(token: string) {
  localStorage.setItem("token", token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const { data } = await axios.post('https://loaschedule.site/api/refresh_token', { refreshToken });
    if (data.refreshToken) {
      updateAuthToken(data.refreshToken);
    }
    return data.refreshToken;
  } catch (error) {
    throw error;
  }
}


const springAxiosInst: AxiosInstance = axios.create({
  baseURL: "https://loaschedule.site",
  timeout: 5000,
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});


springAxiosInst.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<unknown, any>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig & AxiosRequestConfig;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return springAxiosInst(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // Propagate other errors
    return Promise.reject(error);
  }
);

export default springAxiosInst;
export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}
