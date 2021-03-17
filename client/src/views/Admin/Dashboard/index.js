import React from "react";
import { Grid } from "@material-ui/core";
import AdminCard from "components/Manager/Card";
import { Users, ShoppingBag, Archive } from "react-feather";

export function Dashboard({ users, shops, categories, products }) {
  return (
    <Grid container spacing={4}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <AdminCard
          title="Total Users"
          primary={users?.length || 0}
          icon={Users}
          color="red"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <AdminCard
          title="Total Shops"
          primary={shops?.length || 0}
          icon={ShoppingBag}
          color="green"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <AdminCard
          title="Total Categories"
          primary={categories?.length}
          icon={Archive}
          color="yellow"
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <AdminCard
          title="Total Products"
          primary={products?.length}
          color="blue"
        />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
