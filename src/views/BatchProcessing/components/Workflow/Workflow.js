import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Notes,Controls } from './components';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto'
  } 
}));

const Workflow = (props) => {
  const { batchInfo } = props;
  const classes = useStyles();  

  return (
    <Page
      className={classes.root}
      title="Batch Report"
    >
      <Notes/>
      <Controls batchInfo = {batchInfo}/>
    </Page>
  );
};

Workflow.propTypes = { 
  batchInfo: PropTypes.object.isRequired
};

export default Workflow;
