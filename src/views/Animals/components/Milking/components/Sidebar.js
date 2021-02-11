import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles(theme => ({
  root: {}, 
}));
const Sidebar = props => {
  const {className, ...rest } = props; 
  const animal_id  = localStorage.getItem('animal_id');
  const classes = useStyles();
  return (  
    <Card {...rest} className={clsx(classes.root, className)}  >
      <CardContent>                 
      <Tooltip  title="Home">              
          <IconButton aria-label="home" size="small" >
            <Link component = {RouterLink} to={`/management/milking/view/${animal_id}`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="View List">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/management/milking/view/${animal_id}`}>
              <ListIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>         
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/management/milking/add/${animal_id}`}>
              <AddIcon /> 
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