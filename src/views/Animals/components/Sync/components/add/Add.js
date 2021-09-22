import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab,CircularProgress, Grid,Divider, TextField,colors,Button,CardActions,Box,Typography,Switch } from '@material-ui/core';
import {getLookups,postSync,getServiceProviders,getAgents,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_sync_add,endpoint_service_provider,endpoint_agent,endpoint_dp_validations} from '../../../../../../configs/endpoints';
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
  const [ {user_id,username,organization_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ }); 
  const [sync_numbers, setSyncNumbers] = useState([]);
  const [hormone_types, setHormoneTypes] = useState([]);
  const [sync_person, setSyncPerson] = useState([]);
  const [service_providers, setServiceProviders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [validations, setValidations] = useState([]);
  const [override, setOverride] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();
  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');  
  const  dob = sessionStorage.getItem('animal_dob'); 
  const option  =  0;

  
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  }); 

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_sp = true;
    let mounted_agents = true;
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
  })(endpoint_dp_validations,'event-sync-validation',5,animal_id);


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
            }  
                   
            setSyncNumbers(lookup_sync_number);
            setHormoneTypes(lookup_hormone_type);
            setSyncPerson(lookup_sync_person);                       
          }
        });
      })(endpoint_lookup,'74,75,76,77');
      
    return () => {
      mounted_lookup = false;  
      mounted_sp = false; 
      mounted_agents = false;
      mounted_validations  = false;
    };
  }, [organization_id,animal_id]);  

  if ( !sync_numbers || !hormone_types ||!sync_person || !service_providers || !agents || !validations) {
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
      await  postSync(endpoint,id,values,user_id)
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
    })(endpoint_sync_add,animal_id,values,user_id);    
  }; 
  

  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);   
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
       {`NEW SYNCHRONIZATION RECORD : ${animal_tag}`}
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
                                max: moment(new Date()).format('YYYY-MM-DD'),
                                min : dob     
                              }}
                              defaultValue = {moment(new Date()).format('YYYY-MM-DD')}
                              required
                             
                              label = "Sync Date"
                              type = "date"
                              name = "sync_date"                      
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
                              
                              defaultValue = {moment(new Date()).format('HH:MM')}                    
                             
                              label="Sync Time"
                              type="time"
                              name="sync_time"                      
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
                           
                            label="Sync Number"
                            name="sync_number"
                            onChange={handleChange}
                            required
                            default = ""                              
                            select
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
                             
                              label="Hormone Type"
                              name="hormone_type"
                              onChange={handleChange}
                              required
                              default = ""                              
                              select
                              // eslint-disable-next-line react/jsx-sort-props
                              SelectProps={{ native: true }}                    
                              variant="outlined"
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
                               
                                label="Other Hormone Type"
                                name="other_hormone_type"
                                onChange={handleChange} 
                                variant="outlined"
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
                             
                              label="Hormone Source"
                              name="hormone_source"
                              onChange={handleChange} 
                              required                                               
                              select
                              // eslint-disable-next-line react/jsx-sort-props
                              SelectProps={{ native: true }}                    
                              variant="outlined"
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
                             
                              type="number"
                              label="Animal Parity"
                              name="animal_parity"                

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
                           
                            label="Hormone Admin"
                            name="sync_person"
                            onChange={handleChange}
                            //required
                            default = ""                              
                            select
                            required
                            // eslint-disable-next-line react/jsx-sort-props
                            SelectProps={{ native: true }}                    
                            variant="outlined"
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
                             
                              label="H. Admin Name (other)"
                              name="sync_other_person" 
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
                           
                            label="Hormone Admin Mobile No"
                            name="sync_person_phone"                
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
                            //required
                           
                            label="Sync Cost"
                            name="cost"                                   
                            onChange={handleChange}
                            type="number"
                            variant="outlined"                                                 
                          />
                        </Grid>
                          
                    
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
