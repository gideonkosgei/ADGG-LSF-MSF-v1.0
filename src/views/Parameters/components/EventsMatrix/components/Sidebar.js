import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles(theme => ({
  root: {}, 
}));
const Sidebar = props => {
  const {className, ...rest } = props;  
  const classes = useStyles();
  return (  
    <Card {...rest} className={clsx(classes.root, className)}  >
      <CardContent>                 
      <Tooltip  title="Home">              
          <IconButton aria-label="home" size="small" >
            <Link component = {RouterLink} to={`/settings/parameters/events-matrix`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="view">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/settings/parameters/events-matrix`}>
              <VisibilityIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>   
        <Tooltip  title="print">              
          <IconButton aria-label="print" size="small" >
            <Link component = {RouterLink} to="#">
              <PrintIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
      </CardContent> 
    </Card>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};
export default Sidebar;