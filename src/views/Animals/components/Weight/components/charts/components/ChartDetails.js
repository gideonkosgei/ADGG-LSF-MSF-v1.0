import React, { useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors} from '@material-ui/core';
import {Sidebar} from '../../index';
import {default as WeightCurve} from '../../../../Analytics/components/WeightCurve';
//import {default as HeartGirthCurve} from '../../../../Analytics/components/HeartGirthCurve';
//import {default as BodyLengthCurve} from '../../../../Analytics/components/BodyLengthCurve';



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

const ChartDetails = props => {
  const {className, ...rest } = props;   
  const classes = useStyles(); 
  
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
 
  useEffect(() => { 
    return () => {          
    };
  }, []);  

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >           
        <CardHeader title= {`WEIGHT & GROWTH CHARTS - ${animal_name}(${animal_tag}) `}/> 
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>                    

            <Grid container spacing={1} justify="center">
              <Grid item  xs={12} >  
                <WeightCurve/>
              </Grid>
              { /*
                <Grid item  xs={12} >  
                <HeartGirthCurve/>
              </Grid>
              <Grid item  xs={12} >  
                <BodyLengthCurve/>
              </Grid> */

              }
               
            </Grid> 

         </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};
ChartDetails.propTypes = {
  className: PropTypes.string  
};

export default ChartDetails;