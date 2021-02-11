import React, { useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { GenericMoreButton } from 'components';
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

const BodyLengthCurve = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [dateCategories, setDateCategories] = useState([]);
  const [bodyLengthValues, setBodyLengthValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id'); 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,option,id) => {     
        await  getWeightGrowthCurveData(endpoint,option,id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload;                                  
            let dates = [];
            let body_length = [];
            if (data.length > 0 ){
              for (let i = 0; i< data.length; i++){                              
                dates.push(data[i].month_year);
                body_length.push(data[i].avg_monthly_body_length);              
              }             
            } 
            setDateCategories(dates); 
            setBodyLengthValues(body_length);                                 
          }
        });
      })(endpoint_weight_growth_curve,3,animal_id);

    return () => {
      mounted = false;     
    };
  }, [animal_id]); 

  if (!dateCategories || !bodyLengthValues) {
    return null;
  }  
  const data = { 
      body_length: bodyLengthValues,
      labels: dateCategories 
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Body Length Over Time"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart
              className={classes.chart}
              data={data.body_length}
              labels={data.labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

BodyLengthCurve.propTypes = {
  className: PropTypes.string
};

export default BodyLengthCurve;
