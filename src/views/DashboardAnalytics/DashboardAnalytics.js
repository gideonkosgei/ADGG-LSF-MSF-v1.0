import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid,Typography,Divider } from '@material-ui/core';
import { Page } from 'components';
import {
  AnimalCategorySegmentation,
  TopCows,
  BreedDistribution,
  HerdMilkingCowNumbers,
  HerdAnnualMilkProduction,
  DueDates,
  PdActionList ,
  ServiceActionList  
} from './components';
import {default as HealthManagementSummmaryTable} from '../Animals/components/Analytics/components/HealthManagementSummmaryTable';
import authContext from '../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {    
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
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
const [ {organization_id} ] = useContext(authContext);
  return (
    <Page
      className={classes.root}
      title="Analytics Dashboard"
    >   
     <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        HERD LEVEL DASHBOARDS
      </Typography> 
      <Divider />  
      <br/>  
      <Grid
        className={classes.container}
        container
        spacing={3}
      >    
        <Grid
          item
          lg={6}
          xl={4}
          xs={12}
        >
          <DueDates/>
        </Grid>
        <Grid
          item
          lg={6}
          xl={4}
          xs={12}
        >
          <PdActionList/>
        </Grid>

        <Grid item  xs={6} >  
          <HealthManagementSummmaryTable health_summary_option ={2}/>
        </Grid> 

        <Grid
          item
          lg={6}
          xl={4}
          xs={12}
        >
          <TopCows />
        </Grid>

        <Grid
          item
          lg={12}
          xl={12}
          xs={12}
        >
          <ServiceActionList />
        </Grid>

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
          lg={12}
          xl={12}
          xs={12}
        >
          <HerdAnnualMilkProduction />
        </Grid>
       
        <Grid
          item
          lg={5}
          xl={4}
          xs={12}
        >
          <AnimalCategorySegmentation org = {organization_id} level = {0} herd = {null} />
        </Grid>
        <Grid
          item
          lg={7}
          xl={4}
          xs={12}
        >
          <BreedDistribution org = {organization_id} level = {0} herd = {null}/>
        </Grid> 
        
        
      </Grid>
    </Page>
  );
};

export default DashboardAnalytics;
