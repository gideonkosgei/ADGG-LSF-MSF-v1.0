import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid} from '@material-ui/core';
import {Farm,Org}   from './components';
import { Page } from 'components';

const UnitAccess = props => {
  const {UserDetails,ApplicationArea} = props; 
  
  useEffect(() => {   
  }, []);
 
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
