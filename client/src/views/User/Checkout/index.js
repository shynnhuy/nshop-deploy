import React, { useState } from "react";
import {
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Confirmation from "./Confirmation";
import { checkoutApi } from "api";

const steps = ["Shipping Address", "Shipping Details"];

const CheckOut = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState({});

  const nextStep = () => setActiveStep(activeStep + 1);
  const backStep = () => setActiveStep(activeStep - 1);

  const next = (data) => {
    setClientSecret(data);
    nextStep();
  };

  const confirm = async (body) => {
    const { data } = await checkoutApi.createOrder(body);
    setOrder(data);
    nextStep();
  };

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm next={next} />
    ) : (
      <PaymentForm
        clientSecret={clientSecret}
        backStep={backStep}
        confirm={confirm}
      />
    );

  const ConfirmPage = () => <Confirmation order={order} />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">
        Check Out
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? <ConfirmPage /> : <Form />}
    </Container>
  );
};

export default CheckOut;
