import React, { useState, useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { ProfileDetails, GeneralSettings } from './components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_user_profile_details} from '../../../../configs/endpoints';
import {getProfileDetails}   from '../../../../utils/API';

const useStyles = makeStyles(() => ({
  root: {}
}));

const General = props => {
  const { className, ...rest } = props;
  const [ { user_id }  ] = useContext(authContext);  

  const classes = useStyles();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = () => {     
      getProfileDetails(endpoint_user_profile_details,user_id)
      .then(response => {       
        if (mounted) {
          setProfile(response.payload[0]);
        }
      });
    };
    fetchProfile(user_id);
    return () => {
      mounted = false;
    };
  }, [user_id]);

  if (!profile) {
    return null;
  }

  return (
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
        <ProfileDetails profile={profile} />
      </Grid>
      <Grid
        item
        lg={8}
        md={6}
        xl={9}
        xs={12}
      >
        <GeneralSettings profile={profile} />
      </Grid>
    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};

export default General;
