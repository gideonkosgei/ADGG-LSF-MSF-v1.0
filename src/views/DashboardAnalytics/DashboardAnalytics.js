import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { Page } from 'components';
import {
  AnimalCategorySegmentation,
  TopCows,
  BreedDistribution,
  HerdMilkingCowNumbers,
  HerdAnnualMilkProduction
  /*MostProfitableProducts,
  CustomerActivity,
  LatestOrders*/
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
    
      <Grid
        className={classes.container}
        container
        spacing={3}
      >       
        <Grid
          item
          lg={12}
          xl={12}
          xs={12}
        >
          <HerdMilkingCowNumbers />
        </Grid>
        <Grid
          item
          lg={9}
          xl={12}
          xs={12}
        >
          <HerdAnnualMilkProduction />
        </Grid>      
        <Grid
          item
          lg={3}
          xl={4}
          xs={12}
        >
          <TopCows />
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
          lg={7}
          xl={4}
          xs={12}
        >
          <BreedDistribution/>
        </Grid>
        
       
        <Grid
          item
          lg={8}
          xs={12}
        >
          {/*<LatestOrders />*/}
        </Grid>
        <Grid
          item
          lg={4}
          xs={12}
        >
         {/* <CustomerActivity />*/}
        </Grid>
        <Grid
          item
          lg={8}
          xs={12}
        >
         {/* <MostProfitableProducts />*/}
        </Grid>
       
      </Grid>
    </Page>
  );
};

export default DashboardAnalytics;
