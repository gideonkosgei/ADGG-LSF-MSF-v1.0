import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';

import { Page } from 'components';
import {Header} from '../index';
import {default as ChartDetails} from './components/ChartDetails';

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

const Chart = props => { 
  const classes = useStyles();
 
  return (
    <Page
      className={classes.root}
      title="Weight Trends"
    >
    <Card>
        <CardContent>
            <Header />
            <br/>
            <ChartDetails/>
        </CardContent>
    </Card>     
   </Page>
  );
};

Chart.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Chart;
