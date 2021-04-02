import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Typography,Switch } from '@material-ui/core';
import {getLookups,postSync,getServiceProviders,getAgents,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_sync_add,endpoint_service_provider,endpoint_agent,endpoint_dp_validations} from '../../../../../../configs/endpoints';
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
  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const option  =  0;

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

  //console.log(sync_person);
  
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
      await  postSync(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_sync_add,animal_id,values,user_id);    
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
    >   
    {
            (parseInt(validations.length) === 0 || override) ?
          <>     
      <CardHeader title= {`NEW SYNCHRONIZATION RECORD - ${animal_name}(${animal_tag}) `}/>  
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
                      required
                      margin = 'dense'
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
                      margin = 'dense'
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
                    margin = 'dense'
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
                      margin = 'dense'
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
                        margin = 'dense'
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
                      margin = 'dense'
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
                      margin = 'dense'
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
                    margin = 'dense'
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
                        margin = 'dense'
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
                      margin = 'dense'
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
                    margin = 'dense'
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
                    margin = 'dense'
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