import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import {default as LactationTable} from './LactationTable';
import {default as LactationCurve} from './LactationCurve';
import {default as LactationCurveCombined} from './LactationCurveCombined';
import {default as WeightCurve} from './WeightCurve';
import {default as HealthManagementSummmaryTable} from './HealthManagementSummmaryTable';


const ChartDetails = props => {
  useEffect(() => {     
  }, []); 

  return (    
    <Grid container spacing={1}> 
        {  
        parseInt(sessionStorage.getItem('animal_type')) === 1 || parseInt(sessionStorage.getItem('animal_type')) === 2 ?
        <>                   
          <Grid item  xs={12} >  
            <LactationTable />
          </Grid>                                   
 
          <Grid item  xs={12} >  
            <LactationCurveCombined option={0} id={localStorage.getItem('animal_id')}/>
          </Grid>

          <Grid item  xs={12} >  
            <LactationCurve option={0} id={localStorage.getItem('animal_id')}/>
          </Grid>
        </>
      : null
      }
      <Grid item  xs={12} >  
        <WeightCurve/>
      </Grid>
      <Grid item  xs={6} >  
        <HealthManagementSummmaryTable health_summary_option ={1}/>
      </Grid>
    </Grid>
       
  );
};
ChartDetails.propTypes = {
  className: PropTypes.string  
};
export default ChartDetails;