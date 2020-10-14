import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { Page } from 'components';
import {
  Header,
  Overview,
  AnnualMilkPerformance,
  AnimalCategorySegmentation,
  TopCows,
  MostProfitableProducts,
  CustomerActivity,
  LatestOrders
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  container: {
    '& > *': {
      height: '100%'
    }
  }
}));

const DashboardAnalytics = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Analytics Dashboard"
    >
      <Header />
      <Grid
        className={classes.container}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Overview />
        </Grid>
        <Grid
          item
          lg={12}
          xl={12}
          xs={12}
        >
          <AnnualMilkPerformance />
        </Grid>
        <Grid
          item
          lg={5}
          xl={4}
          xs={12}
        >
          <AnimalCategorySegmentation />
        </Grid>
        <Grid
          item
          lg={8}
          xs={12}
        >
          <LatestOrders />
        </Grid>
        <Grid
          item
          lg={4}
          xs={12}
        >
          <CustomerActivity />
        </Grid>
        <Grid
          item
          lg={8}
          xs={12}
        >
          <MostProfitableProducts />
        </Grid>
        <Grid
          item
          lg={4}
          xs={12}
        >
          <TopCows />
        </Grid>
      </Grid>
    </Page>
  );
};

export default DashboardAnalytics;
