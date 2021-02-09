import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,CreateOrEditVaccinationRecord,getAgents,getParametersLimitAll}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_vaccination_add,endpoint_agent,endpoint_parameter_limit_all} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
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
  const [ {user_id,organization_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ }); 

  const [healthStatus, setHealthStatus] = useState([]);
  const [healthProvider, setHealthProvider] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]);  
  const option  =  0;
  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_agents = true;
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
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false;    
      mounted_limit_parameters = false;  
    };
  }, [organization_id]);  

  if ( !agents ||!healthStatus || !healthProvider|| !vaccineTypes || !limitParameters ||!paymentModes) {
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
    (async  (endpoint,id,values,user_id) => {     
      await  CreateOrEditVaccinationRecord(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_vaccination_add,animal_id,values,user_id);    
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
        <CardHeader title= {`NEW VACCINATION RECORD - ${animal_name}(${animal_tag}) `}/>  
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
                      margin = 'dense'
                      required
                      label="Vaccination Date"
                      type="date"
                      name="vacc_vaccine_date"                      
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
                    label="Vaccine Type"
                    name="vacc_vaccine_type"
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
                      margin = 'dense'
                      label="Other Vaccine Type"
                      name="vacc_vaccine_type_other"
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
                      margin = 'dense'
                      label="Vial Batch number"                      
                      name="ecf_vial_batch"                      
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
                    label="Vaccine Dilution Time"
                    type="time"
                    name="ecf_dilution_time"                      
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
                    label="Time of FIRST Immunization"
                    type="time"
                    name="ecf_first_immunization"                      
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
                    label="Time of LAST Immunization"
                    type="time"
                    name="ecf_last_immunization"                      
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
                      step: "any"               
                    }}
                    margin = 'dense'
                    label="Weight(Kgs)"
                    type="number"
                    name="ecf_vaccination_weight"                      
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
                    label="OTC 30% (ml)"
                    type="number"
                    name="ecf_vaccination_otc"                      
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
                    label="ALB 10% (ml)"
                    type="number"
                    name="ecf_vaccination_alb"                      
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
                    label="Temperature"
                    type="number"
                    name="Temperature"                      
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
                    margin = 'dense'
                    label="Payment Mode"
                    name="ecf_vaccination_payment_modes"
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
                    margin = 'dense'
                    label="Service Provider"
                    name="vacc_vaccine_provider"
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
                    margin = 'dense'
                    label="Other Service Provider"
                    name="vacc_vaccine_provider_other"
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
                   margin = 'dense'
                   label="Vaccination Cost"
                   name="ecf_vaccination_cost"
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
                    margin = 'dense'
                    type = 'number'
                    label="Drugs Cost"
                    name="vacc_vaccine_drug_cost"
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
                    label="Service Cost"
                    name="vacc_vaccine_service_cost"
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
                    margin = 'dense'
                    label="Animal Status"
                    name="vacc_vaccine_cow_status"                   
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
                    margin = 'dense'
                    label="Animal Status Other"
                    name="vacc_vaccine_cow_status_other"
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
                    margin = 'dense'
                    label="Supervisor Vet Officer"
                    name="ecf_supervisor"                
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
                    margin = 'dense'
                    label="Vaccine Admin"
                    name="ecf_provider"                
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