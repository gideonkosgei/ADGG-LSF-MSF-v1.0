import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Tooltip,Link,Button } from '@material-ui/core';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import LocalHospitalRoundedIcon from '@material-ui/icons/LocalHospitalRounded';
import SyncRoundedIcon from '@material-ui/icons/SyncRounded';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import ChildCareRoundedIcon from '@material-ui/icons/ChildCareRounded';
import ColorizeIcon from '@material-ui/icons/Colorize';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { Link as RouterLink } from 'react-router-dom';
import {getEventSetup}   from '../../../../utils/API';
import {endpoint_event_setup} from '../../../../configs/endpoints';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUp';

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
              <Button
                color="default"
                className={classes.button}
                startIcon={<PermIdentityIcon />}
              >
                <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/details/edit/${animal_id}`}>
                  Bio
                </Link>
              </Button>
            </Tooltip>   
          : null 
        }

        {values.milking ? 
          <Tooltip  title="Milking">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<LocalDrinkIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/milking/view/${animal_id}`}>
              Milking
            </Link>
          </Button>
        </Tooltip> 
          : null 
        }
         
        {values.health ?  

          <Tooltip  title="Health Events">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<LocalHospitalRoundedIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/health`}>
              Health
            </Link>
          </Button>
          </Tooltip>           
          : null 
        }

        {values.pd ?   

        <Tooltip  title="Pregnancy Diagnosis">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<SportsBaseballIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/pd/view/${animal_id}`}>
              PD
            </Link>
          </Button>
        </Tooltip> 

         
          
           : null 
        }

        <Tooltip  title="Calving">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<ChildCareRoundedIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/calving/view/${animal_id}`}>
              Calving
            </Link>
          </Button>
        </Tooltip> 

        

        {values.insemination ?
        <Tooltip  title="Inseminations">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<ColorizeIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/insemination/view/${animal_id}`}>
              Insemination
            </Link>
          </Button>
        </Tooltip>          
          : null 
        }

        {values.sync ?
        <Tooltip  title="Synchronization">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<SyncRoundedIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/sync/view/${animal_id}`}>
              Sync
            </Link>
          </Button>
        </Tooltip>

          
          : null 
        }             
        {values.exit ?

        <Tooltip  title="Exit & Disposal">   
          <Button
            color="default"
            className={classes.button}
            startIcon={<ExitToAppRoundedIcon />}
          >
            <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/exit/view/${animal_id}`}>
              Exit
            </Link>
          </Button>
        </Tooltip>
          
          : null 
        } 
        {values.weight ?

          <Tooltip  title="Weights & Growth">   
            <Button
              color="default"
              className={classes.button}
              startIcon={<SpeedRoundedIcon />}
            >
              <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/weight/view/${animal_id}`}>
                Weight
              </Link>
            </Button>
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
          */

         <Tooltip  title="Trends">   
         <Button
           color="default"
           className={classes.button}
           startIcon={<TrendingUpRoundedIcon />}
         >
           <Link style={{ textDecoration: 'none',textTransform: 'none' }} component = {RouterLink} to = {`/management/analytics/${animal_id}`}>
           Trends
           </Link>
         </Button>
       </Tooltip>
         
          
         }         
        </CardContent> 
    </Card>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;