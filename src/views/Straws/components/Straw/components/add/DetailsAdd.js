import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions} from '@material-ui/core';
import {getLookups,postStraw,getServiceProviders,getCountries}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_straw_add,endpoint_service_provider,endpoint_countries} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
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
  const [ {organization_id,user_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [specifications, setSpecification] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [breedCompositions, setBreedCompositions] = useState([]);
  const [service_providers, setServiceProviders] = useState([]);
  const [countries, setCountries] = useState([]);
  const option  =  0;
 
  useEffect(() => {
    let mounted_lookup = true; 
    let mounted_sp = true;  
    let mounted_countries = true;

    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                 
        }
      });
    })(endpoint_countries); 
    
    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_sp) {            
          setServiceProviders(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,option); 

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            
            let lookup_specification = [];
            let lookup_breed = [];
            let lookup_breed_composition = [];

            for (let i = 0; i< data.length; i++){
              //specifications
              if(data[i].list_type_id === 201){                
                lookup_specification.push(data[i]);
              } 
              //main breeds
              if(data[i].list_type_id === 8){                
                lookup_breed.push(data[i]);
              }
              //breed Composition
              if(data[i].list_type_id === 14){                
                lookup_breed_composition.push(data[i]);
              }          
            }                    
            setSpecification(lookup_specification);
            setBreedCompositions(lookup_breed_composition);
            setBreeds(lookup_breed);
            
                        
          }
        });
      })(endpoint_lookup,'201,8,14'); 
    return () => {
      mounted_lookup = false;  
      mounted_sp = false;
      mounted_countries = false;  
    };    
  }, [organization_id]);  

  if (!breeds || !breedCompositions || !specifications || !service_providers || !countries) {
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
      await  postStraw(endpoint,values,user_id,org_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_straw_add,values,user_id,organization_id);    
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
      
        <CardHeader title="AI Straw Registration" />
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
                    label="Semen Source"
                    name="semen_source"                
                    onChange={handleChange}
                    variant="outlined" 
                    required 
                    select                    
                    SelectProps={{ native: true }}  
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
                    label="Farm Name/ID"
                    name="farm_name"                
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
                    required
                    margin = 'dense'
                    label="Straw ID"
                    name="straw_id"                
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
                    label="Semen Bar Code"
                    name="barcode"                
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
                    required                
                    margin = 'dense'
                    label="Batch Number"
                    name="batch_number"                
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
                    label="Bull ID / Tag ID"
                    name="bull_tag_id"                
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
                    label="Bull Name"
                    name="bull_name"                
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
                    label="Breed of Bull"
                    name="breed"
                    required
                    onChange={handleChange}                    
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {breeds.map(breed => (
                          <option                    
                            value={breed.id}
                          >
                            {breed.value}
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
                    label="Bull Breed Composition"
                    name="breed_composition"
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {breedCompositions.map(comp => (
                          <option                    
                            value={comp.id}
                          >
                            {comp.value}
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
                    label="Ejaculation Number"
                    name="ejaculation_number"                
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
                    max: moment(new Date()).format('YYYY-MM-DD')                 
                  }}                  
                  
                  margin = 'dense'
                  label="Production Date"
                  type="date"
                  name="production_date"                 
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
                    margin = 'dense'
                    label="Bull Origin Country"
                    name="origin_country"                
                    onChange={handleChange}
                    variant="outlined" 
                    required 
                    select                    
                    SelectProps={{ native: true }}  
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
                    label="Specification"
                    name="specification"
                    onChange={handleChange}  
                    required                 
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {specifications.map(spec => (
                          <option                    
                            value={spec.id}
                          >
                            {spec.value}
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
                    margin = 'dense'                 
                    label="Additional Info"
                    name="additional_info"  
                    multiline      
                    rowsMax = {4}
                    rows={3}                                               
                    onChange={handleChange}
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
        
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;