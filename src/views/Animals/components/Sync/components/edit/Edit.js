import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab,CircularProgress, LinearProgress, Grid, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updateSync,getSyncByEventId,getServiceProviders,getAgents}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_sync_update,endpoint_sync_specific,endpoint_service_provider,endpoint_agent} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventSyncMetaData}  from '../../../Modal';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';
import clsx from 'clsx';
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
  const classes = useStyles();
  localStorage.setItem('sync_event_id', parseInt(props.match.params.id));   
  const [ {user_id,username,organization_id} ] = useContext(authContext);
  const [values, setValues] = useState({ });
  const [hormone_sources, setHormoneSources] = useState([]);
  const [sync_numbers, setSyncNumbers] = useState([]);
  const [hormone_types, setHormoneTypes] = useState([]);
  const [sync_person, setSyncPerson] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const event_id  = localStorage.getItem('sync_event_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag');   
  const [service_providers, setServiceProviders] = useState([]);
  const [agents, setAgents] = useState([]);
  const option  =  0;
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState({status:null, message:""}); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_sync = true;
    let mounted_sp = true;
    let mounted_agents = true;


    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_sp) {            
          setServiceProviders(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,option); 

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
            let lookup_sync_number = [];
            let lookup_hormone_type = [];
            let lookup_sync_person = [];
            let lookup_hormone_source = [];

            for (let i = 0; i< data.length; i++){              
              //sync numbers
              if(data[i].list_type_id === 75){                
                lookup_sync_number.push(data[i]);
              } 

              //hormone type
              if(data[i].list_type_id === 76){                
                lookup_hormone_type.push(data[i]);
              }  
              //sync person
              if(data[i].list_type_id === 77){                
                lookup_sync_person.push(data[i]);
              } 

              //hormone sources
              if(data[i].list_type_id === 74){                
                lookup_hormone_source.push(data[i]);
              }               
            }  
                   
            setSyncNumbers(lookup_sync_number);
            setHormoneTypes(lookup_hormone_type);
            setSyncPerson(lookup_sync_person);
            setHormoneSources(lookup_hormone_source);            
          }
        });
      })(endpoint_lookup,'74,75,76,77');
      
      (async  (endpoint,id) => {             
        await  getSyncByEventId(endpoint,id)
        .then(response => {       
          if (mounted_sync) { 
            const data = response.payload[0][0];                       
            setValues(data);  
            setIsLoading(false);                        
          }
        });
      })(endpoint_sync_specific,event_id);
      
    return () => {
      mounted_lookup = false;
      mounted_sync = false;  
      mounted_sp = false;  
      mounted_agents = false;       
    };
  }, [event_id,organization_id]);  

  if (!hormone_sources || !sync_numbers || !hormone_types ||!sync_person || !values|| !service_providers || !agents) {
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
      await  updateSync(endpoint,id,values,user_id)
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
    })(endpoint_sync_update,event_id,values,user_id);    
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
      title="Sync"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       { readOnly ? `SYNCHRONIZATION : ${animal_tag}` :`EDIT SYNCHRONIZATION : ${animal_tag}`} 
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),
                        max: moment(new Date()).format('YYYY-MM-DD')                 
                      }}                     
                      defaultValue = {moment(new Date()).format('YYYY-MM-DD')}
                      required
                      
                      label = "Sync Date"
                      type = "date"
                      name = "sync_date"                      
                      onChange = {handleChange}
                      variant = "outlined"
                      value = {values.sync_date}
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
                      defaultValue = {moment(new Date()).format('HH:MM')}                    
                      
                      label="Sync Time"
                      type="time"
                      name="sync_time"                      
                      onChange={handleChange}
                      variant="outlined" 
                      value = {values.sync_time}                     
                                  
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
                    
                    label="Sync Number"
                    name="sync_number"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    value = {values.sync_number}
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {sync_numbers.map(number => (
                          <option                    
                            value={number.id}
                          >
                            {number.value}
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
                      
                      label="Hormone Type"
                      name="hormone_type"
                      onChange={handleChange}
                      required
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                      value = {values.hormone_type}
                    >
                      <option value=""></option>
                      {hormone_types.map(type => (
                            <option                    
                              value={type.id}
                            >
                              {type.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid>
                  {
                    (parseInt(values.hormone_type) === 3) ? 
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
                      
                      label="Other Hormone Type"
                      name="other_hormone_type"
                      onChange={handleChange} 
                      variant="outlined"
                      value = {values.other_hormone_type}
                    />                      
                  </Grid>
                  : null
                  }
                 
                  <Grid
                      item
                      md={6}
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
                      
                      label="Hormone Source"
                      name="hormone_source"
                      onChange={handleChange} 
                      required                                                                     
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                      value = {values.hormone_source}
                    >
                      <option value=""></option>
                        {service_providers.map(service_provider => (
                              <option                    
                                value={service_provider.id}
                              >
                                {service_provider.name}
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
                      
                      label="Animal Parity"
                      name="animal_parity" 
                      type="number"               
                      onChange={handleChange}
                      variant="outlined"  
                      value = {values.animal_parity}                      
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
                    required
                    
                    label="Hormone Admin"
                    name="sync_person"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined" 
                    value = {values.sync_person}
                  >
                    <option value=""></option>
                    {sync_person.map(person => (
                          <option                    
                            value={person.id}
                          >
                            {person.value}
                          </option>
                        ))
                    }           
                  </TextField>
                  </Grid> 
                  {  
                   isNaN(values.sync_person) || values.sync_person ==='' || parseInt(values.sync_person) === -66? null :        
                                  
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
                        
                        label=" H. Admin Name (self)"
                        name="field_agent_id"
                        onChange={handleChange}
                        variant="outlined"
                        value = {username}
                      />
                        
                  </Grid> 
                   }
                   {
                     isNaN(values.sync_person) || values.sync_person ==='' || parseInt(values.sync_person) ===1 ? null :
                                   
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
                          disabled: Boolean(readOnly)                
                        }}
                        
                        label="Other Hormone Admin"
                        name="sync_other_person"
                        onChange={handleChange}
                        variant="outlined"
                        value = {values.sync_other_person}
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
                    
                    label="Hormone Admin Mobile No"
                    name="sync_person_phone"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.sync_person_phone}
                    
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
                    //required
                    
                    label="Sync Cost"
                    name="cost"                                   
                    onChange={handleChange}
                    type="number"
                    variant="outlined"     
                    value = {values.cost}                                            
                  />
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
        <EventSyncMetaData
                syncDetails={values}
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
