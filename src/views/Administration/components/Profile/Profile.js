import React, { useState, useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid ,Typography} from '@material-ui/core';
import { ProfileLogo, ProfileDetails } from './components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_org_details} from '../../../../configs/endpoints';
import {genericFunctionThreeParameters}   from '../../../../utils/API';

import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },  
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;
  const [ { organization_id }  ] = useContext(authContext); 
  const classes = useStyles();
  const [profile, setProfile] = useState(null);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,desc,id) => {     
        await  genericFunctionThreeParameters(endpoint,desc,id)
        .then(response => {                        
          if (mounted) {            
            setProfile(response.payload[0][0]);                 
          }
        });
      })(endpoint_org_details,'get org details',organization_id);
    return () => {
      mounted = false;           
    };
  }, [organization_id]);

  if (!profile ) {
    return null;
  }

  return (
    <Page className={classes.root} >
      <Typography
      component="h1"
      variant="h3"
      >
        Organization Account Profile
      </Typography>
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
      
    > 
      
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <ProfileLogo profile={profile} />
      </Grid>
      <Grid
        item
        lg={8}
        md={6}
        xl={9}
        xs={12}
      >
        <ProfileDetails profile={profile}  />
      </Grid>
    </Grid>
    </Page>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};
export default Profile;
