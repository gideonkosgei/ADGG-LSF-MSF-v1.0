import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors} from '@material-ui/core';
import {default as LactationTable} from './LactationTable';
import {default as LactationCurve} from './LactationCurve';


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
  }, []); 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >           
      <CardHeader title= {`${animal_name}(${animal_tag}) `}/> 
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">                           
                <Grid item  xs={12} >  
                  <LactationTable />
                </Grid>                                    
                <Grid item  xs={12} >  
                  <LactationCurve/>
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