import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';

import { Page } from 'components';
import {default as Header} from '../../../../../Header/index';
import {default as DetailsEdit} from './DetailsEdit';

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

const Edit = props => { 
  const classes = useStyles();
  sessionStorage.setItem('injury_record_id', parseInt(props.match.params.id)); 
  return (
    <Page
      className={classes.root}
      title="injury"
    >
    <Card>
        <CardContent>
            <Header />
            <br/>
            <DetailsEdit/>
        </CardContent>
    </Card>
     
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
