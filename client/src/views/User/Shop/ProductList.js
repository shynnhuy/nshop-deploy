import React, { useState, useEffect, useCallback } from "react";
import { shopApi } from "api";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import useModal from "hooks/useModal";
import { Field, Form, Formik, useFormikContext } from "formik";
import FormikField from "components/core/FormikField";
import FormikFileField from "components/core/FormikFileField";
import { CheckboxWithLabel } from "formik-material-ui";
import { serialize } from "object-to-formdata";
import {
  DeleteForeverTwoTone,
  EditAttributesTwoTone,
} from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "redux/shop/shop.actions";

const ProductList = ({ category, shop }) => {
  const [products, setProducts] = useState([]);

  const getProducts = useCallback(async () => {
    try {
      const list = await shopApi.getShopProducts({ category, shop });
      // console.log(list.data);
      setProducts(list.data);
    } catch (error) {
      console.log(error.message);
    }
  }, [category, shop]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const { handleModal, onClose } = useModal();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() =>
            handleModal(
              <ProductForm
                category={category}
                shop={shop}
                products={products}
                setProducts={setProducts}
                onClose={onClose}
              />
            )
          }
        >
          add product
        </Button>
      </Grid>
      {products.length === 0 ? (
        <h1>Product list is empty</h1>
      ) : (
        products.map((product) => (
          <List style={{ width: "100%" }} key={product._id}>
            <ListItem>
              <ListItemIcon>
                <Avatar src={product.imageUrl}>P</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={product.name}
                secondary={
                  <>
                    <strike>{product.price.old}d</strike> -
                    <span>{product.price.new}d</span>
                    <br />
                    <span>{product.description}</span>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() =>
                    handleModal(
                      <ProductForm
                        category={category}
                        shop={shop}
                        onClose={onClose}
                        init={product}
                      />
                    )
                  }
                >
                  <EditAttributesTwoTone />
                </IconButton>
                <IconButton edge="end" aria-label="delete" disabled>
                  <DeleteForeverTwoTone />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        ))
      )}
    </Grid>
  );
};

const ProductForm = ({
  category,
  shop,
  onClose,
  init = {
    name: "",
    price: { old: 0, discount: 0 },
    description: "",
    imageUrl: "",
    shipping: false,
  },
  type,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [previewSource, setPreviewSource] = useState("");
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <Formik
      initialValues={{
        name: init.name,
        price: {
          old: init.price.old,
          discount: init.price.discount,
        },
        description: init.description,
        image: init.imageUrl,
        shipping: init.shipping,
      }}
      onSubmit={async (values) => {
        const newProduct = { ...values, category, shop };
        const formData = serialize(newProduct);
        // console.log(formData);
        try {
          let res = null;
          if (type === 0) {
            res = await dispatch(createProduct(formData));
          } else {
            res = await dispatch(updateProduct(init._id, formData));
          }
          if (res) {
            onClose();
          }
        } catch (error) {
          console.log(error.message);
        }
      }}
    >
      {(props) => (
        <Form className={classes.Form}>
          <Image name="image" previewSource={previewSource} />
          <FormikField name="name" label="Product name" />
          <FormikField name="price.old" label="Product price" type="number" />
          <FormikField
            name="price.discount"
            label="Product discount"
            type="number"
          />
          <FormikField
            name="description"
            label="Product description"
            multiline
            rows={4}
          />
          <Field
            type="checkbox"
            component={CheckboxWithLabel}
            name={"shipping"}
            Label={{ label: "Shipping" }}
          />
          <div className={classes.footer}>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={props.handleSubmit}
            >
              Update
            </Button>
          </div>
          <GrabFileFromURL product={init} previewFile={previewFile} />
        </Form>
      )}
    </Formik>
  );
};

const Image = ({ name, previewFile, previewSource }) => {
  const [hover, setHover] = useState(false);
  const classes = useStyles({ previewSource });
  return (
    <React.Fragment>
      <div
        className={classes.imageContainer}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div className={hover ? classes.ImageOver : classes.Image} />
        <FormikFileField
          name={name}
          label="Image"
          previewFile={previewFile}
          className={hover ? classes.ChangeImageShow : classes.ChangeImageHide}
        />
      </div>
    </React.Fragment>
  );
};

const GrabFileFromURL = ({ product, previewFile }) => {
  const { setFieldValue } = useFormikContext();

  React.useEffect(() => {
    async function toDataUrl(url, callback) {
      const res = await fetch(url);
      const blob = await res.blob();
      callback(blob);
    }
    toDataUrl(product.imageUrl, function (blob) {
      setFieldValue("image", new File([blob], `${Date.now}.jpg`));
      previewFile(blob);
    });
  }, [product, setFieldValue, previewFile]);
  return null;
};

export default ProductList;

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: "150px",
    height: "150px",
    position: "relative",
  },
  Form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  Image: {
    width: "100%",
    height: "100%",
    backgroundImage: (props) =>
      props.previewSource
        ? `url(${props.previewSource})`
        : "url(https://static.vecteezy.com/system/resources/thumbnails/000/223/249/original/ketogenic-diet-food-vector.jpg)",
    backgroundSize: "cover",
    borderRadius: "50%",
  },
  ImageOver: {
    width: "100%",
    height: "100%",
    backgroundImage: (props) =>
      props.previewSource
        ? `url(${props.previewSource})`
        : "url(https://static.vecteezy.com/system/resources/thumbnails/000/223/249/original/ketogenic-diet-food-vector.jpg)",
    backgroundSize: "cover",
    borderRadius: "50%",
    opacity: "0.7",
  },
  ChangeImageBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    display: "none",
  },
  ChangeImageShow: {
    position: "absolute",
    display: "block",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  ChangeImageHide: {
    position: "absolute",
    display: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
}));
