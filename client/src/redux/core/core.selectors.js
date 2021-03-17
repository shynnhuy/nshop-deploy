import { createSelector } from "reselect";

const coreSelector = (state) => state.core;

export const selectProducts = createSelector(
  [coreSelector],
  (core) => core.products
);

export const selectUsersList = createSelector(
  coreSelector,
  (core) => core.users
);

export const selectShopsList = createSelector(
  coreSelector,
  (core) => core.shops
);

export const selectCategoriesList = createSelector(
  coreSelector,
  (core) => core.categories
);

export const selectProductCategory = createSelector(
  (state, props) =>
    state.core.categories.find((item) => item._id === props.product.category),
  (item) => item.name
);
