import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postMilking,getParametersLimitAll,getParametersLocalSettingsOrgAll}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_milking_add,endpoint_parameter_limit_all,endpoint_parameter_local_settings_org_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';

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

const DetailsEdit = props => {
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [sample_types, setSampleTypes] = useState([]);  
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const [ { organization_id }  ] = useContext(authContext); 
  const [localSettings, setLocalSettings] = useState([]);

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_limit_parameters = true;
    let mounted_settings = true;

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];
            let lookup_sample_types = [];
            for (let i = 0; i< data.length; i++){ 
              //Sample Types
              if(data[i].list_type_id === 70){                
                lookup_sample_types.push(data[i]);
              }             
            }  

            setSampleTypes(lookup_sample_types);
            
          }
        });
      })(endpoint_lookup,'70');
      // get limit parameters for input validation
      (async  (endpoint) => {             
        await  getParametersLimitAll(endpoint)
        .then(response => {       
          if (mounted_limit_parameters) { 
            const data = response.payload;                       
            setBodyLimitParameters(data);                         
          }
        });
      })(endpoint_parameter_limit_all);

      (async  (endpoint,id) => {     
        await  getParametersLocalSettingsOrgAll(endpoint,id)
        .then(response => {                        
          if (mounted_settings) {            
            setLocalSettings(response.payload);                 
          }
        });
      })(endpoint_parameter_local_settings_org_all,organization_id); 
      
    return () => {
      mounted_lookup = false;  
      mounted_limit_parameters = false;  
      mounted_settings = false;
    };
  }, [organization_id]);  
    
    
  if (!sample_types || !limitParameters || !localSettings) {
    return null;
  }

  // validate milk amount
  let milk_amount_limits = limitParameters.filter(obj=>obj.category==='milk_amount_limits');
  let milk_amount_limits_status = false;
  let milk_amount_limits_min_value = 0;
  let milk_amount_limits_max_value = 0;
  if(milk_amount_limits.length > 0){
    milk_amount_limits_status = milk_amount_limits[0].is_active_id;  
    milk_amount_limits_min_value = milk_amount_limits[0].min_value;
    milk_amount_limits_max_value = milk_amount_limits[0].max_value;    
  }

 

  // validate milk lactose
  let milk_lactose_limits = limitParameters.filter(obj=>obj.category==='milk_lactose_limits');
  let milk_lactose_limits_status = false;
  let milk_lactose_limits_min_value = 0;
  let milk_lactose_limits_max_value = 0;
  if(milk_lactose_limits.length > 0){
    milk_lactose_limits_status = milk_lactose_limits[0].is_active_id;  
    milk_lactose_limits_min_value = milk_lactose_limits[0].min_value;
    milk_lactose_limits_max_value = milk_lactose_limits[0].max_value;    
  }

  // validate milk fat
  let milk_fat_limits = limitParameters.filter(obj=>obj.category==='milk_fat_limits');
  let milk_fat_limits_status = false;
  let milk_fat_limits_min_value = 0;
  let milk_fat_limits_max_value = 0;
  if(milk_fat_limits.length > 0){
    milk_fat_limits_status = milk_fat_limits[0].is_active_id;  
    milk_fat_limits_min_value = milk_fat_limits[0].min_value;
    milk_fat_limits_max_value = milk_fat_limits[0].max_value;    
  }

   // validate milk protein
   let milk_protein_limits = limitParameters.filter(obj=>obj.category==='milk_protein_limits');
   let milk_protein_limits_status = false;
   let milk_protein_limits_min_value = 0;
   let milk_protein_limits_max_value = 0;
   if(milk_protein_limits.length > 0){
     milk_protein_limits_status = milk_protein_limits[0].is_active_id;  
     milk_protein_limits_min_value = milk_protein_limits[0].min_value;
     milk_protein_limits_max_value = milk_protein_limits[0].max_value;    
   }

   // validate milk urea
   let milk_urea_limits = limitParameters.filter(obj=>obj.category==='milk_urea_limits');
   let milk_urea_limits_status = false;
   let milk_urea_limits_min_value = 0;
   let milk_urea_limits_max_value = 0;
   if(milk_urea_limits.length > 0){
     milk_urea_limits_status = milk_urea_limits[0].is_active_id;  
     milk_urea_limits_min_value = milk_urea_limits[0].min_value;
     milk_urea_limits_max_value = milk_urea_limits[0].max_value;    
   }

   // validate somatic cell count
   let milk_somatic_cell_count_limits = limitParameters.filter(obj=>obj.category==='milk_somatic_cell_count_limits');
   let milk_somatic_cell_count_limits_status = false;
   let milk_somatic_cell_count_limits_min_value = 0;
   let milk_somatic_cell_count_limits_max_value = 0;
   if(milk_somatic_cell_count_limits.length > 0){
     milk_somatic_cell_count_limits_status = milk_somatic_cell_count_limits[0].is_active_id;  
     milk_somatic_cell_count_limits_min_value = milk_somatic_cell_count_limits[0].min_value;
     milk_somatic_cell_count_limits_max_value = milk_somatic_cell_count_limits[0].max_value;    
   }

       //local settings  
       const milk_unit = localSettings.filter(obj=>obj.name==='MILK_UNIT');
       const milk_unit_value = (milk_unit.length > 0)?milk_unit[0].value : "ltrs"; 
    
       const weight_unit = localSettings.filter(obj=>obj.name==='WEIGHT_UNIT');
       const weight_unit_value = (weight_unit.length > 0)?weight_unit[0].value : "kg"; 
    
       const urea_unit = localSettings.filter(obj=>obj.name==='UREA_UNIT');
       const urea_unit_value = (urea_unit.length > 0)?urea_unit[0].value : "mg/dl"; 
    
       const somatic_cell_count = localSettings.filter(obj=>obj.name==='SOMATIC_CELL_COUNT');
       const somatic_cell_count_value = (somatic_cell_count.length > 0)?somatic_cell_count[0].value : "cells/ml"; 
    


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,id,values,user_id) => {     
      await  postMilking(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_milking_add,animal_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
        <CardHeader title="New Milking Record" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
            <Card> 
            <form id ='event' onSubmit={handleSubmit} >
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
                      required
                      margin = 'dense'
                      label = "Milk Date"
                      type = "date"
                      name = "milk_date"                      
                      onChange = {handleChange}
                      variant = "outlined"
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
                    label="Lactation ID"
                    name="lactation_id"              
                    onChange={handleChange}
                    variant="outlined" 
                    required                    
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
                    label="Lactation Number"
                    name="lactation_number" 
                    type = "number"               
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
                    label="Test Day No"
                    name="testday_no"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                       
                    
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
                    label="Days in Milk"
                    name="days_in_milk"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                       
                    
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
                      min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                      step: "any"               
                    }}
                    margin = 'dense'
                    label={`Milk AM (${milk_unit_value})`}
                    name="milk_am_litres"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                       
                    
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
                      min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                      step: "any"               
                    }}
                    margin = 'dense'                   
                    label={`Milk mid-day (${milk_unit_value})`}
                    name="milk_mid_day"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                       
                    
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
                      min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                      step: "any"             
                    }}
                    margin = 'dense'                    
                    label={`Milk PM (${milk_unit_value})`}
                    name="milk_pm_litres"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                       
                    
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
                    label="Milk Sample Type"
                    name="milk_sample_type"
                    onChange={handleChange}                   
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {sample_types.map(sample_type => (
                          <option                    
                            value={sample_type.id}
                          >
                            {sample_type.value}
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
                    label="Milking Notes"
                    name="milking_notes"                
                    onChange={handleChange}
                    variant="outlined" 
                    rowsMax={4} 
                    multiline                                              
                    
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
                    label="Milk Quality"
                    name="milk_quality"                
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
                    label = {`Milk Weight (${weight_unit_value})`}
                    name="milk_Weight"                
                    onChange={handleChange}
                    variant="outlined"  
                    type = "number"                                       
                    
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
                      min: (milk_fat_limits_status)? milk_fat_limits_min_value : "any",
                      max: (milk_fat_limits_status)? milk_fat_limits_max_value : "any",
                      step: "any"                 
                    }}
                    margin = 'dense'
                    label="Milk Butter Fat(%)"
                    name="milk_butter_fat"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"                                          
                    
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
                      min: (milk_lactose_limits_status)? milk_lactose_limits_min_value : "any",
                      max: (milk_lactose_limits_status)? milk_lactose_limits_max_value : "any",
                      step: "any"                
                    }}
                    margin = 'dense'
                    label="Milk Lactose(%)"
                    name="milk_lactose"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"                                          
                    
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
                      min: (milk_protein_limits_status)? milk_protein_limits_min_value : "any",
                      max: (milk_protein_limits_status)? milk_protein_limits_max_value : "any",
                      step: "any"              
                    }}
                    margin = 'dense'
                    label="Milk Protein(%)"
                    name="milk_protein"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"                                           
                    
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
                      min: (milk_urea_limits_status)? milk_urea_limits_min_value : "any",
                      max: (milk_urea_limits_status)? milk_urea_limits_max_value : "any",
                      step: "any"                             
                    }}
                    margin = 'dense'
                    label = {`Milk Urea (${urea_unit_value})`}
                    name="milk_urea"                
                    onChange={handleChange}
                    variant="outlined"   
                    type = "number"                                      
                    
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
                      min: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_min_value : "any",
                      max: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_max_value : "any"                                   
                    }}
                    margin = 'dense'
                    label = {`Somatic Cell Count(${somatic_cell_count_value})`}
                    name="milk_somatic_cell_count"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"                                          
                    
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
                    label="Field Agent"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    
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
        <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
        />
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />
          </Card>
          </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;