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

const HeartGirthCurve = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [dateCategories, setDateCategories] = useState([]);
  const [heartGirthValues, setHeartGirthValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id'); 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,option,id) => {     
        await  getWeightGrowthCurveData(endpoint,option,id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload;                                  
            let dates = [];
            let girth = [];
            if (data.length > 0 ){
              for (let i = 0; i< data.length; i++){                              
                dates.push(data[i].month_year);
                girth.push(data[i].avg_monthly_heart_girth);              
              }             
            } 
            setDateCategories(dates); 
            setHeartGirthValues(girth);                      
          }
        });
      })(endpoint_weight_growth_curve,2,animal_id);

    return () => {
      mounted = false;     
    };
  }, [animal_id]); 

  if (!dateCategories || !heartGirthValues) {
    return null;
  }  
  const data = { 
      girth: heartGirthValues,
      labels: dateCategories 
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Heart Girth Over Time"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart
              className={classes.chart}
              data={data.girth}
              labels={data.labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

HeartGirthCurve.propTypes = {
  className: PropTypes.string
};

export default HeartGirthCurve;
