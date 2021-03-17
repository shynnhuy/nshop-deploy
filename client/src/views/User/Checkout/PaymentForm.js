import { Button, Divider, Box, Typography } from "@material-ui/core";
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { connect } from "react-redux";
import { selectCartTotal } from "redux/cart/cart.selectors";
import Review from "./Review";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_SHAREABLE);

const PaymentForm = ({ clientSecret, backStep, confirm, items, total }) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.log(error);
    } else {
      console.log("Payment Successfully: ", paymentIntent);
      const orderData = {
        shipping: paymentIntent.shipping,
        status: paymentIntent.status,
        total: paymentIntent.amount,
        customer: {
          email: paymentIntent.receipt_email,
        },
        payment_id: paymentIntent.id,
        items: items.map(({ _id, name, price, quantity }) => {
          return { id: _id, price, name, quantity };
        }),
      };
      confirm(orderData);
    }
  };

  return (
    <div>
      <Review items={items} total={total} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment Method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br />
              <br />
              <Box display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={backStep}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!stripe}
                  color="primary"
                >
                  Pay {total}đ
                </Button>
              </Box>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </div>
  );
};

const mapState = (state) => ({
  items: state.cart.cartItems,
  total: selectCartTotal(state),
});

export default connect(mapState)(PaymentForm);
