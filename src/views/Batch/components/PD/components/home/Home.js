import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';

import { Page } from 'components';
import {default as HomeDetails} from './HomeDetails';

const useStyles = makeStyles(theme => ({
  root: {},
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

const Home = props => { 
  const classes = useStyles();
  localStorage.setItem('paramater_limit_id', parseInt(props.match.params.id));
 
  return (
    <Page
      className={classes.root}
      title="Batch Processes"
    >
    <Card>
        <CardContent>            
            <HomeDetails/>
        </CardContent>
    </Card>     
   </Page>
  );
};

Home.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Home;
