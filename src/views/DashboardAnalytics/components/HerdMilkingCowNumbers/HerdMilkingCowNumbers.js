import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader,LinearProgress, CardContent, Divider } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_herd_milking_cow_summary} from '../../../../configs/endpoints';
import {getHerdMilkingSummary}   from '../../../../utils/API';
import { Page } from 'components';

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

const HerdMilkingCowNumbers = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [ { user_id }] = useContext(authContext);  
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let mounted = true; 
    let event_year = []; 
    let yearly_milking_cows_count = [];
    (async  (endpoint,report_id,user_id)=>{     
      await  getHerdMilkingSummary(endpoint,report_id,user_id)
       .then(response => {              
         if (mounted) { 
           for (let i = 0;  i<response.payload.length; i++){            
            event_year.push(response.payload[i].event_year);
            yearly_milking_cows_count.push(response.payload[i].total_animals);            
           }
           const obj_data = {
            yearly_milking_cows_count: yearly_milking_cows_count            
          };                     
            setData(obj_data);
            setLabels(event_year);  
            setLoading(false); 
         }
       });
     })(endpoint_herd_milking_cow_summary,0,user_id);
    return () => {
      mounted = false;
    };
  }, [user_id]);
  return (
    <Page> 
    { loading  && <LinearProgress/>   }
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="Yearly Number Of Milking Cows"
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
  </Page>
  );
};

HerdMilkingCowNumbers.propTypes = {
  className: PropTypes.string
};

export default HerdMilkingCowNumbers;
