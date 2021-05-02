import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles(theme => ({
  root: {}, 
}));
const Header = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();
  
  return (    
    <Card
      {...rest}
      className={clsx(classes.root, className)}    >       
        <CardContent>

          <Tooltip  title="Home">   
          <IconButton aria-label="home" size="small" >
            <Link component = {RouterLink} to={`/management/herds`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
          </Tooltip>  

          <Tooltip  title="view">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/management/herds`}>
              <ListIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>         
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/management/herds/add`}>
              <AddIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>  
          

        </CardContent> 
    </Card>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;