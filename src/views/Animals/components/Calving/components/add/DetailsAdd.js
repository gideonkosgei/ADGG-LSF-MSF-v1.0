import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Box,Typography,Switch, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postCalving,getAgents,getParametersLimitAll,getLactationNumber,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_calving_add,endpoint_agent,endpoint_parameter_limit_all,endpoint_get_lactation_number,endpoint_dp_validations} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import moment from 'moment';
import {EventValidation}  from '../../../ValidationMessages';

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
  const [ {user_id,organization_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [body_scores, setBodyScores] = useState([]);
  const [colors, setColors] = useState([]);
  const [deformaties, setDeformaties] = useState([]);
  const [genders, setGenders] = useState([]); 


  const [birth_types, setBirthTypes] = useState([]);
  const [calving_methods, setCalvingMethods] = useState([]);
  const [calving_types, setCalvingTypes] = useState([]);

  const [calving_ease, setCalvingEase] = useState([]);
  const [calving_status, setCalvingStatus] = useState([]);
  const [uses_of_calf, setCalfUses] = useState([]); 
  const [agents, setAgents] = useState([]);
  const [lactationNumber, setLactationNo] = useState(null);
  const [validations, setValidations] = useState([]);
  const [override, setOverride] = useState(false);
  const [limitParameters, setBodyLimitParameters] = useState([]); 
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const option  =  0;

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_agents = true;
    let mounted_limit_parameters = true; 
    let mounted_lactation_no = true; 
    let mounted_validations = true;

    /**
   * Check event Calving validations
   * Animal should be cow or heifer    
   */
  (async  (endpoint,desc,option,id) => {      
    await  genericFunctionFourParameters(endpoint,desc,option,id)
    .then(response => {       
      if (mounted_validations) {
        setValidations(response.payload);         
      }
    });
  })(endpoint_dp_validations,'event-calving-validation',4,animal_id);

    
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];
            let lookup_colors = [];
            let lookup_deformaties = [];
            let lookup_genders = [];
            let lookup_birth_types = [];
            let lookup_calving_methods = [];
            let lookup_calving_type = [];
            let lookup_ease_of_calving = [];
            let lookup_calving_status = [];
            let lookup_use_of_calf = [];
            let lookup_body_scores = []; 
                    


            for (let i = 0; i< data.length; i++){ 
              //birth Types
              if(data[i].list_type_id === 20){                
                lookup_birth_types.push(data[i]);
              } 
              //calving Methods
              if(data[i].list_type_id === 15){                
                lookup_calving_methods.push(data[i]);
              } 
              //Birth Types
              if(data[i].list_type_id === 16){                
                lookup_calving_type.push(data[i]);
              } 

              //Ease of Calving
              if(data[i].list_type_id === 19){                
                lookup_ease_of_calving.push(data[i]);
              } 
              //Calving Status
              if(data[i].list_type_id === 22){                
                lookup_calving_status.push(data[i]);
              } 
              //Use of calf
              if(data[i].list_type_id === 21){                
                lookup_use_of_calf.push(data[i]);
              }     
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              }   
               //colors
               if(data[i].list_type_id === 83){                
                lookup_colors.push(data[i]);
              }  

              //deformaties
              if(data[i].list_type_id === 11){                
                lookup_deformaties.push(data[i]);
              } 

              //genders
              if(data[i].list_type_id === 3){                
                lookup_genders.push(data[i]);
              }    
            
            }  

            setBodyScores(lookup_body_scores);
            setColors(lookup_colors);
            setDeformaties(lookup_deformaties);
            setGenders(lookup_genders);           
            setBirthTypes(lookup_birth_types);
            setCalvingMethods(lookup_calving_methods);
            setCalvingTypes(lookup_calving_type); 
            setCalvingEase(lookup_ease_of_calving); 
            setCalvingStatus(lookup_calving_status); 
            setCalfUses(lookup_use_of_calf);         
            
            
          }
        });
      })(endpoint_lookup,'20,15,16,19,22,21,71,83,11,3');

      (async  (endpoint,org_id,option) => {     
        await  getAgents(endpoint,org_id,option)
        .then(response => {                        
          if (mounted_agents) {            
            setAgents(response.payload);                 
          }
        });
      })(endpoint_agent,organization_id,option); 
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

      (async  (endpoint,option,animal_id) => {     
        await  getLactationNumber(endpoint,option,animal_id)
        .then(response => {                        
          if (mounted_lactation_no) {            
            setLactationNo(response.payload[0].lactation_number);                 
          }
        });
      })(endpoint_get_lactation_number,1,animal_id);
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false; 
      mounted_limit_parameters = false;
      mounted_lactation_no  = false;  
      mounted_validations  = false;          
    };
  }, [organization_id,animal_id]);  
    
    
  if (!colors  || !deformaties ||!genders || !birth_types|| !calving_methods|| !calving_types || !calving_ease || !calving_status || !uses_of_calf || !body_scores || !agents || !limitParameters ||!lactationNumber || !validations) {
    return null;

  }

   // validate weight
   let calf_weight_limits = limitParameters.filter(obj=>obj.category==='calf_weight_limits');
   let calf_weight_limits_status = false;
   let calf_weight_limits_min_value = 0;
   let calf_weight_limits_max_value = 0;
   if(calf_weight_limits.length > 0){
     calf_weight_limits_status = calf_weight_limits[0].is_active_id;  
     calf_weight_limits_min_value = calf_weight_limits[0].min_value;
     calf_weight_limits_max_value = calf_weight_limits[0].max_value;    
   } 
   //validate heart Girth
   let calf_heart_girth_limits = limitParameters.filter(obj=>obj.category==='calf_heart_girth_limits');
   let calf_heart_girth_limits_status = false;
   let calf_heart_girth_limits_min_value = 0;
   let calf_heart_girth_limits_max_value = 0;
   if(calf_heart_girth_limits.length > 0){
     calf_heart_girth_limits_status = calf_heart_girth_limits[0].is_active_id;  
     calf_heart_girth_limits_min_value = calf_heart_girth_limits[0].min_value;
     calf_heart_girth_limits_max_value = calf_heart_girth_limits[0].max_value;    
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
    (async  (endpoint,id,values,user_id,lactation_number) => {     
      await  postCalving(endpoint,id,values,user_id,lactation_number)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_calving_add,animal_id,values,user_id,lactationNumber);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);   
  };
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      spacing={2}
    >  
      {
            (parseInt(validations.length) === 0 || override) ?
          <>     
        <CardHeader title= {`NEW CALVING RECORD - ${animal_name}(${animal_tag})`} />
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
                        max: moment(new Date()).format('YYYY-MM-DD')                 
                      }} 
                      required
                      margin = 'dense'
                      label = "Calving Date"
                      type = "date"
                      name = "calving_date"                      
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
                      required
                      margin = 'dense'                      
                      label="Lactation Number"
                      name="lactation_number"                
                      onChange={handleChange}
                      variant="outlined" 
                      value = {lactationNumber}
                      defaultValue = {lactationNumber}
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
                        label="Calving Method"
                        name="calving_method"
                        onChange={handleChange}
                        required
                        default = ""                              
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}                    
                        variant="outlined"
                      >
                      <option value=""></option>
                      {calving_methods.map(calving_method => (
                            <option                    
                              value={calving_method.id}
                            >
                              {calving_method.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid> 
                  {  parseInt(values.calving_method) === 2  ? 
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
                    label="Assisted By"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined" 
                    select
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {agents.map(agent => (
                          <option                    
                            value={agent.id}
                          >
                            {agent.name}
                          </option>
                        ))
                    }           
                  </TextField>             
                  </Grid> 
                  : null 
                }
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
                    label="Calving Birth Type"
                    name="calving_birth_type"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {birth_types.map(birth_type => (
                          <option                    
                            value={birth_type.id}
                          >
                            {birth_type.value}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid> 
                
                {  parseInt(values.calving_birth_type) === 1 || parseInt(values.calving_birth_type) ===2  ? 
                 <Grid
                 item
                 md={12}
                 xs={12}
                >
                <>
                <Card
                  {...rest}
                  className={clsx(classes.root, className)}
                  spacing={3}
                >                
                  <CardHeader title="CALF (1)" />
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
                        shrink: true                      
                      }}                                       
                      margin = 'dense'
                      required = {true}
                      label="Calving Status"
                      name="calving_status"
                      onChange={handleChange}                                                
                      select                      
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {calving_status.map(status => (
                            <option                    
                              value={status.id}
                            >
                              {status.value}
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
                    required = {parseInt(values.calving_status) ===1 ? true: false}
                    margin = 'dense'
                    label="Calving Type"
                    name="types_calving"
                    onChange={handleChange}                    
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {calving_types.map(calving_type => (
                          <option                    
                            value={calving_type.id}
                          >
                            {calving_type.value}
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
                        shrink: true                      
                      }} 
                      required = {parseInt(values.calving_status) ===1 ? true: false}                                      
                      margin = 'dense'
                      label="Ease Of Calving"
                      name="ease_of_calving"
                      onChange={handleChange}                                                                      
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {calving_ease.map(ease => (
                            <option                    
                              value={ease.id}
                            >
                              {ease.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid>

                  {  parseInt(values.ease_of_calving) === -66  ? 
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
                          label="Ease Of Calving Other"
                          name="ease_of_calving_other"                
                          onChange={handleChange}
                          variant="outlined" 
                      />
                    </Grid>
                     : null 
                  }
                
             
               
                 {  
                    parseInt(values.calving_status) === 1  && 
                    (
                    typeof values.ease_of_calving === 'undefined' ||
                    parseInt(values.ease_of_calving) === 1 ||
                    parseInt(values.ease_of_calving) === 2 ||
                    parseInt(values.ease_of_calving) === 3 ||
                    parseInt(values.ease_of_calving) === -66
                    ) && (

                    typeof values.types_calving === 'undefined' ||
                    parseInt(values.types_calving) === 1 ||
                    parseInt(values.types_calving) === 2                   

                    )
                    
                    ? 
                  <>
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
                      required = {parseInt(values.calving_status) ===1 ? true: false}
                      margin = 'dense'
                      label="Calf Tag ID"
                      name="calf_tag_id"                
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
                    required = {parseInt(values.calving_status) ===1 ? true: false}
                    margin = 'dense'
                    label="Calf Name"
                    name="calf_name"                
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
                        shrink: true                      
                      }} 
                      required = {parseInt(values.calving_status) ===1 ? true: false}                                      
                      margin = 'dense'
                      label="Use Of Calf"
                      name="use_of_calf"                      
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {uses_of_calf.map(use => (
                            <option                    
                              value={use.id}
                            >
                              {use.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid>
                  {  parseInt(values.use_of_calf) === -66  ? 
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
                    label="Other Use of Calf"
                    name="use_of_calf_other"                
                    onChange={handleChange}
                    variant="outlined"  
                    
                />
              </Grid>
              : null 
            }      

                 <Grid
                      item
                      md={3}
                      xs={12}
                    >
                    <TextField
                      fullWidth                    
                      InputLabelProps={{
                        shrink: true                      
                      }}    
                      required = {parseInt(values.calving_status) ===1 ? true: false}                                   
                      margin = 'dense'
                      label="Calf Body Condition"
                      name="calf_body_condition_score"
                      onChange={handleChange}                     
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {body_scores.map(body_score => (
                            <option                    
                              value={body_score.id}
                            >
                              {body_score.id}
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
                      label="Calf Color"
                      name="calf_color"
                      onChange={handleChange}                     
                      default = ""                              
                      select                      
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {colors.map(color => (
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
                        shrink: true                      
                      }} 
                      required = {parseInt(values.calving_status) ===1 ? true: false}                                      
                      margin = 'dense'
                      label="Calf Deformities"
                      name="calf_deformities"                      
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {deformaties.map(deformaty => (
                            <option                    
                              value={deformaty.id}
                            >
                              {deformaty.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid>
                  {  parseInt(values.calf_deformities) === -66  ? 
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
                    label="Other Calf Deformaties"
                    name="other_calf_deformities"                
                    onChange={handleChange}
                    variant="outlined" 
                />
              </Grid>
              : null 
              }
                  
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
                    required = {parseInt(values.calving_status) ===1 ? true: false}
                    margin = 'dense'
                    label="Calf Sex"
                    name="calf_gender"
                    onChange={handleChange}                    
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {genders.map(gender => (
                          <option                    
                            value={gender.id}
                          >
                            {gender.value}
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
                      min: (calf_weight_limits_status)? calf_weight_limits_min_value : "any",
                      max: (calf_weight_limits_status)? calf_weight_limits_max_value : "any",
                      step: "any"               
                    }}
                    required = {parseInt(values.calving_status) ===1 ? true: false}
                    type = "number"
                    margin = 'dense'
                    label="Calf Weight(kg)"
                    name="Calf_weight"                
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
                    inputProps={{                     
                      min: (calf_heart_girth_limits_status)? calf_heart_girth_limits_min_value : "any",
                      max: (calf_heart_girth_limits_status)? calf_heart_girth_limits_max_value : "any",
                      step: "any"
                    }}
                    type = "number"
                    margin = 'dense'
                    label="Calf Heart Girth(cm)"
                    name="calf_heart_girth"                
                    onChange={handleChange}
                    variant="outlined"  
                    
                />
              </Grid>   
              </> 
              : null 
            } 
              </Grid>
              <br/><br/>
          </CardContent>
          </Card>
               
               <br/>
               <br/>
               
                {parseInt(values.calving_birth_type) ===2 ?
                <Card
                        {...rest}
                        className={clsx(classes.root, className)}
                        spacing={3}
                      >                
                        <CardHeader title="CALF(2)" />
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
                              shrink: true                      
                            }} 
                            required = {parseInt(values.calving_birth_type) ===1 ? false: true}                                      
                            margin = 'dense'                         
                            label="Calving Status"
                            name="calving_status2"
                            onChange={handleChange}                                                
                            select                      
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {calving_status.map(status => (
                                  <option                    
                                    value={status.id}
                                  >
                                    {status.value}
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
                          required = {parseInt(values.calving_status2) ===1 ? true: false}
                          margin = 'dense'
                          label="Calving Type"
                          name="types_calving2"
                          onChange={handleChange}                    
                          default = ""                              
                          select
                          // eslint-disable-next-line react/jsx-sort-props
                          SelectProps={{ native: true }}                    
                          variant="outlined"
                        >
                          <option value=""></option>
                          {calving_types.map(calving_type => (
                                <option                    
                                  value={calving_type.id}
                                >
                                  {calving_type.value}
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
                              shrink: true                      
                            }}   
                            required = {parseInt(values.calving_status2) ===1 ? true: false}                                    
                            margin = 'dense'
                            label="Ease Of Calving"
                            name="ease_of_calving2"
                            onChange={handleChange}                                                                      
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {calving_ease.map(ease => (
                                  <option                    
                                    value={ease.id}
                                  >
                                    {ease.value}
                                  </option>
                                ))
                            }           
                          </TextField>
                        </Grid>

                        {  parseInt(values.ease_of_calving2) === -66  ? 
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
                                label="Ease Of Calving Other"
                                name="ease_of_calving_other2"                
                                onChange={handleChange}
                                variant="outlined" 
                            />
                          </Grid>
                          : null 
                        }
                      
                  
                    
                      {  parseInt(values.calving_status2) === 1 && 
                        (
                          typeof values.ease_of_calving2 === 'undefined' ||
                          parseInt(values.ease_of_calving2) === 1 ||
                          parseInt(values.ease_of_calving2) === 2 ||
                          parseInt(values.ease_of_calving2) === 3 ||
                          parseInt(values.ease_of_calving2) === -66
                        ) && 
                        (
                          typeof values.types_calving2 === 'undefined' ||
                          parseInt(values.types_calving2) === 1 ||
                          parseInt(values.types_calving2) === 2   
                        )
                        ? 
                        <>
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
                            required = {parseInt(values.calving_status2) ===1 ? true: false}
                            margin = 'dense'
                            label="Calf Tag ID"
                            name="calf_tag_id2"                
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
                          required = {parseInt(values.calving_status2) ===1 ? true: false}
                          margin = 'dense'
                          label="Calf Name"
                          name="calf_name2"                
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
                              shrink: true                      
                            }}   
                            required = {parseInt(values.calving_status2) ===1 ? true: false}                                    
                            margin = 'dense'
                            label="Use Of Calf"
                            name="use_of_calf2"                      
                            onChange={handleChange}                                                
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {uses_of_calf.map(use => (
                                  <option                    
                                    value={use.id}
                                  >
                                    {use.value}
                                  </option>
                                ))
                            }           
                          </TextField>
                        </Grid>
                        {  parseInt(values.use_of_calf2) === -66  ? 
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
                          label="Other Use of Calf"
                          name="use_of_calf_other2"                
                          onChange={handleChange}
                          variant="outlined" 
                      />
                    </Grid>
                    : null 
                  }  
                      <Grid
                            item
                            md={3}
                            xs={12}
                          >
                          <TextField
                            fullWidth                    
                            InputLabelProps={{
                              shrink: true                      
                            }} 
                            required = {parseInt(values.calving_status2) ===1 ? true: false}                                      
                            margin = 'dense'
                            label="Calf Body Condition"
                            name="calf_body_condition_score2"
                            onChange={handleChange}                     
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {body_scores.map(body_score => (
                                  <option                    
                                    value={body_score.id}
                                  >
                                    {body_score.id}
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
                            label="Calf Color"
                            name="calf_color2"
                            onChange={handleChange}                     
                            default = ""                              
                            select                      
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {colors.map(color => (
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
                              shrink: true                      
                            }}   
                            required = {parseInt(values.calving_status2) ===1 ? true: false}                                    
                            margin = 'dense'
                            label="Calf Deformities"
                            name="calf_deformities2"                      
                            onChange={handleChange}                                                
                            select
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
                          >
                            <option value=""></option>
                            {deformaties.map(deformaty => (
                                  <option                    
                                    value={deformaty.id}
                                  >
                                    {deformaty.value}
                                  </option>
                                ))
                            }           
                          </TextField>
                        </Grid>
                        {  parseInt(values.calf_deformities2) === -66  ? 
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
                          label="Other Calf Deformaties"
                          name="other_calf_deformities2"                
                          onChange={handleChange}
                          variant="outlined" 
                      />
                    </Grid>
                    : null 
                    }
                        
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
                          required = {parseInt(values.calving_status2) ===1 ? true: false}
                          margin = 'dense'
                          label="Calf Sex"
                          name="calf_gender2"
                          onChange={handleChange}                    
                          default = ""                              
                          select
                          // eslint-disable-next-line react/jsx-sort-props
                          SelectProps={{ native: true }}                    
                          variant="outlined"
                        >
                          <option value=""></option>
                          {genders.map(gender => (
                                <option                    
                                  value={gender.id}
                                >
                                  {gender.value}
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
                            min: (calf_weight_limits_status)? calf_weight_limits_min_value : "any",
                            max: (calf_weight_limits_status)? calf_weight_limits_max_value : "any",
                            step: "any"               
                          }}
                        
                          required = {parseInt(values.calving_status2) ===1 ? true: false}
                          type = "number"
                          margin = 'dense'
                          label="Calf Weight(kg)"
                          name="Calf_weight2"                
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
                          inputProps={{                     
                            min: (calf_heart_girth_limits_status)? calf_heart_girth_limits_min_value : "any",
                            max: (calf_heart_girth_limits_status)? calf_heart_girth_limits_max_value : "any",
                            step: "any"
                          }}
                          type = "number"
                          margin = 'dense'
                          label="Calf Heart Girth(cm)"
                          name="calf_heart_girth2"                
                          onChange={handleChange}
                          variant="outlined"  
                          
                      />
                    </Grid>   
                    </> 
                    : null 
                  } 
                    </Grid>
                </CardContent>
                </Card>
                 : null 
                } 
                  
                </>
                </Grid> 

            : null 
            }          
                  
            
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
        </>              
        : <EventValidation validations = {validations}/>   
          }
          { parseInt(validations.length) === 0 || override ? null :
          <CardActions>          
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
        </CardActions> 
        }
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;