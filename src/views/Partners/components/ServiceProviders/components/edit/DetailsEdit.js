import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions} from '@material-ui/core';
import {getLookups,getCountries,getServiceProviders,postServiceProvider}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_countries,endpoint_service_provider,endpoint_service_provider_add} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';

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
  const [provideTypes, setProvideTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  
  const provider_id  = localStorage.getItem('provider_id'); 

  useEffect(() => {
    let mounted_lookup = true;
    let mounted_countries = true;
    let mounted_sp = true;
    

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            let lookup_provider_types = [];

            for (let i = 0; i< data.length; i++){
              if(data[i].list_type_id === 84){                
                lookup_provider_types.push(data[i]);
              }         
            }                    
            setProvideTypes(lookup_provider_types);
                        
          }
        });
      })(endpoint_lookup,'84'); 

      (async  (endpoint) => {     
        await  getCountries(endpoint)
        .then(response => {       
          if (mounted_countries) { 
            const data = response.payload;           
            setCountries(data);               
          }
        });
      })(endpoint_countries);

      (async  (endpoint,id,option) => {     
        await  getServiceProviders(endpoint,id,option)
        .then(response => {                        
          if (mounted_sp) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_service_provider,provider_id,1);       
        
    return () => {
      mounted_lookup = false; 
      mounted_countries = false; 
      mounted_sp = false; 
    };    
  }, [organization_id,provider_id]);  

  if (!provideTypes || !countries || !values) {
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
    (async  (endpoint,values,user_id,org_id) => {     
      await  postServiceProvider(endpoint,values,user_id,org_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_service_provider_add,values,user_id,organization_id);    
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
      
        <CardHeader title="Service Provider Registration" />
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
                    md={6}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin = 'dense'
                    label="Service Provider Name"
                    name="name"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.name}
                    required                     
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
                    label="Acronym"
                    name="acronym"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.acronym}                                       
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
                    label="Service Provider Type"
                    name="service_provider_type"
                    onChange={handleChange}                    
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.service_provider_type_id}
                  >
                    <option value=""></option>
                    {provideTypes.map(provider => (
                          <option                    
                            value={provider.id}
                          >
                            {provider.value}
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
                    label="Country"
                    name="country"
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
                    margin = 'dense'
                    label="Email"
                    name="email"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.email} 
                    type = 'email'                                       
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
                    label="Phone Number"
                    name="phone_number"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.phone}                                        
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
                    label="Contact Person"
                    name="contact_person"                
                    onChange={handleChange}
                    variant="outlined"
                    value = {values.contact_person}                                         
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
                    label="Contact Person Contact"
                    name="contact_person_mobile_number"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.contact_person_mobile_number}                                        
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
                    margin = 'dense'
                    required
                    label="Description"
                    name="description"  
                    multiline      
                    rowsMax = {4}  
                    rows={3}                    
                    onChange={handleChange}
                    variant="outlined"
                    value = {values.description} 
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
                    margin = 'dense'
                    required
                    label="Services Offered"
                    name="services_offered"  
                    multiline      
                    rowsMax = {4}
                    rows={3}                                               
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.services_offered}
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
        
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;