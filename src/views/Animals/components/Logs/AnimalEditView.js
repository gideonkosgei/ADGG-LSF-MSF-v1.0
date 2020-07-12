import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardActions, CardContent, CardHeader, colors } from '@material-ui/core';

import { Page } from 'components';
import { EditView, Header} from './components';
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

const AnimalEditView = props => { 
  const classes = useStyles();
 
  return (
    <Page
      className={classes.root}
      title="Profile"
    >
    <Card>
        <CardContent>
            <Header />
            <br/>
            <EditView/>
        </CardContent>
    </Card>
     
   </Page>
  );
};

AnimalEditView.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default AnimalEditView;
