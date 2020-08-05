import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updateSync,getSyncByEventId}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_sync_update,endpoint_sync_specific} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventSyncMetaData}  from '../../../Modal';


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
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [hormone_sources, setHormoneSources] = useState([]);
  const [sync_numbers, setSyncNumbers] = useState([]);
  const [hormone_types, setHormoneTypes] = useState([]);
  const [sync_person, setSyncPerson] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const event_id  = localStorage.getItem('sync_event_id');  
  
 

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_sync = true;
    
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
          }
        });
      })(endpoint_sync_specific,event_id);
      
    return () => {
      mounted_lookup = false;
      mounted_sync = false;          
    };
  }, [event_id]);  

  if (!hormone_sources || !sync_numbers || !hormone_types ||!sync_person || !values) {
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
      await  updateSync(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);        
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_sync_update,event_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
        <CardHeader  title= { readOnly ? `View Synchronization Event Record  #${localStorage.getItem('animal_id')}`:`Edit Synchronization Event Record  #${localStorage.getItem('animal_id')}` } />
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)                
                      }}
                      required
                      margin = 'dense'
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
                      required
                      margin = 'dense'
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
                    margin = 'dense'
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
                      margin = 'dense'
                      label="Other Hormone Type"
                      name="other_hormone_type"
                      onChange={handleChange} 
                      variant="outlined"
                      value = {values.other_hormone_type}
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
                      margin = 'dense'
                      label="Hormone Source"
                      name="hormone_source"
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                      value = {values.hormone_source}
                    >
                      <option value=""></option>
                      {hormone_sources.map(source => (
                            <option                    
                              value={source.id}
                            >
                              {source.value}
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
                      margin = 'dense'
                      label="Other Hormone Source"
                      name="other_hormone_source"
                      onChange={handleChange}                                         
                      variant="outlined"
                      value = {values.other_hormone_source}
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
                      margin = 'dense'
                      label="Animal Parity"
                      name="animal_parity"                
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
                    margin = 'dense'
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
                        margin = 'dense'
                        label="Other Hormone Admin"
                        name="sync_other_person"
                        onChange={handleChange}
                        variant="outlined"
                        value = {values.sync_other_person}
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
                    margin = 'dense'
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
                    margin = 'dense'
                    label="Sync Cost"
                    name="cost"                                   
                    onChange={handleChange}
                    type="number"
                    variant="outlined"     
                    value = {values.cost}                                            
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
                    margin = 'dense'
                    label="Field Agent"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.field_agent_id}                   
                />
              </Grid>
            
              </Grid>
          </CardContent>
          <Divider />
          <CardActions>          
          <Box flexGrow={1}>
            {readOnly ? null :                        
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden = "true"                               
              >
                Save Changes
              </Button>              
            }                             
          </Box> 
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
        <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
        />
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />
        <EventSyncMetaData
                syncDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
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