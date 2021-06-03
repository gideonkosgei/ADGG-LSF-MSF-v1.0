import React, { useState, useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid} from '@material-ui/core';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_org_details} from '../../../../configs/endpoints';
import {genericFunctionThreeParameters}   from '../../../../utils/API';
import {Farm,Org}   from './components';
import { Page } from 'components';

const UnitAccess = props => {
  const {UserDetails,ApplicationArea} = props; 
  const [ { organization_id }  ] = useContext(authContext);  
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
    <Page >
    <Grid  
      container spacing={2} justify="center" 
    > 
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <br/>
        <Org 
          UserDetails = {UserDetails}
          ApplicationArea = {ApplicationArea}
        />
       
      </Grid>
      
    
      <Grid
        item
        lg={8}
        md={6}
        xl={9}
        xs={12}
      >
         <br/>
        <Farm 
          UserDetails = {UserDetails}
          ApplicationArea = {ApplicationArea}
        />
      </Grid>
    </Grid>
    </Page>
  );
};

UnitAccess.propTypes = {
  className: PropTypes.string,
  UserDetails : PropTypes.object.isRequired,
  ApplicationArea:PropTypes.string.isRequired
};
export default UnitAccess;
