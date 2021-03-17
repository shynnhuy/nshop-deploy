const stripeSecret =
  "sk_test_51HpaMfDXe7CZVgBq6yzz2oAJ25pShYSdhqM99N4zabkprKjWohYrCEq1UHu3DMeAlXHEBCRwPcmVvdGDaqFSt0ZW00sS58IsNz";
const stripe = require("stripe")(stripeSecret);
const { getDistrict } = require("../helpers");

const Order = require("../models/Order");

module.exports = {
  async CreatePayment(req, res, next) {
    const { items, total, customer, shipping, payment } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "vnd",
        metadata: { integration_check: "accept_a_payment" },
        payment_method_types: ["card"],
        receipt_email: customer.email,
        customer: customer.id,
        shipping: {
          address: {
            line1: shipping.street,
            line2: shipping.ward,
            country: "VN",
            state: "Da Nang",
            city: shipping.district,
          },
          name: customer.firstName + " " + customer.lastName,
        },
      });

      console.log(paymentIntent);
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      next(error);
    }
  },

  PlaceOrder: async (req, res, next) => {
    try {
      const { items, total, customer, status, shipping, payment_id } = req.body;
      const newOrder = new Order({
        items,
        total,
        customer: { ...customer, userId: req.payload.aud },
        status,
        shipping,
        payment_id,
      });
      const savedOrder = await newOrder.save();
      res.json(savedOrder);
    } catch (error) {
      next(error);
    }
  },

  GetDistrict(req, res) {
    const district = getDistrict();
    const { ward } = req.query;
    if (ward) {
      const wardList = district.find(
        (d) => d.slug === ward.trim().toLowerCase()
      );
      return res.json(wardList["xa-phuong"]);
    }
    return res.json(district);
  },
};
