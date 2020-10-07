import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';

import { Page } from 'components';
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
  localStorage.setItem('user_record_id', parseInt(props.match.params.id)); 
  localStorage.setItem('user_name_org', props.match.params.name);
  return (
    <Page
      className={classes.root}
      title="Organization"
    >
    <Card>
        <CardContent>            
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
