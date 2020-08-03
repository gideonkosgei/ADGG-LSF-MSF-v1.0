import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button, Card,CardActions, CardContent, CardHeader,Tooltip, Grid,Divider, TextField,colors,Box,Switch ,Typography} from '@material-ui/core';
import {getLookups,getHerds,putAnimalDetails,getAnimal}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_herd,endpoint_animal_update,endpoint_animal} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';   
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import {AnimalDetailsMetaData}  from '../../../Modal';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  toggle :{    
    justifyContent: 'center'
  }
  
}));

const DetailsEdit = props => {
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const classes = useStyles();
  const [ {organization_id}  ] = useContext(authContext);
  const [ {user_id} ] = useContext(authContext);
  
  const [values, setValues] = useState({ });  
  const [animal_types, setAnimalTypes] = useState([]);
  const [main_breeds, setMainBreeds] = useState([]);
  const [breed_composition, setBreedComposition] = useState([]);
  const [gender, setGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [sire_types, setSireTypes] = useState([]);
  const [herds, setHerds] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [deformaties_, setDeformaties] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const animal_id  = localStorage.getItem('animal_id');
  const [openMetadata, setMetadata] = useState(false); 


  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_herds = true;
    let mounted_animal_details = true;

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
            let lookup_deformaties = []; 
            let lookup_entry_types = []; 

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
              //deformaties
              if(data[i].list_type_id === 11){                
                lookup_deformaties.push(data[i]);
              }  
              //Entry types
              if(data[i].list_type_id === 69){                
                lookup_entry_types.push(data[i]);
              }            
              
            }  
            setAnimalTypes(lookup_animal_types);
            setMainBreeds(lookup_main_breeds);
            setBreedComposition(lookup_breed_composition);
            setGender(lookup_gender);
            setColors(lookup_colors);
            setSireTypes(lookup_sire_types);
            setEntryTypes(lookup_entry_types);
            setDeformaties(lookup_deformaties);
            
            
          }
        });
      })(endpoint_lookup,'8,14,62,3,83,13,11,69');

      (async  (endpoint,id) => {     
        await  getHerds(endpoint,id)
        .then(response => {       
          if (mounted_herds) { 
            const data = response.payload;           
            setHerds(data);               
          }
        });
      })(endpoint_herd,organization_id);

      (async  (endpoint,id) => {             
        await  getAnimal(endpoint,id)
        .then(response => {       
          if (mounted_animal_details) { 
            const data = response.payload[0][0];             
            setValues(data);                         
          }
        });
      })(endpoint_animal,animal_id);
      
      
    return () => {
      mounted_lookup = false;
      mounted_herds  = false;
      mounted_animal_details = false;
    };
  }, [organization_id,animal_id]); 

  if (!values || !animal_types || !main_breeds || !breed_composition || !gender || !colors || !sire_types || !entryTypes || !deformaties_) {
    return null;
  }


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
  };


  

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };


  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,org_id,values,user_id,animal_id) => {     
      await  putAnimalDetails(endpoint,org_id,values,user_id,animal_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_animal_update,organization_id,values,user_id,animal_id);    
  };

  const handleMetadataOpen = () => {
    setMetadata(true);
  };

  const handleMetadataClose = () => {
    setMetadata(false);
  };
  
 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >

      <form id ='new_reg' onSubmit={handleSubmit}>      
        <CardHeader title = {readOnly? "View Animal Details" : "Edit Animal Details"} />
        <Divider />
        <CardContent>
          <Grid container spacing={4} >   
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
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}
                id = 'reg_date'
                margin = 'dense'
                label="Registration Date"
                type="date"
                name="registration_date"
                defaultValue = {new Date()}
                onChange={handleChange}
                variant="outlined" 
                required
                value = {values.registration_date}
                             
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
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}
                margin = 'dense'
                label="Entry Date"
                type="date"
                name="entry_date"
                defaultValue = {new Date()}
                onChange={handleChange}
                variant="outlined" 
                required
                value = {values.entry_date}                             
              />
            </Grid>    

             <Grid
          item
          md={2}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              readOnly: Boolean(readOnly),
              disabled: Boolean(readOnly)                
            }}
            margin = 'dense'
            label="Entry Type"
            name="entry_type"
            onChange={handleChange}
            default = "" 
            required              
            select
            // eslint-disable-next-line react/jsx-sort-props
            SelectProps={{ native: true }}            
            variant="outlined"
            value = {values.entry_type}
          >
            <option value=""></option>
            {entryTypes.map(types => (
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
          md={2}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              readOnly: Boolean(readOnly),
              disabled: Boolean(readOnly)                
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
            variant="outlined"
            value = {values.animal_type}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}   
                margin = 'dense'           
                label="Tag Prefix "
                name="tag_prefix"
                onChange={handleChange}
                variant="outlined"
                value = {values.tag_prefix}
              />
            </Grid>
            
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}   
                margin = 'dense'           
                label="Tag Sequence "
                name="tag_sequence"
                onChange={handleChange}                                
                variant="outlined"  
                value = {values.tag_sequence}
              />
            </Grid>
            
            
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: Boolean(readOnly)                 
                }}   
                margin = 'dense'           
                label="Tag ID "
                name="tag_id"
                onChange={handleChange}
                required                
                variant="outlined"
                value = {values.tag_id}                
                
              />
            </Grid>

             
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}  
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}  
                margin = 'dense'           
                label="Origin Country "
                name="country_of_origin"
                onChange={handleChange}
                variant="outlined"
                value = {values.country_of_origin}
              />
            </Grid>

            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}   
                margin = 'dense'           
                label="Purchase Cost"
                name="purchase_cost"
                onChange={handleChange}
                variant="outlined"
                type = "number"
                value = {values.purchase_cost}
              />
            </Grid>
            
            
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Animal Name"
                name="animal_name"
                onChange={handleChange}
                variant="outlined" 
                value = {values.animal_name}   
              />
            </Grid>

          <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Herd"
                name="herd_id"
                onChange={handleChange}                              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value = {values.herd_id}
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

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="DOB"
                type="date"
                name="dob"
                defaultValue = {new Date()}
                onChange={handleChange}
                variant="outlined" 
                required
                value = {values.date_of_birth}             
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Sex"
                name="sex"
                onChange={handleChange} 
                required              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value = {values.sex}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}


                margin = 'dense'
                label="Color"
                name="color"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value = {values.color}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'           
                label="Color Other"
                name="color_other"
                onChange={handleChange}
                variant="outlined"
                value = {values.color_other}
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

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Main Breed"
                name="main_breed"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}                
                variant="outlined"
                value = {values.main_breed}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}    

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'           
                label="Main Breed Other"
                name="main_breed_other"
                onChange={handleChange}
                variant="outlined"
                value = {values.main_breed_other}
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Secondary Breed"
                name="secondary_breed"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}                
                variant="outlined"
                value = {values.secondary_breed}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}  
                
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'           
                label="Sec Breed Other"
                name="secondary_breed_other"
                onChange={handleChange}
                variant="outlined"
                value = {values.secondary_breed_other}
              />
            </Grid>
            
            <Grid
              item
              md={2}
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

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                value = {values.breed_composition}
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
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Breed Composition Details"
                name="breed_composition_details"
                multiline
                rowsMax={4}                
                onChange={handleChange}
                variant="outlined" 
                value = {values.breed_composition_details}             
              />
            </Grid>

            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Deformaties"
                name="deformaties"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                value = {values.deformities} 
                variant="outlined"
              > 
                <option value=""></option> 
                {deformaties_.map(deformaty => (
                    <option                      
                      value={deformaty.id}
                    >
                      {deformaty.value}
                    </option>
                  ))
                }               
              </TextField>
            </Grid>

            <Grid
              item
              md={2}
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

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                value = {values.sire_type}
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
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Sire"
                name="sire_id"
                onChange={handleChange}
                variant="outlined" 
                type = "number"  
                value = {values.sire_id}                        
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Dam"
                name="dam_id"                
                onChange={handleChange}
                variant="outlined"
                type = "number" 
                value = {values.dam_id}                         
              />
            </Grid>

            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Hair Sample ID"
                name="hair_sample_id"                
                onChange={handleChange}
                variant="outlined" 
                type = "number"
                value = {values.hair_sample_id} 
                           
              />
            </Grid>

            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}


                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}
                margin = 'dense'
                label="Herd Book Info"
                name="herd_book_number"                
                onChange={handleChange}
                variant="outlined" 
                value = {values.herd_book_number}                            
              />
            </Grid>

            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}

                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}

                margin = 'dense'
                label="Notes"
                name="notes"
                multiline
                rowsMax={4}                
                onChange={handleChange}
                variant="outlined" 
                value = {values.notes}              
              />
            </Grid>

           

            
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>        
          <Box flexGrow={1}>
            {readOnly ? null :                        
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden = "true"                               
              >
                Save Changes
              </Button>              
            }                             
          </Box> 
          <Box>
            <Tooltip  title="view Metadata">
              <Button onClick={handleMetadataOpen}>
                <OpenInNewIcon className={classes.buttonIcon} />                
              </Button>
            </Tooltip> 
              
          </Box>  
          <Box> 
              <Typography variant="h6">{ readOnly? "Enable Form" : "Disable Form"} </Typography> 
          </Box> 
          <Box> 
              <Switch             
                className={classes.toggle}            
                checked={values.readOnly}
                color="secondary"
                edge="start"               
                onChange={handleSwitchChange}
              />             
         </Box>
        </CardActions>
      </form> 
      <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
        />
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />   
        <AnimalDetailsMetaData
                animalDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
        />
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;