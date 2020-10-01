import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';
import { Page } from 'components';
import {default as DetailsView} from './DetailsView';



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
  /*
    determined is active or archived/deleted records will be displayed
    0 : deleted/archived
    1 : active
  */
  localStorage.setItem('straw_records_view_status', parseInt(props.match.params.status));
 
  return (
    <Page
      className={classes.root}
      title="AI Straws"
    >
    <Card>
        <CardContent>
            <DetailsView/>
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
