import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,CardContent, colors } from '@material-ui/core';
import { Page } from 'components';
import {default as AddDetails} from './AddDetails';



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

const Add = props => { 
  const classes = useStyles(); 

  if(typeof props.match.params.uuid != 'undefined'){
    localStorage.setItem("batch_upload_uuid", props.match.params.uuid);
  }


  return (
    <Page
      className={classes.root}
      title="Batch Processes"
    >
    <Card>
        <CardContent>
            <AddDetails/>
        </CardContent>
    </Card>
     
   </Page>
  );
};

Add.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Add;
