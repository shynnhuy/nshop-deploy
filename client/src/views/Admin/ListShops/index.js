import React from "react";

import Block from "@material-ui/icons/Block";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

import ShynnTable from "components/core/ShynnTable";
import { Card, CardContent, Grid, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { changeShopStatus } from "redux/core/core.actions";
import { useSocket } from "context/SocketContext";

export const ListShops = ({ shops }) => {
  const dispatch = useDispatch();

  const socket = useSocket();

  // console.log(socket);

  if (shops.length < 1) {
    return <h1>No shop or request available.</h1>;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <ShynnTable
              columns={[
                { Header: "Shop Name", accessor: "name" },
                { Header: "Requester", accessor: "owner.displayName" },
                { Header: "Identity Card", accessor: "identityCard" },
                { Header: "Address", accessor: "address" },
                { Header: "Status", accessor: "status" },
                { Header: "Actions", accessor: "actions" },
              ]}
              data={shops?.map((item, key) => {
                return {
                  ...item,
                  actions: (
                    <div className="actions-right">
                      <IconButton
                        onClick={() => {
                          dispatch(changeShopStatus(item._id, "approval"));
                          socket.emit("change_request_status", item._id);
                        }}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          dispatch(changeShopStatus(item._id, "denied"));
                          socket.emit("change_request_status", item._id);
                        }}
                      >
                        <Block />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          var data = shops;
                          data.find((o, i) => {
                            if (o.id === key) {
                              data.splice(i, 1);
                              console.log(data);
                              return true;
                            }
                            return false;
                          });
                          // setRequests(data);
                        }}
                      >
                        <Close />
                      </IconButton>
                    </div>
                  ),
                };
              })}
              sorted
              filter
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListShops;
