import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardHeader,LinearProgress, CardContent, Divider, Typography } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_breeds_distribution} from '../../../../configs/endpoints';
import {getStatsBreedsDistribution}   from '../../../../utils/API';
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

const BreedDistribution = props => {
  const { className, ...rest } = props;
  const [ { organization_id }  ] = useContext(authContext);
  const classes = useStyles(); 
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async  (org_id)=>{     
      await  getStatsBreedsDistribution(endpoint_breeds_distribution,org_id)
       .then(response => {              
         if (mounted) {
          setStats(response.payload);
          setLoading(false);  
         }
       });
     })(organization_id);
    return () => {
      mounted = false;
    };
  }, [organization_id]);


  return (
    <Page> 
    { loading  && <LinearProgress/>   }
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton/>}
        title="Breed Distribution"
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
                  key={stat.breed}
                >
                  <Typography
                    align="center"
                    component="h6"
                    gutterBottom
                    variant="overline"
                  >
                    {stat.breed}
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

BreedDistribution.propTypes = {
  className: PropTypes.string
};

export default BreedDistribution;
