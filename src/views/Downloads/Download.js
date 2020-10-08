import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';

import { Page } from 'components';
import {default as DownloadDetails} from './DownloadDetails';

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

const Download = props => { 
  const classes = useStyles();
 
  return (
    <Page
      className={classes.root}
      title="Profile"
    >
    <Card>
        <CardContent>            
            <DownloadDetails/>
        </CardContent>
    </Card>
     
   </Page>
  );
};

Download.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Download;