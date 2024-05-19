import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "./components/Register";
import { message } from "antd";

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;
      const res = await refreshToken();
      refreshing = false;
      if (res.status === 200 || res.status === 201 || res.status === 304) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        setTimeout(() => {
          window.location.href = "/login";
          message.warning("登录过期，请重新登录");
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

export async function refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  sessionStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}


export async function uploadCustomAlgorithm(file:File, algorithmName:string) {
  const formData = new FormData();
  formData.append("cppfile", file!);
  formData.append("algorithmName", algorithmName);
  return await axiosInstance.post("/uploadCustomAlgorithm", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


export async function getAllAlgorithms(){
  return await axiosInstance.get("/algorithms");
}
