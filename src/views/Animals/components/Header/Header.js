import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
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
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {}, 
}));
const Header = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();
  const animal_id  = localStorage.getItem('animal_id');
  return (    
    <Card
      {...rest}
      className={clsx(classes.root, className)}    >       
        <CardContent> 
          <Tooltip  title="Animal Details">              
            <IconButton aria-label="details" size="large" >
              <Link component = {RouterLink} to = {`/management/details/view/${animal_id}`}>
                <PetsIcon /> 
              </Link> 
            </IconButton> 
          </Tooltip>
              
          <Tooltip  title="Milking">              
            <IconButton aria-label="milking" size="large" >
              <Link component = {RouterLink} to="/management/milking/">
                <OpacityIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Health Events">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to="/management/health/">
                <LocalHospitalRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Pregnancy Diagnosis">              
            <IconButton aria-label="pd" size="large" >
              <Link component = {RouterLink} to = {`/management/pd/view/${animal_id}`}>              
                <PregnantWomanRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="calving">              
            <IconButton aria-label="calving" size="large" >
              <Link component = {RouterLink} to="/management/calving/">
                <ChildCareRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Inseminations">              
            <IconButton aria-label="insemination" size="large" >
              <Link component = {RouterLink} to="/management/insemination/">
               <ColorizeIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          
          <Tooltip  title="Synchronization Events">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to = {`/management/sync/view/${animal_id}`}>
               <SyncRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>              

          <Tooltip  title="Exits">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to="/management/exits/">
                <ExitToAppRoundedIcon /> 
              </Link>              
            </IconButton> 
          </Tooltip> 

          <Tooltip  title="Weights & Growth">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to = {`/management/weight/view/${animal_id}`}>
                <SpeedRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
              
          <Tooltip  title="Calender Events">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to="/management/calender/">
                <DateRangeRoundedIcon /> 
              </Link>
              
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Pedigree">              
            <IconButton aria-label="pedigree" size="large" >
              <Link component = {RouterLink} to="/management/pedigree/">
                <LinkIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Notifications">              
            <IconButton aria-label="notifications" size="large" >
              <Link component = {RouterLink} to="/management/notifications/">
                <NotificationsActiveRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Logs">              
            <IconButton aria-label="logs" size="large" >
              <Link component = {RouterLink} to="/management/logs/">
                <FormatListBulletedRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>

          <Tooltip  title="Analytics">              
            <IconButton aria-label="analytics" size="large" >
              <Link component = {RouterLink} to="/management/analytics/">
                <TrendingUpRoundedIcon /> 
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