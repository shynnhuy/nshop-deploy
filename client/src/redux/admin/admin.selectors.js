import { createSelector } from "reselect";

const selectCore = (state) => state.core;

export const selectUsersList = createSelector(selectCore, (core) => core.users);

export const selectShopsList = createSelector(selectCore, (core) => core.shops);

export const selectCategoriesList = createSelector(
  selectCore,
  (core) => core.categories
);

export const selectProductsList = createSelector(
  selectCore,
  (core) => core.products
);
