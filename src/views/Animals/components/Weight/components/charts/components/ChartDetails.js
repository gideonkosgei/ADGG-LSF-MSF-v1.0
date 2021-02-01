import React, { useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors} from '@material-ui/core';
import {getWeightSummaries}   from '../../../../../../../utils/API';
import {endpoint_weight_summary} from '../../../../../../../configs/endpoints';
import {Sidebar} from '../../index';
import {default as ChartBodyWeightOverTime} from './ChartBodyWeightOverTime';
import {default as ChartBodyLengthOverTime} from './ChartBodyLengthOverTime';
import {default as ChartHeartGirthOverTime} from './ChartHeartGirthOverTime';

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
  const [weightSummary, setWeightSummary] = useState([]);
  const [lengthSummary, setLengthSummary] = useState([]);
  const [girthSummary, setGirthSummary] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const year = new Date().getFullYear();
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
 
  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,id,year) => {     
        await  getWeightSummaries(endpoint,id,year)
        .then(response => {       
          if (mounted) { 
            const data = response.payload[0];                        
            let body_weight = [];
            let body_length = [];
            let heart_girth = [];

            let heart_girth_summary = [];
            let body_length_summary = [];
            let body_weight_summary = [];

            if (data.length > 0 ){
              for (let i = 0; i< data.length; i++){ 
                if(data[i].categ === 'heart_girth'){                
                  heart_girth.push(data[i]);
                } 
                if(data[i].categ === 'body_length'){                
                  body_length.push(data[i]);
                } 
                if(data[i].categ === 'weight_kg'){                
                  body_weight.push(data[i]);
                }
              } 

              heart_girth_summary = [heart_girth[0].Jan,heart_girth[0].Feb,heart_girth[0].Mar,heart_girth[0].Apr,heart_girth[0].May,heart_girth[0].Jun,heart_girth[0].Jul,heart_girth[0].Aug,heart_girth[0].Sep,heart_girth[0].Oct,heart_girth[0].Nov,heart_girth[0].Dec];
              body_length_summary = [body_length[0].Jan,body_length[0].Feb,body_length[0].Mar,body_length[0].Apr,body_length[0].May,body_length[0].Jun,body_length[0].Jul,body_length[0].Aug,body_length[0].Sep,body_length[0].Oct,body_length[0].Nov,body_length[0].Dec];
              body_weight_summary = [body_weight[0].Jan,body_weight[0].Feb,body_weight[0].Mar,body_weight[0].Apr,body_weight[0].May,body_weight[0].Jun,body_weight[0].Jul,body_weight[0].Aug,body_weight[0].Sep,body_weight[0].Oct,body_weight[0].Nov,body_weight[0].Dec];
            
            } 
            setWeightSummary(body_weight_summary);
            setLengthSummary(body_length_summary);
            setGirthSummary(heart_girth_summary);

          }
        });
      })(endpoint_weight_summary,animal_id,year);

    return () => {
      mounted = false;     
    };
  }, [animal_id,year]); 

  if (!weightSummary || !lengthSummary || !girthSummary) {
    return null;
  }

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
                <ChartBodyWeightOverTime body_weight = {weightSummary}/>
              </Grid>
              <Grid item  xs={12} >  
                <ChartBodyLengthOverTime body_length = {lengthSummary}/>
              </Grid>
              <Grid item  xs={12} >  
                <ChartHeartGirthOverTime heart_girth = {girthSummary}/>
              </Grid>  
            </Grid> 

         </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};
ChartDetails.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default ChartDetails;