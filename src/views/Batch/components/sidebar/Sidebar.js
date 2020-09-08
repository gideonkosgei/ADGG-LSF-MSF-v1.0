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
            <Link component = {RouterLink} to={`/batch-process/milking-records/home`}>
              <HomeIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>      
        <Tooltip  title="Add New">              
          <IconButton aria-label="add" size="small" >
            <Link component = {RouterLink} to={`/batch-process/milking-records/add`}>
              <AddIcon /> 
            </Link>
          </IconButton> 
        </Tooltip> 

        <Tooltip  title="view Pending">              
          <IconButton aria-label="pending" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/milking-records/stage/2`}>
              <PlaylistPlayIcon /> 
            </Link>
          </IconButton> 
        </Tooltip>  

        <Tooltip  title="View Posted">              
          <IconButton aria-label="processed" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/milking-records/stage/3`}>
              <PlaylistAddCheckIcon /> 
            </Link>
          </IconButton> 
        </Tooltip> 

         <Tooltip  title="View Deleted">              
          <IconButton aria-label="deleted" size="small" >
            <Link component = {RouterLink} to = {`/batch-process/milking-records/stage/3`}>
              <DeleteIcon/> 
            </Link>
          </IconButton> 
        </Tooltip>        
                   
        <Tooltip  title="download template">              
          <IconButton aria-label="download" size="small" >
            <Link component = {RouterLink} to="#">
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