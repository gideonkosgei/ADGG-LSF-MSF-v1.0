import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Typography, Grid,TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,CreateOrEditParasiteInfectionRecord,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_parasite_infection_add,endpoint_agent} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import moment from 'moment';
import { Page } from 'components';
import {default as Header} from '../../../../../Header/index';

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
  }
}));

const Edit = props => {    
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ }); 

  const [healthStatus, setHealthStatus] = useState([]);
  const [healthProvider, setHealthProvider] = useState([]);
  const [parasiteTypes, setParasiteTypes] = useState([]);
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
            let lookup_parasite_types= []; 

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
                if(data[i].list_type_id === 90){                
                  lookup_parasite_types.push(data[i]);
                }                    
            }  
            setHealthStatus(lookup_health_status);
            setHealthProvider(lookup_health_provider);
            setParasiteTypes(lookup_parasite_types);     
          }
        });
      })(endpoint_lookup,'89,47,90');
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false;      
    };
  }, [organization_id]);  

  if ( !agents ||!healthStatus || !healthProvider|| !parasiteTypes) {
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
      await  CreateOrEditParasiteInfectionRecord(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_parasite_infection_add,animal_id,values,user_id);    
  };
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

 
  return (
    <Page
      className={classes.root}
      title="Parasite Infection"
    >
       <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
      {`NEW PARASITE INFECTION RECORD - ${animal_name}(${animal_tag}) `}
      </Typography>
      <br/> 
      <Header />
      <br/>  
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
                      label="Date Of Treatment"
                      type="date"
                      name="parasite_date"                      
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
                    
                    label="Parasite Type"
                    name="parasite_type"
                    required
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {
                      parasiteTypes.map(x => (
                        <option                    
                          value={x.id}
                        >
                          {x.value}
                        </option>
                      ))
                    }           
                  </TextField>
                </Grid>
                {  parseInt(values.parasite_type) === -66 ? 
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
                      
                      label="Other Parasite Type"
                      name="parasite_type_other"
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
                    
                    label="Service Provider"
                    name="parasite_provider"
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
                {  parseInt(values.parasite_provider) === -66 ? 
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
                    
                    label="Other Service Provider"
                    name="parasite_provider_other"
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
                    
                    type = 'number'
                    label="Drugs Cost"
                    name="parasite_drug_cost"
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
                    
                    label="Service Cost"
                    name="parasite_service_cost"
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
                    
                    label="Animal Status"
                    name="parasite_cow_status"
                    required
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
                  {  parseInt(values.parasite_cow_status) === -66 ? 
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
                    
                    label="Animal Status Other"
                    name="parasite_cow_status_other"
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
                    
                    label="Examinar"
                    name="field_agent_id"                
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
            
              </Grid>
          </CardContent>        
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
        
    
     
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
