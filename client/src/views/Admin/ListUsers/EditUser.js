import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, Grid } from "@material-ui/core";
import FormikField from "components/core/FormikField";
import FormikSelect from "components/core/FormikSelect";
import { CheckboxWithLabel } from "formik-material-ui";
import useModal from "hooks/useModal";

const EditUser = ({ user, updateUser }) => {
  const { onClose } = useModal();
  if (!user._id) {
    return <h3>Loading...</h3>;
  }

  const { _id, email, displayName, gender, age, address, roles } = user;

  const genderItems = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
    {
      label: "Neutral",
      value: "neutral",
    },
  ];

  const rolesArr = ["member", "moderator", "administrator"];

  return (
    <Formik
      initialValues={{
        email,
        displayName,
        gender,
        age,
        address,
        roles,
      }}
      onSubmit={async (values) => {
        const isSuccess = await updateUser(_id, values);
        if (isSuccess) {
          onClose();
        }
      }}
    >
      <Form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormikField name="email" label="Email" disabled margin="none" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormikField
              name="displayName"
              label="Display Name"
              margin="none"
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormikSelect
              name="gender"
              label="Gender"
              margin="none"
              items={genderItems}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <FormikField name="age" label="Age" margin="none" />
          </Grid>
          <Grid item xs={12}>
            {rolesArr.map((role, index) => (
              <Field
                key={index}
                type="checkbox"
                component={CheckboxWithLabel}
                name="roles"
                value={role}
                Label={{ label: role }}
              />
            ))}
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Edit {displayName}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

export default EditUser;
