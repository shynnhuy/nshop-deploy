import axios from "axios";
import queryString from "query-string";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === "development"
  ? "http://localhost:8000/api"
  : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

export default instance;

export { productApi } from "./productApi";
export { authApi } from "./authApi";
export { adminApi } from "./adminApi";
export { shopApi } from "./shopApi";
export { checkoutApi } from "./checkoutApi";
