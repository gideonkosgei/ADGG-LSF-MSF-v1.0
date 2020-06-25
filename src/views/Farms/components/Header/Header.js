import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { farmDetails,className, ...rest } = props;
  const classes = useStyles(); 
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >     
      <Typography
        component="h1"
        variant="h3"
      >
        {farmDetails.farm_name} #{farmDetails.farm_id}
      </Typography>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  farmDetails: PropTypes.object.isRequired
};
export default Header;
