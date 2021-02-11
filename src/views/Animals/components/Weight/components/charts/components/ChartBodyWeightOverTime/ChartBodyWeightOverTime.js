import React, { useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import {getWeightSummaries}   from '../../../../../../../../utils/API';
import {endpoint_weight_summary} from '../../../../../../../../configs/endpoints';

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

const ChartBodyWeightOverTime = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [weightSummary, setWeightSummary] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const year = new Date().getFullYear();

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,id,year) => {     
        await  getWeightSummaries(endpoint,id,year)
        .then(response => {       
          if (mounted) { 
            const data = response.payload[0];                        
            let body_weight = [];
            let body_weight_summary = [];

            if (data.length > 0 ){
              for (let i = 0; i< data.length; i++){
                if(data[i].categ === 'weight_kg'){                
                  body_weight.push(data[i]);
                }
              }               
              body_weight_summary = [body_weight[0].Jan,body_weight[0].Feb,body_weight[0].Mar,body_weight[0].Apr,body_weight[0].May,body_weight[0].Jun,body_weight[0].Jul,body_weight[0].Aug,body_weight[0].Sep,body_weight[0].Oct,body_weight[0].Nov,body_weight[0].Dec];
            
            } 
            setWeightSummary(body_weight_summary);  
          }
        });
      })(endpoint_weight_summary,animal_id,year);

    return () => {
      mounted = false;     
    };
  }, [animal_id,year]); 

  if (!weightSummary) {
    return null;
  }

  const data = {
    thisWeek: {
      data: [],
      labels: []
    },
    thisMonth: {
      data: [],
      labels: []
    },
    thisYear: {
      data: weightSummary,
      labels: ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      
    }
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Body Weight Over Time"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart
              className={classes.chart}
              data={data.thisYear.data}
              labels={data.thisYear.labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};


ChartBodyWeightOverTime.propTypes = {
  className: PropTypes.string
};

export default ChartBodyWeightOverTime;
