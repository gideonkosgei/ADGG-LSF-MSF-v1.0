import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button, Card,CardActions, CardContent, CardHeader, Grid,Divider, TextField,colors,IconButton } from '@material-ui/core';
import {getLookups,getHerds}   from '../../../../../utils/API';
import {endpoint_lookup,endpoint_herd} from '../../../../../configs/endpoints';
import authContext from '../../../../../contexts/AuthContext';
import InputAdornment from '@material-ui/core/InputAdornment';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SearchIcon from '@material-ui/icons/Search';

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

const AnimalDetails = props => {
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
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Calving" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={4}
          >
        <Grid
          item
          md={3}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            margin = 'dense'
            label="Animal Type"
            name="animal_type"
            onChange={handleChange}
            default = "" 
            required              
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}
            //value={values.timezone}
            variant="outlined"
          >
            <option value=""></option>
            {animal_types.map(types => (
                  <option                    
                    value={types.id}
                  >
                    {types.value}
                  </option>
                ))
            }           
          </TextField>
        </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}    
                margin = 'dense'           
                label="Tag ID "
                name="tag_id"
                onChange={handleChange}
                required
                //value={values.name}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"  >
                      <IconButton  
                        edge="end"
                        variant="outlined"
                        color="inherit"
                      >
                           <SettingsApplicationsIcon /> 
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Animal Name"
                name="username"
                onChange={handleChange}
                variant="outlined"              
              />
            </Grid>

          <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Herd"
                name="Herd"
                onChange={handleChange} 
                required              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              >
                 <option value=""></option>
                {herds.map( herd => (
                    <option                      
                      value={herd.id}
                    >
                      {herd.name}
                    </option>
                  ))
                }    
              
              
              </TextField>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="DOB"
                type="date"
                name="dob"
                defaultValue = {new Date()}
                onChange={handleChange}
                variant="outlined" 
                             
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Sex"
                name="sex"
                onChange={handleChange} 
                required              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              >
                <option value=""></option>
                {gender.map( sex => (
                    <option                      
                      value={sex.id}
                    >
                      {sex.value}
                    </option>
                  ))
                }    
              
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Color"
                name="color"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              > 
                <option value=""></option>  
                {colors.map( color => (
                    <option                      
                      value={color.id}
                    >
                      {color.value}
                    </option>
                  ))
                }               
              </TextField>
            </Grid>


            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Main Breed"
                name="main_breed"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              > 
                <option value=""></option> 
                {main_breeds.map( main_breed => (
                    <option                    
                      value={main_breed.id}
                    >
                      {main_breed.value}
                    </option>
                  ))
                }              
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Breed Other"
                name="breed_other"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              > 
                <option value=""></option>    
                {main_breeds.map( main_breed => (
                      <option                        
                        value={main_breed.id}
                      >
                        {main_breed.value}
                      </option>
                    ))
                  }            
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Breed Composition"
                name="breed_composition"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              > 
                <option value=""></option>  
                {breed_composition.map( breed_comp => (
                      <option                        
                        value={breed_comp.id}
                      >
                        {breed_comp.value}
                      </option>
                    ))
                }
              </TextField>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Breed Composition Details"
                name="breed_composition_details"
                multiline
                rowsMax={4}                
                onChange={handleChange}
                variant="outlined"              
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Sire Type"
                name="sire_type"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                //value={values.timezone}
                variant="outlined"
              > 
                <option value=""></option> 
                {sire_types.map(sire_type => (
                    <option                      
                      value={sire_type.id}
                    >
                      {sire_type.value}
                    </option>
                  ))
                }               
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Sire"
                name="sire_tag_id"
                onChange={handleChange}
                variant="outlined" 
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"  >
                      <IconButton  
                        edge="end"
                        variant="outlined"
                        color="inherit"
                      >
                           <SearchIcon /> 
                      </IconButton>
                    </InputAdornment>
                  ),
                }}             
              />
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Dam"
                name="dam_tag_id"                
                onChange={handleChange}
                variant="outlined"  
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"  >
                      <IconButton  
                        edge="end"
                        variant="outlined"
                        color="inherit"
                      >
                           <SearchIcon/> 
                      </IconButton>
                    </InputAdornment>
                  ),
                }}            
              />
            </Grid>

        
            
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.saveButton}
            type="submit"
            variant="contained"
          >
            Save Details
          </Button>
        </CardActions>
      </form>    
    </Card>
  );
};

AnimalDetails.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default AnimalDetails;