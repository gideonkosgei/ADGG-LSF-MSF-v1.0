import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton } from '@material-ui/core';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import LocalHospitalRoundedIcon from '@material-ui/icons/LocalHospitalRounded';
import SyncRoundedIcon from '@material-ui/icons/SyncRounded';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import PregnantWomanRoundedIcon from '@material-ui/icons/PregnantWomanRounded';
import ChildCareRoundedIcon from '@material-ui/icons/ChildCareRounded';
import LinkIcon from '@material-ui/icons/Link';
import PetsIcon from '@material-ui/icons/Pets';
import ColorizeIcon from '@material-ui/icons/Colorize';
import OpacityIcon from '@material-ui/icons/Opacity';

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
          <Tooltip  title="Animal Details">              
            <IconButton aria-label="details" size="large" >
              <PetsIcon /> 
            </IconButton> 
          </Tooltip> 
              
          <Tooltip  title="Milking">              
            <IconButton aria-label="milking" size="large" >
              <OpacityIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Health Events">              
            <IconButton aria-label="delete" size="large" >
              <LocalHospitalRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Pregnancy Diagnosis">              
            <IconButton aria-label="pd" size="large" >
              <PregnantWomanRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="calving">              
            <IconButton aria-label="calving" size="large" >
              <ChildCareRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Inseminations">              
            <IconButton aria-label="insemination" size="large" >
              <ColorizeIcon /> 
            </IconButton> 
          </Tooltip>
          
          <Tooltip  title="Synchronization Events">              
            <IconButton aria-label="delete" size="large" >
              <SyncRoundedIcon /> 
            </IconButton> 
          </Tooltip>              

          <Tooltip  title="Exits">              
            <IconButton aria-label="delete" size="large" >
              <ExitToAppRoundedIcon /> 
            </IconButton> 
          </Tooltip> 

          <Tooltip  title="Weights & Growth">              
            <IconButton aria-label="delete" size="large" >
              <SpeedRoundedIcon /> 
            </IconButton> 
          </Tooltip>
              
          <Tooltip  title="Calender Events">              
            <IconButton aria-label="delete" size="large" >
              <DateRangeRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Pedigree">              
            <IconButton aria-label="pedigree" size="large" >
              <LinkIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Notifications">              
            <IconButton aria-label="notifications" size="large" >
              <NotificationsActiveRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Logs">              
            <IconButton aria-label="logs" size="large" >
              <FormatListBulletedRoundedIcon /> 
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Analytics">              
            <IconButton aria-label="analytics" size="large" >
              <TrendingUpRoundedIcon /> 
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