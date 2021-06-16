import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Box,Typography,Fab,CircularProgress,Switch, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postCalving,getAgents,getParametersLimitAll,getLactationNumber,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_calving_add,endpoint_agent,endpoint_parameter_limit_all,endpoint_get_lactation_number,endpoint_dp_validations} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import moment from 'moment';
import {EventValidation}  from '../../../ValidationMessages';
import { Page } from 'components';
import {Header} from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
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
  content: {
    marginTop: theme.spacing(3)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const Edit = props => { 
  const {className, ...rest } = props; 
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
  const option  =  0;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async  (endpoint,id,values,user_id,lactation_number) => {     
      await  postCalving(endpoint,id,values,user_id,lactation_number)
      .then((response) => {  

        setOutput({status:null, message:''});
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          if (parseInt(response.status) === 1){ 
            setValues({});        
            document.forms["event"].reset(); 
            setOutput({status:parseInt(response.status), message:response.message}) 
          } else {
            setOutput({status:parseInt(response.status), message:response.message})
          }         
        }, 500);
        
      }).catch((error) => {        
        setOutput({status:0, message:error.message})  
        setSuccess(false);
        setLoading(false);  
      });      
    })(endpoint_calving_add,animal_id,values,user_id,lactationNumber);    
  };    


  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);   
  };
  
 
  return (
    <Page
      className={classes.root}
      title="Calving"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       {`NEW CALVING RECORD : ${animal_tag}`}
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
                {output.status === 0 ?
                <>
                <Alert severity="error" >{output.message}</Alert>             
                </>
                :output.status === 1 ?
                <>
                <Alert severity="success" >{output.message}</Alert>           
                </>
                :null
                }          
              <br/>            
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
            <div className={classes.wrapper}>
                <Fab
                  aria-label="save"
                  color="primary"
                  className={buttonClassname}
                >
                  {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
              </div>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={buttonClassname}
                  disabled={loading}                
                  type="submit"
                >
                  Save Changes
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>  
          </CardActions> 
          </form>         
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
