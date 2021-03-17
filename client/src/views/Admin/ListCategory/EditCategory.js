import React, { useState } from "react";
import { Button, Input, makeStyles } from "@material-ui/core";
import FormikField from "components/core/FormikField";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useDispatch } from "react-redux";
import { serialize } from "object-to-formdata";
import useModal from "hooks/useModal";
import { updateCategory } from "redux/core/core.actions";

const useStyles = makeStyles((theme) => ({
  imgPreview: {
    width: "100%",
    height: "250px",
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(2),
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(3),
  },
}));

const EditCategory = ({ category }) => {
  const dispatch = useDispatch();
  const { onClose: handleClose } = useModal();

  const classes = useStyles();

  const [previewSource, setPreviewSource] = useState("");

  const previewFile = (file) => {
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  if (!category._id) {
    return <h3>Loading...</h3>;
  }
  return (
    <Formik
      initialValues={{ name: category.name, image: category.imageUrl }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        const formData = serialize(values);
        // console.log(values)
        try {
          dispatch(updateCategory(category._id, formData));
          resetForm();
          setPreviewSource("");

          setSubmitting(false);
          handleClose();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ isSubmitting, dirty, isValid, errors, submitForm, resetForm }) => {
        const onClose = () => {
          handleClose();
          resetForm();
          setPreviewSource("");
        };
        return (
          <Form className={classes.form} encType="multipart/form-data">
            <FormikField
              margin="normal"
              label="Category Name"
              name="name"
              error={errors.name}
            />
            <FileInput
              name="image"
              label="Category Image"
              previewFile={previewFile}
            />
            {previewSource && (
              <div
                className={classes.imgPreview}
                style={{ backgroundImage: `url(${previewSource})` }}
              />
            )}
            <div className={classes.actions}>
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => submitForm()}
                disabled={isSubmitting || !isValid || !dirty}
                variant="contained"
                color="primary"
              >
                Update {category.name}
              </Button>
            </div>
            <GrabFileFromURL category={category} previewFile={previewFile} />
          </Form>
        );
      }}
    </Formik>
  );
};

const GrabFileFromURL = ({ category, previewFile }) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    async function toDataUrl(url, callback) {
      const res = await fetch(url);
      const blob = await res.blob();
      callback(blob);
    }
    toDataUrl(category.imageUrl, function (blob) {
      setFieldValue("image", new File([blob], `${Date.now}.jpg`));
      previewFile(blob);
    });
  }, [category, setFieldValue, previewFile]);
  return null;
};

const FileInput = ({ name, label, previewFile, className }) => {
  const fileRef = React.useRef(null);
  const handleClick = (e) => {
    fileRef.current.click();
  };
  return (
    <Field name={name}>
      {({ form }) => {
        const handleFileChange = (e) => {
          e.preventDefault();
          const file = e.target.files[0];
          form.setFieldValue("image", file);
          previewFile(file);
        };
        return (
          <React.Fragment>
            <Button
              variant="outlined"
              onClick={handleClick}
              className={className}
            >
              Choose {label}
            </Button>
            <Input
              type="file"
              onChange={handleFileChange}
              inputRef={fileRef}
              style={{ display: "none" }}
            />
          </React.Fragment>
        );
      }}
    </Field>
  );
};

export default EditCategory;
