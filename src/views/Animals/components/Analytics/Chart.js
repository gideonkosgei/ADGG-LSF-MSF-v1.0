import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {colors,Typography,Divider } from '@material-ui/core';

import { Page } from 'components';
import {Header} from './index';
import {default as ChartDetails} from './components/ChartDetails';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Chart = () => { 
  const classes = useStyles();
  const animal_tag  = sessionStorage.getItem('animal_tag');
 
  return (
    <Page
      className={classes.root}
      title="Animal Trends"
    >
       <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
          {`ANIMAL LEVEL DASHBOARD: ${animal_tag} `}

      </Typography> 
      <Divider />  
      <br/>  
      <Header/>           
        <br/>
      <ChartDetails/>
    </Page>
  );
};

Chart.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Chart;
