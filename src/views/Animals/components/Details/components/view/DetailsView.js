import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors } from '@material-ui/core';
import {genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_animal} from '../../../../../../configs/endpoints';
import {Sidebar} from '../index';


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

const DetailsView = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState({ });
  const animal_id  = localStorage.getItem('animal_id');

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id) => {     
        await  genericFunctionFourParameters(endpoint,id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload[0];            
            setValues(data);                 
          }
        });
      })(endpoint_animal,animal_id);
      
      
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
      className={clsx(classes.root, className)}
    >
        <CardHeader title={`View Animal Details #${animal_id}`} />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
              <Card> 
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
                disabled = "true"
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Animal Type"
                name="animal_type"               
                value={values.animalType}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}    
                    margin = 'dense'           
                    label="Tag ID "
                    name="tag_id"                                      
                    value={values.tag_id}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Animal Name"
                    name="animal_name"                   
                    variant="outlined" 
                    value={values.animal_name}             
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Herd"
                    name="Herd"                                        
                    value={values.herd_name}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="DOB"                    
                    name="dob" 
                    variant="outlined" 
                    value={values.dateofBirth}
                                
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Sex"
                    name="sex"                                        
                    value={values.sex}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Color"
                    name="color"
                    value={values.color}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Main Breed"
                    name="main_breed"                   
                    value={values.main_breed}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Breed Composition"
                    name="breed_composition"                    
                    value={values.breedComposition}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Breed Composition Details"
                    name="breed_composition_details"
                    multiline
                    rowsMax={4}
                    variant="outlined" 
                    value={values.breedCompositiondetails} 
                               
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Sire Type"
                    name="sire_type"                   
                    value={values.sire_type}
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
                    disabled = "true"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Sire"
                    name="sire_tag_id"                   
                    variant="outlined" 
                    value={values.sire_id}                               
                  />
                </Grid>
                <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                disabled = "true"
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label="Dam"
                name="dam_tag_id"
                variant="outlined" 
                value={values.dam_tag_id} 
                          
              />
            </Grid>
          </Grid>
          </CardContent>
          </Card>
          </Grid>
          </Grid>
        </CardContent> 
    </Card>
  );
};

DetailsView.propTypes = {
  className: PropTypes.string 
};

export default DetailsView;