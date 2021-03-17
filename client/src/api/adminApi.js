import api from "./index";

class AdminApi {
  getUsers = () => {
    return api.get(`/auth/users`);
  };
  getShops = () => {
    return api.get("/shop/");
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

export const adminApi = new AdminApi();
