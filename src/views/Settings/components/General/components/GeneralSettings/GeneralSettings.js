import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors } from '@material-ui/core';
import SuccessSnackbar from '../SuccessSnackbar';


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
    country: profile.country,
    timezone: profile.timezone,
    role: profile.role,
    level: profile.level,
    region: profile.region,
    district: profile.district,
    ward: profile.ward,
    village: profile.village,
    organization: profile.organization,
    client: profile.client  
  });

  let getUnits = countries.find(country => country.id === parseInt(values.country_id)||11 ); 

  const [units, setUnits] = useState({
    unit1: getUnits.unit1_name,
    unit2: getUnits.unit2_name,
    unit3: getUnits.unit3_name,
    unit4: getUnits.unit4_name
  });



 

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  const handleChangeCountry = event => {
    event.persist();
    setValues({
      ...values  
    });   
    let getUnits = countries.find(country => country.id === parseInt(event.target.value));
    setUnits({
      unit1: getUnits.unit1_name,
      unit2: getUnits.unit2_name,
      unit3: getUnits.unit3_name,
      unit4: getUnits.unit4_name
    }      
    );
    
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
                disabled = "true"
                value={values.name}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
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
                disabled = "true"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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
                disabled = "true"
                SelectProps={{ native: true }}
                value={values.timezone}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChangeCountry}  
                disabled = "true" 
                value={values.country}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              /> 
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
                disabled = "true"                
                value={values.region}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                disabled = "true"               
                value={values.district}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
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
                disabled = "true"               
                value={values.ward}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
             
              
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
                disabled = "true"               
                value={values.village}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              /> 
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
                InputLabelProps={{
                  shrink: true,
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>            
            
          </Grid>
        </CardContent>
        
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