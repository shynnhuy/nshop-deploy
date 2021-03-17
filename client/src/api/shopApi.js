import api from "./index";

class ShopApi {
  createShop = (newShop) => {
    return api.post("/shop/", newShop);
  };
  getCategories = () => {
    return api.get("/products/category");
  };
  getShopDetails = (id) => {
    return api.get("/shop/" + id);
  };
  getShopProducts = (params) => {
    const url = "/shop/products";
    return api.get(url, { params });
  };
}

export const shopApi = new ShopApi();
