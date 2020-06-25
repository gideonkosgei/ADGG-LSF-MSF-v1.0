import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { FarmInfo, Location, Household} from './components';


const useStyles = makeStyles(() => ({
  root: {}
}));

const Summary = props => {
  const {farmDetails,className, ...rest } = props;
  const classes = useStyles();
  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <FarmInfo farmDetails = {farmDetails} />
      </Grid>
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
         <Location farmDetails = {farmDetails} />
      </Grid>
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >        
        <Household farmDetails = {farmDetails} />        
      </Grid>
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >        
      </Grid>
    </Grid>
  );
};

Summary.propTypes = {
  className: PropTypes.string,
  farmDetails: PropTypes.object.isRequired
};

export default Summary;
