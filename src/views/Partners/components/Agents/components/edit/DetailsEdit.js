import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Typography,Box,Switch,Tooltip} from '@material-ui/core';
import {getCountries,getServiceProviders,putAgents,getAgents}   from '../../../../../../utils/API';
import {endpoint_countries,endpoint_service_provider,endpoint_agent_edit,endpoint_agent} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {MetaData}  from '../Modal';
 
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
  const [ {organization_id,user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [affiliates, setAffiliates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  
  
  const agent_id  = localStorage.getItem('agent_id'); 
  

  useEffect(() => {    
    let mounted_countries = true;
    let mounted_affiliates = true;
    let mounted_agents = true;
    
    

    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_affiliates) {            
          setAffiliates(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,0);  
    
    (async  (endpoint,id,option) => {     
      await  getAgents(endpoint,id,option)
      .then(response => {                        
        if (mounted_agents) {            
          setValues(response.payload[0]);                 
        }
      });
    })(endpoint_agent,agent_id,1);   
    
   
    
      (async  (endpoint) => {     
        await  getCountries(endpoint)
        .then(response => {       
          if (mounted_countries) { 
            const data = response.payload;           
            setCountries(data);               
          }
        });
      })(endpoint_countries);
 
    return () => {      
      mounted_countries = false; 
      mounted_affiliates = false; 
      mounted_agents = false;
    };    
  }, [organization_id,agent_id]);  

  if (!affiliates || !countries || !values ) {
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
    (async  (endpoint,values,user_id,id) => {     
      await  putAgents(endpoint,values,user_id,id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_agent_edit,values,user_id,agent_id);    
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
        <CardHeader title= { readOnly ? `AGENT #${agent_id}`:`EDIT AGENT #${agent_id}` } />
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
                             
                             margin = 'dense'
                             label="Agent Name"
                             name="name"                
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.name}                                        
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
                             label="Occupation"
                             name="occupation"                
                             onChange={handleChange}
                             variant="outlined"  
                             value = {values.occupation}                                       
                         />
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
                             label="Affiliation"
                             name="affiliation_id"
                             onChange={handleChange}                    
                             default = ""                              
                             select
                             // eslint-disable-next-line react/jsx-sort-props
                             SelectProps={{ native: true }}                    
                             variant="outlined"
                             value = {values.affiliation_id}
                           >
                             <option value=""></option>
                             {affiliates.map(affiliate => (
                                   <option                    
                                     value={affiliate.id}
                                   >
                                     {affiliate.name}
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
                             label="Country"
                             name="country_id"
                             onChange={handleChange}                   
                             default = ""                              
                             select                    
                             SelectProps={{ native: true }}                    
                             variant="outlined"
                             value = {values.country_id}
                           >
                             <option value=""></option>
                             {countries.map(country => (
                                   <option                    
                                     value={country.id}
                                   >
                                     {country.name}
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
                             label="Physical Address"
                             name="physical_address"                
                             onChange={handleChange}
                             variant="outlined"  
                             value = {values.physical_address}                                       
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
                             label="Postal Address"
                             name="postal_address"                
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.postal_address}                                        
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
                             label="Postal Code"
                             name="postal_code"                
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.postal_code}                                        
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
                             label="City/Town"
                             name="city"                
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.city}                                        
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
                             label="Email"
                             name="email"  
                             type = 'email'              
                             onChange={handleChange}
                             variant="outlined"  
                             value = {values.email}                                       
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
                             label="Phone Number"
                             name="phone"                
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.phone}                                        
                         />
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
                             required
                             label="Specialization"
                             name="speciality"  
                             multiline      
                             rowsMax = {5}
                             rows={4}                                               
                             onChange={handleChange}
                             variant="outlined" 
                             value = {values.speciality}
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
        <MetaData
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