import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors } from '@material-ui/core';



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

const ProfileDetails = props => {
  const { profile, className, ...rest } = props; 

  const classes = useStyles();  
  
  const [values, setValues] = useState({
    country_id: profile.country_id,
    country_name: profile.country_name,
    created_at: profile.created_at,
    org_id: profile.org_id,
    org_name: profile.org_name,
     
  });

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form >
        <CardHeader title="Account Profile Details" />
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
                label="Organization ID"
                name="org_id"
                onChange={handleChange}              
                disabled = "true"
                value={values.org_id}
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
                label="Organization Name"
                name="org_name"
                onChange={handleChange}               
                value={values.org_name}
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
                label="Country"
                name="country_name"
                onChange={handleChange}                
                value={values.country_name}
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
                label="Date Created"             
                name="created_at"
                onChange={handleChange}
                type="text"
                value={values.created_at}
                disabled = "true"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          
            
          </Grid>
        </CardContent>
        
      </form>
     
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;