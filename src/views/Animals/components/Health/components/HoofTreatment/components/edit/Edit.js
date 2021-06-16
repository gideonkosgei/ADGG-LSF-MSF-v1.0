import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,CircularProgress,Fab, LinearProgress, Grid, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,CreateOrEditHoofTreatmentRecord,getHoofTreatment,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_hoof_treatment_edit,endpoint_hoof_treatment_get,endpoint_agent} from '../../../../../../../../configs/endpoints';
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
  sessionStorage.setItem('hoof_treatment_record_id', parseInt(props.match.params.id));  
  const [ {user_id,organization_id} ] = useContext(authContext);
  const [values, setValues] = useState({ });   
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);  
  const record_id  = sessionStorage.getItem('hoof_treatment_record_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag'); 
  const [agents, setAgents] = useState([]);
  const [healthStatus, setHealthStatus] = useState([]);
  const [healthProvider, setHealthProvider] = useState([]);
  const [hoofProblem, setHoofProblem] = useState([]);
  const [hoofTreatment, setHoofTreatment] = useState([]);
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
    let mounted_hoof_treatment = true;  
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

    (async  (endpoint,id,option) => {     
      await  getHoofTreatment(endpoint,id,option)
      .then(response => {                        
        if (mounted_hoof_treatment) {            
          setValues(response.payload[0]);    
          setIsLoading(false);               
        }
      });
    })(endpoint_hoof_treatment_get,record_id,2);
      

      
    return () => {
      mounted_lookup = false;  
      mounted_hoof_treatment = false;   
      mounted_agents = false;  
    };
  }, [record_id,organization_id]);  

  if (!healthStatus || !healthProvider|| !hoofProblem || !hoofTreatment ||!values || !agents) {
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
      await  CreateOrEditHoofTreatmentRecord(endpoint,id,values,user_id)
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
    })(endpoint_hoof_treatment_edit,record_id,values,user_id);    
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
      title="Hoof Treatment"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       { readOnly ? `HOOF TREATEMENT : ${animal_tag}` :`EDIT HOOF TREATEMENT : ${animal_tag}`}
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
                      defaultValue = {moment(new Date()).format('YYYY-MM-DD')}                      
                      
                      required
                      label="Treatment Date"
                      type="date"
                      name="treatment_date" 
                      value = {values.treatment_date}                      
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
                    
                    label="Hoof Problem"
                    name="hoof_problem"
                    value = {values.hoof_problem} 
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
                        inputProps={{
                          readOnly: Boolean(readOnly),
                          disabled: Boolean(readOnly)                                   
                        }}
                                              
                        label="Treatment Type"
                        name="hoof_treatment_type"
                        value = {values.hoof_treatment_type} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}                                    
                    
                    label="Other Treatment Type"
                    name="hoof_treatment_type_other"
                    value = {values.hoof_treatment_type_other} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Service Provider"
                    name="hoof_treatment_provider"
                    value = {values.hoof_treatment_provider} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Other Service Provider"
                    name="hoof_treatment_provider_other"
                    value = {values.hoof_treatment_provider_other} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Drugs Cost"
                    name="hoof_treatment_drug_cost"
                    value = {values.hoof_treatment_drug_cost} 
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Service Cost"
                    name="hoof_treatment_service_cost"
                    value = {values.hoof_treatment_service_cost} 
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Animal Status"
                    name="hoof_treatment_cow_status"
                    value = {values.hoof_treatment_cow_status} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Other Animal Status"
                    name="hoof_treatment_cow_status_other"
                    value = {values.hoof_treatment_cow_status_other} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}
                    
                    label="Examinar"
                    name="field_agent_id"  
                    value = {values.field_agent_id}               
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
