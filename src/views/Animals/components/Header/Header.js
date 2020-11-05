import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,IconButton,Link } from '@material-ui/core';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import LocalHospitalRoundedIcon from '@material-ui/icons/LocalHospitalRounded';
import SyncRoundedIcon from '@material-ui/icons/SyncRounded';
import PregnantWomanRoundedIcon from '@material-ui/icons/PregnantWomanRounded';
import ChildCareRoundedIcon from '@material-ui/icons/ChildCareRounded';
import PetsIcon from '@material-ui/icons/Pets';
import ColorizeIcon from '@material-ui/icons/Colorize';
import OpacityIcon from '@material-ui/icons/Opacity';
import { Link as RouterLink } from 'react-router-dom';
import {getEventSetup}   from '../../../../utils/API';
import {endpoint_event_setup} from '../../../../configs/endpoints';

const useStyles = makeStyles(theme => ({
  root: {}, 
}));
const Header = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();
  const animal_id  = localStorage.getItem('animal_id');
  const [values, setValues] = useState({ });

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id) => {     
        await  getEventSetup(endpoint,id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload[0][0];            
            setValues(data);                 
          }
        });
      })(endpoint_event_setup,animal_id);      
      
    return () => {
      mounted = false;      
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }
  return (    
    <Card
      {...rest}
      className={clsx(classes.root, className)}    >       
        <CardContent> 
        {values.bio_data ?
          <Tooltip  title="Animal Details">              
            <IconButton aria-label="details" size="large" >
              <Link component = {RouterLink} to = {`/management/details/edit/${animal_id}`}>
                <PetsIcon /> 
              </Link> 
            </IconButton> 
          </Tooltip>
          : null 
        }

        {values.milking ?              
          <Tooltip  title="Milking">              
            <IconButton aria-label="milking" size="large" >
              <Link component = {RouterLink} to = {`/management/milking/view/${animal_id}`}>
                <OpacityIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          : null 
        }
         
        {values.health ?  
          <Tooltip  title="Health Events">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to="/management/health/">
                <LocalHospitalRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          : null 
        }

        {values.pd ?   
          <Tooltip  title="Pregnancy Diagnosis">              
            <IconButton aria-label="pd" size="large" >
              <Link component = {RouterLink} to = {`/management/pd/view/${animal_id}`}>              
                <PregnantWomanRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
           : null 
        }

        {values.calving ?
          <Tooltip  title="calving">              
            <IconButton aria-label="calving" size="large" >
              <Link component = {RouterLink} to = {`/management/calving/view/${animal_id}`}> 
                <ChildCareRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          : null 
        }

        {values.insemination ?
          <Tooltip  title="Inseminations">              
            <IconButton aria-label="insemination" size="large" >
              <Link component = {RouterLink} to = {`/management/insemination/view/${animal_id}`}>
               <ColorizeIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          : null 
        }

        {values.sync ?          
          <Tooltip  title="Synchronization Events">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to = {`/management/sync/view/${animal_id}`}>
               <SyncRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip> 
          : null 
        }             
        {values.exit ?
          <Tooltip  title="Exits">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to= {`/management/exit/add/${animal_id}`}>
                <ExitToAppRoundedIcon /> 
              </Link>              
            </IconButton> 
          </Tooltip> 
          : null 
        } 
        {values.weight ?
          <Tooltip  title="Weights & Growth">              
            <IconButton aria-label="delete" size="large" >
              <Link component = {RouterLink} to = {`/management/weight/view/${animal_id}`}>
                <SpeedRoundedIcon /> 
              </Link>
            </IconButton> 
          </Tooltip>
          : null 
         } 
         {     /*
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
         */}         
        </CardContent> 
    </Card>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;