import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import ListIcon from '@material-ui/icons/List';

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
            <Link component = {RouterLink} to={`/management/graduation/view/0`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="View List">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/management/graduation/view/0`}>
              <ListIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="Processed / Finalized">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/management/graduation/view/1`}>
              <PlaylistAddCheckIcon /> 
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