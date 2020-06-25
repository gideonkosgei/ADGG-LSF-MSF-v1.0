import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button, Card,CardActions, CardContent, CardHeader, Grid,Divider, TextField,colors } from '@material-ui/core';
import SuccessSnackbar from '../SuccessSnackbar';
import {endpoint_counties} from '../../../../../../configs/endpoints';
import {getCounties,getSubCounties,getWards,getVillages}   from '../../../../../../utils/API';

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

const GeneralSettings = props => {
  const { profile,timezones,countries, className, ...rest } = props; 

  const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [values, setValues] = useState({
    name: profile.name,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    country: parseInt(profile.country_id) || 11,
    timezone: profile.timezone,
    role: profile.role,
    level: profile.level,
    region: parseInt(profile.region) || 10924,
    district: parseInt(profile.district) || 10936,
    ward: parseInt(profile.ward) || 11024,
    village: parseInt(profile.village) || 11468,
    organization: profile.organization,
    client: profile.client
    
  });


  let getUnits = countries.find(country => country.id === parseInt(values.country)); 


  const [units, setUnits] = useState({
    unit1: getUnits.unit1_name,
    unit2: getUnits.unit2_name,
    unit3: getUnits.unit3_name,
    unit4: getUnits.unit4_name
  });
 

  const [counties, setCounties] = useState(null);  
  const [sub_counties, setSubCounties] = useState(null); 
  const [wards, setWards] = useState(null);
  const [villages, setVillages] = useState(null);

 
  //sub-counties hook to update sub_county state
  const subCountiesHook = async (country_id,county_id) => {     
    await getSubCounties(endpoint_counties,country_id,county_id)
    .then(response => { 
      console.log(response.payload);
        setSubCounties(response.payload);
    });
  };

   //ward hook to update ward state
  const wardHook = async (country_id,county_id,sub_county_id) => {     
    await getWards(endpoint_counties,country_id,county_id,sub_county_id)
    .then(response => {   
        setWards(response.payload);     
    });
  }

  const villageHook = async (country_id,county_id,sub_county_id,ward_id)=> {     
    await getVillages(endpoint_counties,country_id,county_id,sub_county_id,ward_id)
    .then(response => {  
        setVillages(response.payload);      
    });
  };
 
  useEffect(() => {
    let mounted = true; 
  // invoke counties hook
  (async (country_id) => {   
    await getCounties(endpoint_counties,country_id)
    .then(response => {       
      if (mounted) {
        setCounties(response.payload);
      }
    });
  }) (values.country); 

  //invoke hooks
  subCountiesHook(values.country,values.region);
  wardHook(values.country,values.region,values.district);
  villageHook(values.country,values.region,values.district,values.ward);
  
    return () => {
      mounted = false;
    };
  }, [values.country,values.region,values.district,values.ward]);

  if (!counties || !sub_counties || !wards || !villages) {
    return null;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values         
    });
  };

  const handleChangeCountry = event => {
    event.persist();   
    setValues({
      ...values,
      [event.target.name]: event.target.value
    }); 

    let getUnits = countries.find(country => country.id === parseInt(event.target.value));   
    setUnits({
      unit1: getUnits.unit1_name,
      unit2: getUnits.unit2_name,
      unit3: getUnits.unit3_name,
      unit4: getUnits.unit4_name
    });  
    
    //subCountiesHook(values.country,values.region);
    //wardHook(values.country,values.region,values.district);
    //villageHook(values.country,values.region,values.district,values.ward);
  
  };

 
  const handleChangeRegion = event => {  
    event.persist();
    setValues({
      ...values,
       [event.target.name]: event.target.value
    });   
    subCountiesHook(values.country,event.target.value);
  };

  const handleChangeWard = event => {   
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });  
    wardHook(values.country,values.region,event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
        <CardHeader title="Profile" />
        <Divider />
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
                label="Full Name "
                name="name"
                onChange={handleChange}
                required
                value={values.name}
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
                label="Username"
                name="username"
                onChange={handleChange}               
                value={values.username}
                variant="outlined"
                disabled = "true"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}                
                value={values.email}
                variant="outlined"
                disabled = "true"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"             
                name="phone"
                onChange={handleChange}
                type="text"
                value={values.phone}
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
                label="Select Timezone"
                name="timezone"
                onChange={handleChange}               
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.timezone}
                variant="outlined"
              >
                {timezones.map(timezone => (
                  <option
                    key={timezone.name}
                    value={timezone.name}
                  >
                    {timezone.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Country"
                name="country"
                onChange={handleChange}              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.country}
                variant="outlined"
              >
                {countries.map(country => (
                  <option
                    key={country.id}
                    value={country.id}
                  >
                    {country.name}
                  </option>
                ))}
              </TextField>
            </Grid>
           
            
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                label={units.unit1}              
                name={units.unit1}                 
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.region}
                variant="outlined"
              >
                {counties.map(county => (
                  <option
                    key={county.county_id}
                    value={county.county_id}
                  >
                    {county.county_name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                label={units.unit2}                
                name={units.unit2} 
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.district}
                variant="outlined"
              >
                {sub_counties.map(sub_county => (
                  <option
                    key={sub_county.sub_county_id}
                    value={sub_county.sub_county_id}
                  >
                    {sub_county.sub_county_name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                label={units.unit3} 
                name={units.unit3}              
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.ward}
                variant="outlined"
              >
                {wards.map(ward => (
                  <option
                    key={ward.ward_id}
                    value={ward.ward_id}
                  >
                    {ward.ward_name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                label={units.unit4} 
                name={units.unit4}               
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                value={values.village}
                variant="outlined"
              >
                {villages.map(village => (
                  <option
                    key={village.village_id}
                    value={village.village_id}
                  >
                    {village.village_name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="organization"
                name="organization"
                onChange={handleChange}                
                value={values.organization}
                variant="outlined"
                disabled = "true"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Client"
                name="client"
                onChange={handleChange}               
                value={values.client}
                variant="outlined"
                disabled = "true"
              />
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="role"
                name="role"
                onChange={handleChange}                
                value={values.role}
                variant="outlined"
                disabled = "true"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="level"
                name="level"
                onChange={handleChange}               
                value={values.level}
                variant="outlined"
                disabled = "true"
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
            Save Changes
          </Button>
        </CardActions>
      </form>
      <SuccessSnackbar
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Card>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default GeneralSettings;
