import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab,CircularProgress, Typography, Grid,TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,CreateOrEditParasiteInfectionRecord,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_parasite_infection_add,endpoint_agent} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import moment from 'moment';
import { Page } from 'components';
import {default as Header} from '../../../../../Header/index';
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
  const  dob = sessionStorage.getItem('animal_dob'); 
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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async  (endpoint,id,values,user_id) => {     
      await  CreateOrEditParasiteInfectionRecord(endpoint,id,values,user_id)
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
    })(endpoint_parasite_infection_add,animal_id,values,user_id);    
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
      {`NEW PARASITE INFECTION RECORD : ${animal_tag}`}
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
                        max: moment(new Date()).format('YYYY-MM-DD'),
                        min : dob                 
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
        
    
     
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
