import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';



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
            <Link component = {RouterLink} to={`/batch-process/sync/home`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>      
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/batch-process/sync/add`}>
              <AddIcon /> 
            </Link>
          </IconButton> 
        </Tooltip> 

        <Tooltip  title="view Pending">              
          <IconButton aria-label="pending" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/sync/stage/3`}>
              <PlaylistPlayIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>  

        <Tooltip  title="View Posted">              
          <IconButton aria-label="posted" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/sync/posted`}>
              <PlaylistAddCheckIcon /> 
            </Link>
          </IconButton> 
        </Tooltip> 

         <Tooltip  title="View Deleted">              
          <IconButton aria-label="deleted" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/sync/deleted`}>
              <DeleteIcon/> 
            </Link>
          </IconButton> 
        </Tooltip>        
                   
        <Tooltip  title="download template">              
          <IconButton aria-label="download" size="small" >
            <Link component = {RouterLink} to="/batch-process/weight/template">
              <CloudDownloadIcon /> 
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