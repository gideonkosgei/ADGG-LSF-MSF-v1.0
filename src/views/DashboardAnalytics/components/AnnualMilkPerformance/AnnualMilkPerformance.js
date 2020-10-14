import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_annual_milk_performance} from '../../../../configs/endpoints';
import {getAnnualMilkPerformance}   from '../../../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  chart: {
    padding: theme.spacing(4, 2, 0, 2),
    height: 400
  }
}));

const AnnualMilkPerformance = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [ { organization_id }  ] = useContext(authContext);

  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,org_id)=>{     
      await  getAnnualMilkPerformance(endpoint,org_id)
       .then(response => {              
         if (mounted) {

           const this_year = new Date().getFullYear();         
           let this_year_array = [];
           let last_year_array = [];
           
           for (let i = 0;  i<response.payload.length; i++){
             if (response.payload[i].YR === this_year){
               this_year_array.push(response.payload[i].MILK);
             } else {
               last_year_array.push(response.payload[i].MILK);
             }
           }
           const obj_data = {
            thisYear: this_year_array,
            lastYear: last_year_array
          };
                     
          setData(obj_data);                         
         }
       });
     })(endpoint_annual_milk_performance,organization_id);
    return () => {
      mounted = false;
    };
  }, [organization_id]);
  
  const labels = ['Jan','Feb','Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec' ];

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Annual Milk Performance"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Chart
              className={classes.chart}
              data={data}
              labels={labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

AnnualMilkPerformance.propTypes = {
  className: PropTypes.string
};

export default AnnualMilkPerformance;
