/* eslint-disable react/no-multi-comp */
import React, {useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import {
  Grid,  
  Divider, 
  Typography
} from '@material-ui/core';

import { 
  DueDates,
  PdActionList ,
  ServiceActionList  
} from '../../../DashboardAnalytics/components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  addIcon: {
    marginRight: theme.spacing(1)
  },
  done: {
    textDecoration: 'line-through',
    color: theme.palette.text.secondary
  }
}));

const Todos = props => { 
  const classes = useStyles();

  useEffect(() => {  
  }, []);

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
      TODAY'S TODO LIST
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
        <DueDates option = {1}/>
      </Grid>
      <Grid
        item
        lg={6}
        xl={4}
        xs={12}
      >
        <PdActionList option = {1}/>
      </Grid>
      <Grid
        item
        lg={12}
        xl={12}
        xs={12}
      >
        <ServiceActionList option = {1} />
      </Grid>      
    </Grid>
  </Page>


    
  );
};

Todos.propTypes = {
  className: PropTypes.string
};

export default Todos;
