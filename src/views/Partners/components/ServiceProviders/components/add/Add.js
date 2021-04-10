import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Typography, Grid, TextField,colors,Button,CardActions} from '@material-ui/core';
import {getLookups,getCountries,postServiceProvider}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_countries,endpoint_service_provider_add} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import { Page } from 'components';


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
  const [ {organization_id,user_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });  
  const [provideTypes, setProvideTypes] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    let mounted_lookup = true;
    let mounted_countries = true;

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            let lookup_provider_types = [];

            for (let i = 0; i< data.length; i++){
              if(data[i].list_type_id === 200){                
                lookup_provider_types.push(data[i]);
              }         
            }                    
            setProvideTypes(lookup_provider_types);
                        
          }
        });
      })(endpoint_lookup,'200'); 

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
      mounted_lookup = false; 
      mounted_countries = false; 
    };    
  }, []);  

  if (!provideTypes || !countries) {
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
    <Page
      className={classes.root}
      title="Service provider"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       SERVICE PROVIDER REGISTRATION
      </Typography>
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
                    md={6}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  
                    label="Service Provider Name"
                    name="name"                
                    onChange={handleChange}
                    variant="outlined" 
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
                  
                    label="Acronym"
                    name="acronym"                
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
                  
                    label="Service Provider Type"
                    name="service_provider_type"
                    onChange={handleChange}                    
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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
                  
                    label="Country"
                    name="country"
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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
                  
                    label="Postal Address"
                    name="postal_address"                
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
                  
                    label="Postal Code"
                    name="postal_code"                
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
                  
                    label="City/Town"
                    name="city"                
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
                  
                    label="Email"
                    name="email"  
                    type = 'email'              
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
                  
                    label="Phone Number"
                    name="phone_number"                
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
                  
                    label="Contact Person"
                    name="contact_person"                
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
                  
                    label="Contact Person Contact"
                    name="contact_person_mobile_number"                
                    onChange={handleChange}
                    variant="outlined"                                         
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
                  
                    required
                    label="Description"
                    name="description"  
                    multiline      
                    rowsMax = {4}  
                    rows={3}                    
                    onChange={handleChange}
                    variant="outlined" 
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
                  
                    required
                    label="Services Offered"
                    name="services_offered"  
                    multiline      
                    rowsMax = {4}
                    rows={3}                                               
                    onChange={handleChange}
                    variant="outlined" 
                />
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
