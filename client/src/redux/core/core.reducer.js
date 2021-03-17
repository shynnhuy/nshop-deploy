import * as CoreTypes from "./core.types";

const initialState = {
  isLoadingCategory: false,
  isLoadingProduct: false,
  isLoadingShop: false,
  categories: [],
  products: [],
  defaultProducts: [],
  shops: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CoreTypes.LOADING_CATEGORY:
      return { ...state, isLoadingCategory: true, categories: [] };
    case CoreTypes.LOADING_PRODUCT:
      return { ...state, isLoadingProduct: true, products: [] };
    case CoreTypes.LOADING_SHOP:
      return { ...state, isLoadingShop: true, shops: [] };
    case CoreTypes.LOADING_USERS:
      return { ...state, isLoadingUsers: true, users: [] };
    case CoreTypes.LOADED_CATEGORY:
      return {
        ...state,
        isLoadingCategory: false,
        categories: [...action.payload],
      };
    case CoreTypes.LOADED_PRODUCT:
      return {
        ...state,
        isLoadingProduct: false,
        products: [...action.payload],
        defaultProducts: [...action.payload],
      };
    case CoreTypes.LOADED_SHOP:
      return { ...state, isLoadingShop: false, shops: [...action.payload] };
    case CoreTypes.LOADED_USERS:
      return { ...state, isLoadingUsers: false, users: [...action.payload] };
    case CoreTypes.FILTER_PRODUCTS:
      let value = action.payload.value;
      let filteredProducts = state.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(value) ||
          product.shop.name.toLowerCase().includes(value)
        );
      });

      return value
        ? {
            ...state,
            products: filteredProducts,
          }
        : {
            ...state,
            products: state.defaultProducts,
          };

    case CoreTypes.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, { ...action.payload }],
      };

    case CoreTypes.UPDATED_SHOP:
      return {
        ...state,
        shops: state.shops.map((shop) =>
          shop._id === action.id ? { ...action.payload } : shop
        ),
      };
    case CoreTypes.UPDATED_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.id ? { ...action.payload } : user
        ),
      };
    case CoreTypes.UPDATED_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category._id === action.id ? { ...action.payload } : category
        ),
      };
    case CoreTypes.DELETED_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.id),
      };
    default:
      return state;
  }
};
