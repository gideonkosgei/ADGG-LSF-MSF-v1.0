import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Typography, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postExit,getCountries,getAdminUnits}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_exit_add,endpoint_countries,endpoint_admin_units} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';


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
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });
  const [exitTypes, setExitTypes] = useState([]);   
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [villages, setVillages] = useState([]);

  async function adminUnits (endpoint,unit,option){ 
    await  getAdminUnits(endpoint,unit,option)
    .then(response => {

      if(option ===1){ 
        if(isNaN(unit)){
          setRegions([]);
        } else {
          setRegions(response.payload[0]); 
        }
        
        setDistricts([]);
        setWards([]);
        setVillages([]);
      }

      if(option ===2){  

        if(isNaN(unit)){
          setDistricts([]);
        } else {
          setDistricts(response.payload[0]); 
        } 
          setWards([]);
          setVillages([]);
        }

      if(option ===3){
        if(isNaN(unit)){
          setWards([]);
        } else {
          setWards(response.payload[0]); 
        } 
        setVillages([]);
      }
      if(option ===4){   
        if(isNaN(unit)){
          setVillages([]);
        } else {
          setVillages(response.payload[0]); 
        }     
       
      }
      
    });
  };

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_countries = true;

    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                 
        }
      });
    })(endpoint_countries); 
    
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];                        
            let lookup_exit_types = [];                    

            for (let i = 0; i< data.length; i++){
              // exit types
              if(data[i].list_type_id === 82){                
                lookup_exit_types.push(data[i]);
              }  
            }  
            setExitTypes(lookup_exit_types);           
          }
        });
      })(endpoint_lookup,'82');
      
    return () => {
      mounted_lookup = false;
      mounted_countries  = false;    
    };
  }, []);   

  if (!exitTypes || !countries) {
    return null;
  }

 

    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value
    });

    if (event.target.name === 'new_country'){
      adminUnits(endpoint_admin_units,parseInt(event.target.value),1);
    }  
    
    if (event.target.name === 'new_region'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),2);      
    } 

    if (event.target.name === 'new_district'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),3);      
    } 

    if (event.target.name === 'new_ward'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),4);      
    } 
  };


  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,id,values,user_id) => {     
      await  postExit(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_exit_add,animal_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  let showNewFarmerLocationFields = 
  (isNaN(parseInt(values.disposal_reason))|| parseInt(values.disposal_reason) === 1 || parseInt(values.disposal_reason) === 3 ||   parseInt(values.disposal_reason) === 4 ||
  parseInt(values.disposal_reason) === 5 ||   parseInt(values.disposal_reason) === 7 ||
  parseInt(values.disposal_reason) === 8 ||   parseInt(values.disposal_reason) === 9 ||
  parseInt(values.disposal_reason) === 10 ) ? false : true;

 
  return (
    <Page
      className={classes.root}
      title="Exits/Disposal"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       {`EXIT/DISPOSAL - ${animal_name}(${animal_tag}) `}
      </Typography>
      <br/>        
      <Header />
      <br/>
      
         <Grid container spacing={1} justify="center">  
          <Grid item xs={12}>
            <Card {...rest} className={clsx(classes.root, className)}> 
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
                      required
                      
                      label = "Exit / Disposal Date"
                      type = "date"
                      name = "exit_date"                      
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
                    label="Exit / Disposal Reason"
                    name="disposal_reason"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select                  
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {exitTypes.map(exitType => (
                          <option                    
                            value={exitType.id}
                          >
                            {exitType.value}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>

                {  parseInt(values.disposal_reason) === -66  ? 
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
                      
                      label="Other Exit Reason"
                      name="disposal_reason_other"                
                      onChange={handleChange}
                      variant="outlined" 
                      />
                    </Grid>
                    : null 
                }

              {  parseInt(values.disposal_reason) === -66  || parseInt(values.disposal_reason) ===1 || parseInt(values.disposal_reason) ===2  || parseInt(values.disposal_reason) ===6? 
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
                    
                    label="Disposal Amount"
                    type = 'number'
                    name="disposal_amount"                
                    onChange={handleChange}
                    variant="outlined"  
                    
                />
              </Grid> 
              : null
              }
              { showNewFarmerLocationFields ? 
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
                    
                    label="New Farmer Name"
                    name="new_farmer_name"                                   
                    onChange={handleChange}                   
                    variant="outlined"                                                 
                  />
                </Grid>
                : null
              }

              { showNewFarmerLocationFields ?
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
                    
                    label="New Farmer Phone No"
                    name="new_farmer_phone_no"                                   
                    onChange={handleChange}                   
                    variant="outlined"                                                 
                  />
                </Grid>
                : null
              }

              { showNewFarmerLocationFields ?
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
                    
                    label="New Breeder Name"
                    name="new_breeder_name"                                   
                    onChange={handleChange}                   
                    variant="outlined"                                                 
                  />
                </Grid>
                : null
              }
              { showNewFarmerLocationFields ?

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
                    
                    label="New Breeder Phone No"
                    name="new_breeder_phone_no"                                   
                    onChange={handleChange}                   
                    variant="outlined"                                                 
                  />
                </Grid>
                : null    }

                { showNewFarmerLocationFields ?
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
                    
                    label="New Country"
                    name="new_country"                                   
                    onChange={handleChange}                   
                    variant="outlined"  
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
                 : null    }

                { showNewFarmerLocationFields ?
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
                    
                    label="New Region"
                    name="new_region"                                   
                    onChange={handleChange}                   
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {regions.map(region => (
                          <option                    
                            value={region.id}
                          >
                            {region.name}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>
                : null    }
                { showNewFarmerLocationFields ?
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
                    
                    label="New District"
                    name="new_district"                                   
                    onChange={handleChange}                   
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {districts.map(district => (
                          <option                    
                            value={district.id}
                          >
                            {district.name}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>    
                 : null    } 

                 { showNewFarmerLocationFields ? 
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
                    
                    label="New Ward"
                    name="new_ward"                
                    onChange={handleChange}
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {wards.map(ward => (
                          <option                    
                            value={ward.id}
                          >
                            {ward.name}
                          </option>
                        ))
                    }           
                  </TextField>
              </Grid>
                : null    }  

                 { showNewFarmerLocationFields ? 
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
                    
                    label="New Village"
                    name="new_village"                
                    onChange={handleChange}
                    variant="outlined"
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {villages.map(village => (
                          <option                    
                            value={village.id}
                          >
                            {village.name}
                          </option>
                        ))
                    }           
                  </TextField>
              </Grid>
                : null    }
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
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
