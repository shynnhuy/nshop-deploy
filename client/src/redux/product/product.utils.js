export const sortPriceASC = (arr, field) => {
  return arr.sort((a, b) => {
    if (a.price[field] > b.price[field]) return 1;
    if (b.price[field] > a.price[field]) return -1;
    return 0;
  });
};

export const sortPriceDESC = (arr, field) => {
  return arr.sort(function (a, b) {
    if (a.price[field] > b.price[field]) return -1;
    if (b.price[field] > a.price[field]) return 1;
    return 0;
  });
};

export const sortPrice = (arr, direction) => {
  return direction === "asc"
    ? sortPriceASC(arr, "new")
    : sortPriceDESC(arr, "new");
};

export const sortDiscount = (arr, direction) => {
  return direction === "asc"
    ? sortPriceASC(arr, "discount")
    : sortPriceDESC(arr, "discount");
};

function sortAsc(arr) {
  return arr.sort(function (a, b) {
    if (a["name"] > b["name"]) return 1;

    if (b["name"] > a["name"]) return -1;

    return 0;
  });
}

function sortDesc(arr) {
  return arr.sort(function (a, b) {
    if (a["name"] > b["name"]) return -1;

    if (b["name"] > a["name"]) return 1;

    return 0;
  });
}

export const sortName = (arr, direction) => {
  return direction === "asc" ? sortAsc(arr) : sortDesc(arr);
};
