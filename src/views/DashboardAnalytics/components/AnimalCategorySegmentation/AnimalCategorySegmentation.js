import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardHeader,LinearProgress, CardContent, Divider, Typography } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Chart } from './components';
import {endpoint_animal_statistics} from '../../../../configs/endpoints';
import {getAnimalStats}   from '../../../../utils/API';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  chartContainer: {
    padding: theme.spacing(3)
  },
  chart: {
    height: 281
  },
  statsContainer: {
    display: 'flex'
  },
  statsItem: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(3, 2),
    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }
}));

const AnimalCategorySegmentation = props => {
  const { className,org,level,herd, ...rest } = props;  
  const classes = useStyles(); 
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async  (endpoint,org_id,level,herd)=>{     
      await  getAnimalStats(endpoint,org_id,level,herd)
       .then(response => {              
         if (mounted) {
          setStats(response.payload);
          setLoading(false);  
         }
       });
     })(endpoint_animal_statistics,org,level,herd);    
       
    return () => {
      mounted = false;
    };
  }, [org,level,herd]);

  return (
    <Page> 
    { loading  && <LinearProgress/>   } 
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton/>}
        title="ANIMAL CATEGORIES"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.chartContainer}>
            <Chart
              className={classes.chart}
              data={stats}
            />
          </div>
          <Divider />
          <div className={classes.statsContainer}>
            {stats.map(stat => (
              <div
                className={classes.statsItem}
                key={stat.animal_type_id}
              >
                <Typography
                  align="center"
                  component="h6"
                  gutterBottom
                  variant="overline"
                >
                  {stat.animal_type}
                </Typography>
                <Typography
                  align="center"
                  variant="h4"
                >
                  {stat.percentage}%
                </Typography>
              </div>
            ))}
          </div>
        </PerfectScrollbar>  
      </CardContent>
    </Card>
  </Page>
  );
};

AnimalCategorySegmentation.propTypes = {
  className: PropTypes.string,
  org: PropTypes.number,
  level: PropTypes.number,
  herd: PropTypes.number
};

export default AnimalCategorySegmentation;
