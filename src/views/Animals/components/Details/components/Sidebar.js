import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GetAppIcon from '@material-ui/icons/GetApp'
import EditIcon from '@material-ui/icons/Edit';
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
            <Link component = {RouterLink} to={`/management/details/view/${animal_id}`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="view">              
          <IconButton aria-label="view" size="small" >
            <Link component = {RouterLink} to = {`/management/details/view/${animal_id}`}>
              <VisibilityIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="Edit">              
          <IconButton aria-label="Edit" size="small" >
            <Link component = {RouterLink} to={`/management/details/edit/${animal_id}`}>
              <EditIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to="/management/milking/">
              <AddIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="print">              
          <IconButton aria-label="print" size="small" >
            <Link component = {RouterLink} to="/management/milking/">
              <PrintIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="Delete">              
          <IconButton aria-label="Delete" size="small" >
            <Link component = {RouterLink} to="/management/milking/">
              <DeleteIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>
        <Tooltip  title="download">              
          <IconButton aria-label="download" size="small" >
            <Link component = {RouterLink} to="/management/milking/">
              <GetAppIcon /> 
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