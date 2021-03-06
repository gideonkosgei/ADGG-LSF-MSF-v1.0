import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
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
            <Link component = {RouterLink} to={`/management/straws/view/1`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="view">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/management/straws/view/1`}>
              <ListIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>         
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/management/straws/add`}>
              <AddIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>  
        <Tooltip  title="Deleted/Archived">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/management/straws/view/0`}>
              <RestoreFromTrashIcon /> 
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