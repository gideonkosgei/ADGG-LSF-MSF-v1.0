import React, { useState, useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { ProfileDetails, GeneralSettings } from './components';
import { default as AccessShuttle } from '../SwitchOrg';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_user_profile_details,endpoint_timezones,endpoint_countries} from '../../../../configs/endpoints';
import {getProfileDetails,getTimezones,getCountries}   from '../../../../utils/API';
import {default as UnitAccess} from '../../../Administration/components/UnitAccess';


const useStyles = makeStyles(() => ({
  root: {}
}));
const General = props => {
  const { className, ...rest } = props;
  const [ { user_id }  ] = useContext(authContext); 
  const classes = useStyles();
  const [profile, setProfile] = useState(null);
  const [timezones, setTimezones] = useState(null);
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    let mounted = true;
    //fetch user profiles
    async function fetchProfile(){     
     await  getProfileDetails(endpoint_user_profile_details,user_id)
      .then(response => {       
        if (mounted) {
          setProfile(response.payload[0][0]);
        }
      });
    };
    fetchProfile(user_id);
    
    //fetch timezones
    async function fetchTimezones (){     
      await getTimezones(endpoint_timezones)
      .then(response => { 
          setTimezones(response.payload);
      });
    };
    fetchTimezones();
    
    //fetch countries
    async function fetchCountries(){     
      await getCountries(endpoint_countries)
      .then(response => { 
          setCountries(response.payload);
      });
    };
    fetchCountries();

    return () => {
      mounted = false;
    };
  }, [user_id]);



  if (!profile || !timezones || !countries) {
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
        <GeneralSettings profile={profile}  timezones = {timezones} countries ={countries}/>
      </Grid>

      <Grid
        item
        lg={12}
        md={6}
        xl={9}
        xs={12}
      >
        <AccessShuttle/>
      </Grid>
      <Grid
        item        
        xs={12}
      >
       <UnitAccess 
          UserDetails = {{id: profile.id,name:profile.name}}
          ApplicationArea = "user"
       />
      </Grid>

    </Grid>
  );
};

General.propTypes = {
  className: PropTypes.string
};
export default General;
