import api from "./index";

class CheckoutApi {
  createPaymentIntent = (body) => {
    return api.post(`/checkout/createIntent`, body);
  };
  createOrder = (body) => {
    return api.post(`/checkout/createOrder`, body);
  };
}

export const checkoutApi = new CheckoutApi();
