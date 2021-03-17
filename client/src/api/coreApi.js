import api from "./index";

class CoreApi {
  getCategories = () => {
    return api.get("/products/category");
  };
  getProducts = (params) => {
    return api.get("/products", { params });
  };
  getUsers = () => {
    return api.get(`/auth/users`);
  };
  getShops = () => {
    return api.get("/shop/");
  };
  createCategory = (newCategory) => {
    return api.post(`/products/createCategory`, newCategory);
  };
  updateShopStatus = (id, status) => {
    return api.patch(`/shop/${id}`, { status });
  };
  updateUser = (id, userData) => {
    return api.patch(`/auth/${id}`, userData);
  };
  updateCategory = (id, categoryData) => {
    return api.patch(`/products/category/${id}`, categoryData);
  };
  deleteUser = (id) => {
    return api.delete(`/auth/${id}`);
  };
}

export const coreApi = new CoreApi();
