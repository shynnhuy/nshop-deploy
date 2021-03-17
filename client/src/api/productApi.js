import api from "./index";

class ProductApi {
  getProduct = (id) => {
    return api.get(`/products/${id}`);
  };
  getProducts = (params) => {
    const url = "/products";
    return api.get(url, { params });
  };
  createProduct = (product) => {
    return api.post("/products/create", product);
  };
  updateProduct = (id, product) => {
    return api.patch(`/products/${id}`, product);
  };
}

export const productApi = new ProductApi();
