import React, { useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { Chart } from './components';
import {getWeightGrowthCurveData}   from '../../../../../../utils/API';
import {endpoint_weight_growth_curve} from '../../../../../../configs/endpoints';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {},
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginLeft: theme.spacing(1)
    }
  },
  inner: {
    height: 275,
    minWidth: 400
  },
  chart: {
    height: '100%'
  }
}));

const WeightCurve = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [dateCategories, setDateCategories] = useState([]);
  const [weightValues, setWeightValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id'); 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,option,type,id) => {     
        await  getWeightGrowthCurveData(endpoint,option,type,id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload;                                  
            let dates = [];
            let weights = [];
            if (data.length > 0 ){
              for (let i = 0; i< data.length; i++){                              
                dates.push(data[i].age);
                weights.push(data[i].avg_weight);              
              }             
            } 
            setDateCategories(dates); 
            setWeightValues(weights);            
          }
        });
      })(endpoint_weight_growth_curve,1,1,animal_id);

    return () => {
      mounted = false;     
    };
  }, [animal_id]); 

  if (!dateCategories || !weightValues) {
    return null;
  }  
  const data = { 
      weights: weightValues,
      labels: dateCategories 
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader      
        title="Growth Curve"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart
              className={classes.chart}
              data={data.weights}
              labels={data.labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

WeightCurve.propTypes = {
  className: PropTypes.string
};

export default WeightCurve;
