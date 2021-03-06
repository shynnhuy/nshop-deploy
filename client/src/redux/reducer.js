import { combineReducers } from "redux";
import adminReducer from "./admin/admin.reducer";
import authReducer from "./auth/auth.reducer";
import snackbarReducer from "./snackbar/snackbar.reducer";
import shopReducer from "./shop/shop.reducer";
import productReducer from "./product/product.reducer";
import cartReducer from "./cart/cart.reducer";
import coreReducer from "./core/core.reducer";

export default combineReducers({
  auth: authReducer,
  admin: adminReducer,
  snack: snackbarReducer,
  shop: shopReducer,
  product: productReducer,
  cart: cartReducer,
  core: coreReducer,
});
