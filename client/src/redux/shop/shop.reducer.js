// import { ADD_CATEGORY } from "redux/admin/admin.types";
// import { LOADED_CATEGORY, LOADED_SHOP, ADD_PRODUCT } from "./shop.types";
import { LOADED_SHOP, ADD_PRODUCT, UPDATE_PRODUCT } from "./shop.types";

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    // case ADD_CATEGORY:
    //   return {
    //     ...state,
    //     categories: [...state.categories, { ...action.payload }],
    //   };

    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, { ...action.payload }],
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.id ? { ...action.payload } : product
        ),
      };
    case LOADED_SHOP:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
