import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions} from '@material-ui/core';
import {getLookups,CreateOrEditHoofTreatmentRecord,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_hoof_treatment_add,endpoint_agent} from '../../../../../../../../configs/endpoints';
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
  const [hoofProblem, setHoofProblem] = useState([]);
  const [hoofTreatment, setHoofTreatment] = useState([]);
  const [agents, setAgents] = useState([]);


  const option  =  0;
  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_agents = true;

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
            let lookup_hoof_problem = []; 
            let lookup_hoof_treatment = []; 

            for (let i = 0; i< data.length; i++){               

              //Health Status
              if(data[i].list_type_id === 89){                
                lookup_health_status.push(data[i]);
              } 

              //Health Provider
              if(data[i].list_type_id === 47){                
                lookup_health_provider.push(data[i]);
              } 

              //Health Problem
              if(data[i].list_type_id === 97){                
                lookup_hoof_problem.push(data[i]);
              } 

              //Health Treatment
              if(data[i].list_type_id === 98){                
                lookup_hoof_treatment.push(data[i]);
              }    

                          
            }  
           
            setHealthStatus(lookup_health_status);
            setHealthProvider(lookup_health_provider); 
            setHoofProblem(lookup_hoof_problem);
            setHoofTreatment(lookup_hoof_treatment);                   
          }
        });
      })(endpoint_lookup,'47,89,97,98');
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false;      
    };
  }, [organization_id]);  

  if ( !agents ||!healthStatus || !healthProvider|| !hoofProblem || !hoofTreatment) {
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
    (async  (endpoint,id,values,user_id) => {     
      await  CreateOrEditHoofTreatmentRecord(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_hoof_treatment_add,animal_id,values,user_id);    
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
        <CardHeader title= {`NEW HOOF TREATMENT RECORD - ${animal_name}(${animal_tag}) `}/>  
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
                      defaultValue = {moment(new Date()).format('YYYY-MM-DD')}                      
                      margin = 'dense'
                      required
                      label="Treatment Date"
                      type="date"
                      name="treatment_date"                      
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
                    label="Hoof Problem"
                    name="hoof_problem"
                    required
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {
                      hoofProblem.map(x => (
                        <option                    
                          value={x.id}
                        >
                          {x.value}
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
                        label="Treatment Type"
                        name="hoof_treatment_type"
                        onChange={handleChange}
                        default = ""                              
                        select                      
                        SelectProps={{ native: true }}                    
                        variant="outlined"
                        >
                        <option value=""></option>
                        {hoofTreatment.map(x => (
                              <option                    
                                value={x.id}
                              >
                                {x.value}
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
                    margin = 'dense'
                    label="Other Treatment Type"
                    name="hoof_treatment_type_other"
                    onChange={handleChange} 
                    variant="outlined"
                    multiline
                    rowsMax ={3}
                    rows ={1}
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
                    label="Service Provider"
                    name="hoof_treatment_provider"
                    onChange={handleChange}                   
                    default = ""                              
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
                  {  parseInt(values.hoof_treatment_provider) === -66 ?  
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
                    label="Other Service Provider"
                    name="hoof_treatment_provider_other"
                    onChange={handleChange} 
                    variant="outlined"  
                    multiline
                    rowsMax ={3}  
                    rows ={1}              
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
                    margin = 'dense'
                    label="Drugs Cost"
                    name="hoof_treatment_drug_cost"
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
                    label="Service Cost"
                    name="hoof_treatment_service_cost"
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
                    label="Animal Status"
                    name="hoof_treatment_cow_status"
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

                  {  parseInt(values.hoof_treatment_cow_status) === -66 ?
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
                    label="Other Animal Status"
                    name="hoof_treatment_cow_status_other"
                    onChange={handleChange}   
                    variant="outlined"                 
                    multiline
                    rowsMax ={3}  
                    rows ={1}              
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
                    margin = 'dense'
                    label="Examinar"
                    name="field_agent_id"                
                    onChange={handleChange}
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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