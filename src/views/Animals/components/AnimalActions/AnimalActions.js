import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button, Card,CardActions, CardContent,Tooltip, Grid,Divider, TextField,colors,IconButton } from '@material-ui/core';
import {getLookups,getHerds}   from '../../../../utils/API';
import {endpoint_lookup,endpoint_herd} from '../../../../configs/endpoints';
import authContext from '../../../../contexts/AuthContext';
import InputAdornment from '@material-ui/core/InputAdornment';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SearchIcon from '@material-ui/icons/Search';
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
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  } 
}));



const AnimalActions = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();
  const [ { organization_id }  ] = useContext(authContext);
  
  const [values, setValues] = useState({ });  
  const [animal_types, setAnimalTypes] = useState([]);
  const [main_breeds, setMainBreeds] = useState([]);
  const [breed_composition, setBreedComposition] = useState([]);
  const [gender, setGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [sire_types, setSireTypes] = useState([]);
  const [herds, setHerds] = useState([]);

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_herds = true;

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            let lookup_main_breeds = [];
            let lookup_breed_composition = [];  
            let lookup_animal_types = []; 
            let lookup_gender = []; 
            let lookup_colors = [];
            let lookup_sire_types = [];             
            for (let i = 0; i< data.length; i++){              
              //main breeds
              if(data[i].list_type_id === 8){                
                lookup_main_breeds.push(data[i]);
              }
              //breed Composition
              if(data[i].list_type_id === 14){                
                lookup_breed_composition.push(data[i]);
              }  
              //animal Types
              if(data[i].list_type_id === 62){                
                lookup_animal_types.push(data[i]);
              }
              //Gender
              if(data[i].list_type_id === 3){                
                lookup_gender.push(data[i]);
              }
              //Colors
              if(data[i].list_type_id === 83){                
                lookup_colors.push(data[i]);
              }  
              //Sire Types
              if(data[i].list_type_id === 13){                
                lookup_sire_types.push(data[i]);
              }            
              
            }  
            setAnimalTypes(lookup_animal_types);
            setMainBreeds(lookup_main_breeds);
            setBreedComposition(lookup_breed_composition);
            setGender(lookup_gender);
            setColors(lookup_colors);
            setSireTypes(lookup_sire_types);
            
            
          }
        });
      })(endpoint_lookup,'8,14,62,3,83,13');

      (async  (endpoint,id) => {     
        await  getHerds(endpoint,id)
        .then(response => {       
          if (mounted_herds) { 
            const data = response.payload;
            setHerds(data);
            console.log(data);      
          }
        });
      })(endpoint_herd,organization_id);
      
      
    return () => {
      mounted_lookup = false;
      mounted_herds  = false
    };
  }, [organization_id]); 

  if (!animal_types || !main_breeds || !breed_composition || !gender || !colors || !sire_types) {
    return null;
  }


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };


  const handleSubmit = event => {
    event.preventDefault();
    //setOpenSnackbar(true);
  };





  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}    >
      <form onSubmit={handleSubmit}>        
        <CardContent>
        
            <Card>           
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
          <br/>

          <Card>           
            <CardContent>
          <Grid
            container
            spacing={4}
          >
       
          </Grid>
          </CardContent>  
            <Divider />
          
          </Card>
        </CardContent>        
      </form>    
    </Card>
  );
};

AnimalActions.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default AnimalActions;