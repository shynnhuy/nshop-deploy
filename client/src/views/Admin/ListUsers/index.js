import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import ShynnTable from "components/core/ShynnTable";
import { connect } from "react-redux";
import useModal from "hooks/useModal";
import EditUser from "./EditUser";
import { updateUser, deleteUser } from "redux/core/core.actions";

export const ListUsers = ({ users, updateUser, deleteUser }) => {
  const [open, setOpen] = useState(false);
  const [selectUser, setSelectUser] = useState({});

  const handleOpenDelete = (user) => {
    setSelectUser(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "_id",
      },
      {
        Header: "Display Name",
        accessor: "displayName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      { Header: "Actions", accessor: "actions" },
    ],
    []
  );
  const { handleModal } = useModal();

  if (users.length < 1) {
    return <h1>No user in database!</h1>;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <ShynnTable
              sorted
              filter
              data={users.map((user) => {
                return {
                  ...user,
                  actions: (
                    <div>
                      <ButtonGroup>
                        <Button
                          color="primary"
                          onClick={() =>
                            handleModal(
                              <EditUser user={user} updateUser={updateUser} />
                            )
                          }
                        >
                          <i className="fad fa-edit" />
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => handleOpenDelete(user)}
                        >
                          <i className="fad fa-trash" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  ),
                };
              })}
              columns={columns}
              className="-striped -highlight"
            />
          </CardContent>
        </Card>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmDelete"
        aria-describedby="confirmDeleteDescription"
      >
        <DialogTitle id="confirmDelete">
          {"Are you sure you want to permanently delete this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmDeleteDescription">
            User {selectUser?.displayName} will be permanently delete. Your
            action won't be undo!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteUser(selectUser._id);
              handleClose();
            }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const mapDispatch = {
  updateUser,
  deleteUser,
};

export default connect(null, mapDispatch)(ListUsers);
