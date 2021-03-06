import React, { useState } from "react";
import ShynnTable from "components/core/ShynnTable";
import { serialize } from "object-to-formdata";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import FormikField from "components/core/FormikField";
import FormikFileField from "components/core/FormikFileField";

import { object, string } from "yup";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "redux/snackbar/snackbar.actions";
import { createCategory } from "redux/core/core.actions";
import useModal from "hooks/useModal";
import EditCategory from "./EditCategory";

const useStyles = makeStyles((theme) => ({
  file: { fontSize: "30px" },
  imgPreview: {
    width: "100%",
    height: "250px",
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(2),
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  cateThumb: {
    width: "60px",
    height: "60px",
    borderRadius: theme.spacing(1),
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
}));

export const ListCategory = ({ categories }) => {
  const classes = useStyles();
  const [open, openModal, closeModal] = useCreateCategory();

  const { handleModal } = useModal();

  if (!categories) {
    return <h1>No categories founded!</h1>;
  }

  return (
    <React.Fragment>
      <Button color="primary" variant="outlined" onClick={() => openModal()}>
        New Category
      </Button>
      <Box mt={3}>
        <Card>
          <CardContent>
            <ShynnTable
              sorted
              filter
              data={categories.map((cate) => {
                return {
                  ...cate,
                  actions: (
                    <div>
                      <ButtonGroup>
                        <Button
                          color="primary"
                          onClick={() =>
                            handleModal(<EditCategory category={cate} />)
                          }
                        >
                          <i className="fad fa-edit" />
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => console.log("Delete: ", cate)}
                        >
                          <i className="fad fa-trash" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  ),
                };
              })}
              columns={[
                {
                  Header: "ID",
                  accessor: "_id",
                },
                {
                  Header: "Name",
                  accessor: "name",
                },
                {
                  Header: "Code",
                  accessor: "code",
                },
                {
                  Header: "Image",
                  Cell: (row) => {
                    // console.log(row.cell.row.original.imageUrl);
                    return (
                      <div
                        className={classes.cateThumb}
                        style={{
                          backgroundImage: `url(${row.cell.row.original.imageUrl})`,
                        }}
                      >
                        {/* <img height={34} src={row.cell.row.original.imageUrl} /> */}
                      </div>
                    );
                  },
                  id: "imageUrl",
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                },
              ]}
              className="-striped -highlight"
            />
          </CardContent>
        </Card>
      </Box>
      <CategoryForm open={open} handleClose={closeModal} />
    </React.Fragment>
  );
};

const useCreateCategory = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return [open, handleClickOpen, handleClose];
};

const CategoryForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const [previewSource, setPreviewSource] = useState("");
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const validationSchema = object({
    name: string().required("Name is required!"),
    image: string().required("Image is required!"),
  });

  return (
    <Formik
      initialValues={{ name: "", image: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const formData = serialize(values);
          dispatch(createCategory(formData));
          handleClose();
          resetForm();
          setPreviewSource("");
        } catch (err) {
          dispatch(
            enqueueSnackbar({
              message: err.response.data.message || "Create category error",
              status: "error",
            })
          );
        }
        setSubmitting(false);
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
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Create a new Category
              </DialogTitle>
              <DialogContent>
                <FormikField
                  margin="normal"
                  label="Category Name"
                  name="name"
                  error={errors.name}
                />
                <FormikFileField
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
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={() => submitForm()}
                  disabled={isSubmitting || !isValid || !dirty}
                  color="primary"
                >
                  Subscribe
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ListCategory;
