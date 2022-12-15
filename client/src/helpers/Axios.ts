import axios, { AxiosRequestConfig } from "axios";

export const axiosConfig: (token: string) => AxiosRequestConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default axios.create({
  baseURL: "http://localhost:3080",
  timeout: 8000,
});
