import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,Divider, TextField,colors,Button,CardActions,Box,Typography,Switch} from '@material-ui/core';
import {getLookups,postMilking,getParametersLimitAll,getParametersLocalSettingsOrgAll,getMilkingParameters,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_milking_parameter,endpoint_lookup,endpoint_milking_add,endpoint_parameter_limit_all,endpoint_parameter_local_settings_org_all,endpoint_dp_validations} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import {EventValidation}  from '../../../ValidationMessages';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Edit = props => {   
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });
  const [sample_types, setSampleTypes] = useState([]);  
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [milkingParameters, setMilkingParameters] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const [ { organization_id }  ] = useContext(authContext); 
  const [localSettings, setLocalSettings] = useState([]);
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const [quality_fields_view, setQualityFieldsView] = useState(false);
  const [validations, setValidations] = useState([]); 
  const [override, setOverride] = useState(false);

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_limit_parameters = true;
    let mounted_settings = true;
    let mounted_milking_parameters = true;
    let mounted_validations = true;    
    /* 
      get milk parameters
      -------------------
      1. Lactation Number
      2. Lactation ID
      3. Test Day No
      4. Days in Milk
    */


  /**
   * Check event milking validations
   * Animal should be cow or heifer and must have lactation details> must have calved at some point
   * If this check fails,  milk record cannot be captured
   */
  (async  (endpoint,desc,option,id) => {      
    await  genericFunctionFourParameters(endpoint,desc,option,id)
    .then(response => {       
      if (mounted_validations) {
        setValidations(response.payload);  
      }
    });
  })(endpoint_dp_validations,'event-milking-validation',1,animal_id);
 
    (async  (endpoint,id,milk_date) => {     
      await  getMilkingParameters(endpoint,id,milk_date)
      .then(response => {       
        if (mounted_milking_parameters) { 
          const data = response.payload[0][0];                   
          setMilkingParameters(data);          
        }
      });
    })(endpoint_milking_parameter,animal_id,moment(new Date()).format('YYYY-MM-DD'));


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
      mounted_milking_parameters = false;
      mounted_validations = false;      
    };
  }, [organization_id,animal_id]);  
    
    
  if (!sample_types || !limitParameters || !localSettings || !milkingParameters || !validations) {
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

    if (event.target.name === 'milk_date') {       
        (async  (endpoint,id,milk_date) => {     
        await  getMilkingParameters(endpoint,id,milk_date)
        .then(response => { 
            const data = response.payload[0][0];                   
            setMilkingParameters(data); 
        });
      })(endpoint_milking_parameter,animal_id,event.target.value);      
    } 
  };

  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,id,values,user_id,quality_toggle,lactation_id, lactation_number,  days_in_milk, test_day_no) => {     
      await  postMilking(endpoint,id,values,user_id,quality_toggle,lactation_id, lactation_number,  days_in_milk, test_day_no)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        //document.forms["event"].reset();
        //window.location.reload(); 
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_milking_add,animal_id,values,user_id,quality_fields_view,milkingParameters.lactation_id, milkingParameters.lactation_number,  milkingParameters.days_in_milk, milkingParameters.test_day_no);    
  };  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleQualitySwitchChange = event => {
    event.persist();
    setQualityFieldsView(!quality_fields_view);   
  };
  
  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);   
  };
 
  return (
    <Page
      className={classes.root}
      title="Milking"
    > 
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
       {`NEW MILKING RECORD - ${animal_name}(${animal_tag}) `}
      </Typography>
      <br/>           
      <Header />
      <br/>       
      {
        (parseInt(validations.length) === 0 || override) ?
        <> 
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
                  spacing={3}
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
                          readOnly: true,
                          disabled: true  
                        }}                                        
                        
                        label = "Calving Date"
                        type = "date"
                        name = "calving_date"                      
                        onChange = {handleChange}
                        variant = "outlined"
                        value = {milkingParameters.calving_date}
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
                          max: moment(new Date()).format('YYYY-MM-DD'),  
                          min: moment(milkingParameters.calving_date).format('YYYY-MM-DD')  
                        }}
                        required                      
                        
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
                      inputProps={{
                        readOnly: true,
                        disabled: true               
                      }}
                      
                      label="Lactation ID"
                      name="lactation_id"              
                      onChange={handleChange}
                      variant="outlined" 
                      value = {milkingParameters.lactation_id}  
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
                                          
                      label="Lactation Number"
                      name="lactation_number" 
                      type = "number"               
                      onChange={handleChange}
                      variant="outlined" 
                      value = {milkingParameters.lactation_number}  
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
                      
                      label="Test Day No"
                      name="testday_no"                
                      onChange={handleChange}
                      variant="outlined"
                      type = "number" 
                      value = {milkingParameters.test_day_no}                        
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
                      
                      label="Days in Milk"
                      name="days_in_milk"                
                      onChange={handleChange}
                      variant="outlined"
                      type = "number"
                      value = {milkingParameters.days_in_milk} 
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
                        min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                        max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                        step: "any"                
                      }}
                      
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
                                          
                      label={`Milk PM (${milk_unit_value})`}
                      name="milk_pm_litres"                
                      onChange={handleChange}
                      variant="outlined"
                      type = "number"                       
                      
                  />
                </Grid>
                <Grid
                      item
                      md={9}
                      xs={12}
                    >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}                    
                      
                      label="Milking Notes"
                      name="milking_notes"                
                      onChange={handleChange}
                      variant="outlined" 
                      rowsMax={4} 
                      multiline  
                      rows={1}                        
                  />
                </Grid>
                

                <Grid
                      item
                      md={12}
                      xs={12}
                    >

                      <Box> 
                        <Typography variant="h6">{ quality_fields_view? "Discard/Hide Milk Quality Attributes" : "Capture Milk Quality Attributes"} </Typography> 
                      </Box> 
                      <Box> 
                          <Switch             
                            className={classes.toggle}            
                            checked={quality_fields_view}
                            color="secondary"
                            edge="start"               
                            onChange={handleQualitySwitchChange}
                          />             
                      </Box> 
                </Grid>
              
                <Grid item md={12} xs={12}> 
                <Box>
                {quality_fields_view ?   
                <Grid container spacing={3}> 
              
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
                      
                      label = {`Milk Urea (${urea_unit_value})`}
                      name="milk_urea"                
                      onChange={handleChange}
                      variant="outlined"   
                      type = "number"                                      
                      
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
                        min: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_min_value : "any",
                        max: (milk_somatic_cell_count_limits_status)? milk_somatic_cell_count_limits_max_value : "any"                                   
                      }}
                      
                      label = {`Somatic Cell Count(${somatic_cell_count_value})`}
                      name="milk_somatic_cell_count"                
                      onChange={handleChange}
                      variant="outlined" 
                      type = "number"  
                      value = {values.milk_somatic_cell_count}                                                          
                      
                  />
                </Grid>   
            
                </Grid>
                : null
                }
                </Box>
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
        </>
          : <EventValidation validations = {validations}/>
          } 
        <Grid container spacing={1} justify="center">            
          <Grid item  xs={12} >    
           { parseInt(validations.length) === 0 || override ? null : 
           <>                 
              <Box> 
                  <Typography variant="h6"> Override Validations </Typography> 
              </Box> 
              <Box> 
                <Switch             
                  className={classes.toggle}            
                // checked={values.readOnly}
                  color="secondary"
                  edge="start"               
                  onChange={handleSwitchChange}
                />             
              </Box>
            </>
            }   
          </Grid>
        </Grid>
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
