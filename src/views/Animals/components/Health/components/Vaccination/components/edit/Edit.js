import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab,CircularProgress, LinearProgress, Grid, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,CreateOrEditVaccinationRecord,getVaccination,getAgents,getParametersLimitAll}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_vaccination_edit,endpoint_vaccination_get,endpoint_agent,endpoint_parameter_limit_all} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventMetaData}  from '../../../../../Modal';
import moment from 'moment';
import { Page } from 'components';
import {default as Header} from '../../../../../Header/index';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';


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
  const classes = useStyles();
  sessionStorage.setItem('vaccination_record_id', parseInt(props.match.params.id));    
  const [ {user_id,organization_id} ] = useContext(authContext);  
  const [values, setValues] = useState({ });  
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);  
  const record_id  = sessionStorage.getItem('vaccination_record_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag'); 
  const [agents, setAgents] = useState([]);
  const [healthStatus, setHealthStatus] = useState([]);
  const [healthProvider, setHealthProvider] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]); 
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const option  =  0;
  const [output, setOutput] = useState({status:null, message:""}); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {   
    let mounted_lookup = true;  
    let mounted_agents = true;
    let mounted_vaccination = true;
    let mounted_limit_parameters = true;  
    

    (async  (endpoint,org_id,option) => {     
      await  getAgents(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_agents) {            
          setAgents(response.payload);                 
        }
      });
    })(endpoint_agent,organization_id,option); 

    (async  (endpoint,id) => {     
      await  getLookups(endpoint,id)
      .then(response => {       
        if (mounted_lookup) { 
          const data = response.payload[0];  
          let lookup_health_status = [];  
          let lookup_health_provider = [];
          let lookup_vaccine_types = []; 
          let lookup_payment_modes = []; 


          for (let i = 0; i< data.length; i++){ 
              //Health Status
              if(data[i].list_type_id === 89){                
                lookup_health_status.push(data[i]);
              } 

              //Health Provider
              if(data[i].list_type_id === 47){                
                lookup_health_provider.push(data[i]);
              }   
              
              //Parasite Types
              if(data[i].list_type_id === 88){                
                lookup_vaccine_types.push(data[i]);
              }   

               //Payment Modes
               if(data[i].list_type_id === 85){                
                lookup_payment_modes.push(data[i]);
              }                  
          }  
          setHealthStatus(lookup_health_status);
          setHealthProvider(lookup_health_provider);
          setVaccineTypes(lookup_vaccine_types); 
          setPaymentModes(lookup_payment_modes);
       
        }
      });
    })(endpoint_lookup,'89,47,88,85');
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

      (async  (endpoint,id,option) => {     
        await  getVaccination(endpoint,id,option)
        .then(response => {                        
          if (mounted_vaccination) {            
            setValues(response.payload[0]);    
            setIsLoading(false);             
          }
        });
      })(endpoint_vaccination_get,record_id,2);
      
    return () => {
      mounted_lookup = false;  
      mounted_vaccination = false;   
      mounted_agents = false;  
      mounted_limit_parameters = false;      
    };
  }, [record_id,organization_id]);  

  if (!healthStatus || !healthProvider|| !vaccineTypes || !limitParameters ||!paymentModes ||!values || !agents) {
    return null;
  }

  // validate weight
  let mature_weight_limits = limitParameters.filter(obj=>obj.category==='mature_weight_limits');
  let mature_weight_limits_status = false;
  let mature_weight_limits_min_value = 0;
  let mature_weight_limits_max_value = 0;

  if(mature_weight_limits.length > 0){
    mature_weight_limits_status = mature_weight_limits[0].is_active_id;  
    mature_weight_limits_min_value = mature_weight_limits[0].min_value;
    mature_weight_limits_max_value = mature_weight_limits[0].max_value;    
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
    (async  (endpoint,id,values,user_id) => {     
      await  CreateOrEditVaccinationRecord(endpoint,id,values,user_id)
      .then((response) => {        
        setOutput({status:null, message:''});      
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);          
          if (parseInt(response.status) === 1){               
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
    })(endpoint_vaccination_edit,record_id,values,user_id);    
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
    <Page
      className={classes.root}
      title="Vaccination"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
      { readOnly ? `VACCINATION : ${animal_tag}` :`EDIT VACCINATION : ${animal_tag}`}
      </Typography>
      <br/>         
      <Header />
      <br/>
      { isLoading  &&
        <LinearProgress/>
      } 
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
                        readOnly: true,
                        disabled: true,                      
                        max: moment(new Date()).format('YYYY-MM-DD')                 
                      }}  
                                      
                      
                      required
                      label="Vaccination Date"
                      type="date"
                      name="vacc_vaccine_date"  
                      value = {values.vacc_vaccine_date}                    
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Vaccine Type"
                    name="vacc_vaccine_type"
                    value = {values.vacc_vaccine_type}
                    required
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {
                      vaccineTypes.map(x => (
                        <option                    
                          value={x.id}
                        >
                          {x.value}
                        </option>
                      ))
                    }           
                  </TextField>
                </Grid>
                {  parseInt(values.vacc_vaccine_type) === -66 ? 
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
                      
                      label="Other Vaccine Type"
                      name="vacc_vaccine_type_other"
                      value = {values.vacc_vaccine_type_other}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid> 
                  : null
                } 

                {  parseInt(values.vacc_vaccine_type) === 1 ?
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
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)                                   
                      }}
                      
                      label="Vial Batch number"                      
                      name="ecf_vial_batch"   
                      value = {values.ecf_vial_batch}                   
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Vaccine Dilution Time"
                    type="time"
                    name="ecf_dilution_time"
                    value = {values.ecf_dilution_time}                      
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Time of FIRST Immunization"
                    type="time"
                    name="ecf_first_immunization" 
                    value = {values.ecf_first_immunization}                     
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Time of LAST Immunization"
                    type="time"
                    name="ecf_last_immunization" 
                    value = {values.ecf_last_immunization}                     
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
                      min: (mature_weight_limits_status)? mature_weight_limits_min_value : "any",
                      max: (mature_weight_limits_status)? mature_weight_limits_max_value : "any",
                      step: "any",
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)               
                    }}
                    
                    label="Weight(Kgs)"
                    type="number"
                    name="ecf_vaccination_weight"  
                    value = {values.ecf_vaccination_weight}                    
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}               
                    
                    label="OTC 30% (ml)"
                    type="number"
                    name="ecf_vaccination_otc" 
                    value = {values.ecf_vaccination_otc}                     
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                 
                    
                    label="ALB 10% (ml)"
                    type="number"
                    name="ecf_vaccination_alb"  
                    value = {values.ecf_vaccination_alb}                  
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                 
                    
                    label="Temperature"
                    type="number"
                    name="ecf_vaccination_temp"  
                    value = {values.ecf_vaccination_temp}                    
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                                     
                    
                    label="Payment Mode"
                    name="ecf_vaccination_payment_modes"
                    value = {values.ecf_vaccination_payment_modes}
                    onChange={handleChange}                                                
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {paymentModes.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>
              </>

                : null
                } 
                {  parseInt(values.vacc_vaccine_type) === 1 ?
                null :

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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                                     
                    
                    label="Service Provider"
                    name="vacc_vaccine_provider"
                    value = {values.vacc_vaccine_provider}
                    onChange={handleChange}                                                
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {healthProvider.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>
                }

                {  parseInt(values.vacc_vaccine_provider) === -66 && parseInt(values.vacc_vaccine_type) !== 1 ? 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                                    
                    
                    label="Other Service Provider"
                    name="vacc_vaccine_provider_other"
                    value = {values.vacc_vaccine_provider_other}
                    onChange={handleChange}
                    variant="outlined"
                  />
                    
                </Grid>
                    : null
                  }
                  {  parseInt(values.vacc_vaccine_type) === 1 ? 
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
                   
                   label="Vaccination Cost"
                   name="ecf_vaccination_cost"
                   value = {values.ecf_vaccination_cost}
                   onChange={handleChange}  
                   variant="outlined"
                 />                    
                 </Grid> 
                 :
                  
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    type = 'number'
                    label="Drugs Cost"
                    name="vacc_vaccine_drug_cost"
                    value = {values.vacc_vaccine_drug_cost}
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Service Cost"
                    name="vacc_vaccine_service_cost"
                    value = {values.vacc_vaccine_service_cost}
                    onChange={handleChange}  
                    variant="outlined"
                  />                    
                  </Grid> 
                  </>
                }
                {  parseInt(values.vacc_vaccine_type) === 1 ? 
                null:
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
                    
                    label="Animal Status"
                    name="vacc_vaccine_cow_status"   
                    value = {values.vacc_vaccine_cow_status}                
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {healthStatus.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
                          </option>
                        ))
                    }           
                  </TextField>
                  </Grid> 
                }
                  {  parseInt(values.vacc_vaccine_cow_status) === -66 ? 
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
                    
                    label="Animal Status Other"
                    name="vacc_vaccine_cow_status_other"
                    value = {values.vacc_vaccine_cow_status_other}
                    onChange={handleChange}
                    variant="outlined"
                  />
                   
                  </Grid> 
                      : null
                  }

              {  parseInt(values.vacc_vaccine_type) === 1 ?
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Supervisor Vet Officer"
                    name="ecf_supervisor" 
                    value = {values.ecf_supervisor}               
                    onChange={handleChange}                                      
                    variant="outlined"
                    default = ""                              
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
                    
                    label="Vaccine Admin"
                    name="ecf_provider"  
                    value = {values.ecf_provider}              
                    onChange={handleChange}                                      
                    variant="outlined"
                    default = ""                              
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
        </>
              : null
            }
            
              </Grid>
          </CardContent>       
          <CardActions>          
         
            {readOnly ? null :                        
              <>    
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
              </>             
            }                             
         
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
      
        <EventMetaData
                Details={values}
                onClose={handleMetadataClose}
                open={openMetadata}
        /> 
          </Card>
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
