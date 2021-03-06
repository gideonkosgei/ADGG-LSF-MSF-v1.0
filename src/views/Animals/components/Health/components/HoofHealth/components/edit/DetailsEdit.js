import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,CreateOrEditHoofHealthRecord,getHoofHealth,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_hoof_health_edit,endpoint_hoof_health_get,endpoint_agent} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventMetaData}  from '../../../../../Modal';
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
  const [digital_dermatitis_options, setDigitalDermatitis] = useState([]);
  const [hoof_health_options, setHoofHealth] = useState([]);
  const [agents, setAgents] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);  
  const record_id  = sessionStorage.getItem('hoof_health_record_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name'); 
  const option  =  0;

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_hoof_records = true;  
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
          let lookup_digital_dermatitis = [];  
          let lookup_hoof_health = []; 

          for (let i = 0; i< data.length; i++){ 
             //Digital Dermatitis
             if(data[i].list_type_id === 95){                
              lookup_digital_dermatitis.push(data[i]);
            } 

            //Hoof Health
            if(data[i].list_type_id === 96){                
              lookup_hoof_health.push(data[i]);
            }                         
          } 
          setDigitalDermatitis(lookup_digital_dermatitis);
          setHoofHealth(lookup_hoof_health); 
        }
      });
    })(endpoint_lookup,'95,96');      

      (async  (endpoint,id,option) => {     
        await  getHoofHealth(endpoint,id,option)
        .then(response => {                        
          if (mounted_hoof_records) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_hoof_health_get,record_id,2);
      

      
    return () => {
      mounted_lookup = false;  
      mounted_hoof_records = false;   
      mounted_agents = false;  
    };
  }, [record_id,organization_id]);  

  if (!values || !agents ||!digital_dermatitis_options || !hoof_health_options) {
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
      await  CreateOrEditHoofHealthRecord(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_hoof_health_edit,record_id,values,user_id);    
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
       <CardHeader  title= { readOnly ? `HOOF HEALTH - ${animal_name}(${animal_tag})` :`EDIT HOOF HEALTH - ${animal_name}(${animal_tag})`} />
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
                        readOnly: true,
                        disabled: true,
                        max: moment(new Date()).format('YYYY-MM-DD')               
                      }}               
                      margin = 'dense'
                      required
                      label="Examination Date"
                      type="date"
                      name="exam_date"   
                      value = {values.exam_date}                   
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

                    margin = 'dense'
                    label="Digital dermatitis"
                    name="digital_dermatitis"
                    value = {values.digital_dermatitis}        
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {
                      digital_dermatitis_options.map(x => (
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
                      margin = 'dense'
                      label="Interdigital Hyperplasia"
                      name="interdigital_hyperplasia"                       
                      value = {values.interdigital_hyperplasia}
                      onChange={handleChange}                     
                      default = ""                              
                      select                      
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Interdigital Phlegmon"
                    name="interdigital_phlegmon"
                    value = {values.interdigital_phlegmon}
                    onChange={handleChange}                                                
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Scissor claws"
                    name="scissor_claws"
                    value = {values.scissor_claws}
                    onChange={handleChange}                   
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Horizontal horn fissure"
                    name="horizontal_horn_fissure"
                    value = {values.horizontal_horn_fissure}
                    onChange={handleChange}                    
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Vertical horn fissure"
                    name="vertical_horn_fissure"
                    value = {values.vertical_horn_fissure}
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Swelling of coronet and/or bulb"
                    name="swelling_of_coronet"
                    value = {values.swelling_of_coronet}
                    onChange={handleChange}                   
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Heel horn erosion"
                    name="heel_horn_erosion"
                    value = {values.heel_horn_erosion}
                    onChange={handleChange}                    
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
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
                    margin = 'dense'
                    label="Other hoof problems"
                    name="other_hoof_problems"  
                    value = {values.other_hoof_problems}                                 
                    onChange={handleChange}                    
                    variant="outlined"   
                    multiline 
                    rowsMax = {5}
                    rows={1}                                               
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
        <EventMetaData
                Details={values}
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