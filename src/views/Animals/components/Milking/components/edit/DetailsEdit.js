import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updateMilking,getMilkingByEventId,getParametersLimitAll,getParametersLocalSettingsOrgAll}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_milking_update,endpoint_milking_specific,endpoint_parameter_limit_all,endpoint_parameter_local_settings_org_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventMilkingMetaData}  from '../../../Modal';
import moment from 'moment';

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
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [localSettings, setLocalSettings] = useState([]);
  const event_id  = sessionStorage.getItem('milking_event_id'); 
  const [ { organization_id }  ] = useContext(authContext); 
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_milking = true;
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

      (async  (endpoint,id) => {             
        await  getMilkingByEventId(endpoint,id)
        .then(response => {       
          if (mounted_milking) { 
            const data = response.payload[0][0];                       
            setValues(data);                                 
          }
        });
      })(endpoint_milking_specific,event_id);

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
      mounted_milking = false; 
      mounted_limit_parameters = false; 
      mounted_settings = false;  
    };
  }, [event_id,organization_id]);  
    
    
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
      await  updateMilking(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_milking_update,event_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
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
      
        <CardHeader title= { readOnly ? `MILKING RECORD - ${animal_name}(${animal_tag})`:`MILKING RECORD - ${animal_name}(${animal_tag})` } />         
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
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),
                        max: moment(new Date()).format('YYYY-MM-DD')                 
                      }}
                      defaultValue = {moment(new Date()).format('YYYY-MM-DD')}
                      required
                      margin = 'dense'
                      label = "Milk Date"
                      type = "date"
                      name = "milk_date"                      
                      onChange = {handleChange}
                      variant = "outlined"
                      value = {values.milk_date}
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
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label="Lactation ID"
                    name="lactation_id"              
                    onChange={handleChange}
                    variant="outlined" 
                    required     
                    value = {values.lactation_id}               
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
                      readOnly: true,
                      disabled: true               
                    }}
                    margin = 'dense'                    
                    label="Lactation Number"
                    name="lactation_number"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"
                    value = {values.lactation_number} 
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
                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label="Test Day No"
                    name="testday_no"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"
                    value = {values.testday_no} 
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
                    inputProps={{
                      readOnly: true,
                      disabled: true               
                    }}
                    margin = 'dense'
                    label="Days in Milk"
                    name="days_in_milk"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"  
                    value = {values.days_in_milk}                     
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_am_litres}                       
                    
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_mid_day}                      
                    
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_pm_litres}                     
                    
                />
              </Grid>

              <Grid
                    item
                    md={12}
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
                    label="Milking Notes"
                    name="milking_notes"                
                    onChange={handleChange}
                    variant="outlined" 
                    rowsMax={4} 
                    multiline  
                    rows={2}   
                    value = {values.milking_notes}  
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
                    label="Milk Sample Type"
                    name="milk_sample_type"
                    onChange={handleChange}                   
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.milk_sample_type}
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    margin = 'dense'
                    label = {`Milk Weight (${weight_unit_value})`}                    
                    name="milk_Weight"                
                    onChange={handleChange}
                    variant="outlined"  
                    type = "number"  
                    value = {values.milk_Weight} 
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_butter_fat}                                         
                    
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_lactose}                                         
                    
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_protein}                                          
                    
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
                      disabled: Boolean(readOnly),
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
                    value = {values.milk_urea}                                      
                    
                />
              </Grid>
  
              <Grid
                    item
                    md={6}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),
                      min: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_min_value : "any",
                      max: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_max_value : "any"                                   
                    }}
                    margin = 'dense'
                    label = {`Somatic Cell Count(${somatic_cell_count_value})`}
                    name="milk_somatic_cell_count"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"  
                    value = {values.milk_somatic_cell_count}                                                          
                    
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
        <EventMilkingMetaData
                milkDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
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