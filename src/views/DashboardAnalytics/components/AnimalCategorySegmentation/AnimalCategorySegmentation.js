import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardHeader, CardContent, Divider, Typography } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_animal_statistics} from '../../../../configs/endpoints';
import {getAnimalStats}   from '../../../../utils/API';

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
  const { className, ...rest } = props;
  const [ { organization_id }  ] = useContext(authContext);
  const classes = useStyles(); 
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async  (org_id)=>{     
      await  getAnimalStats(endpoint_animal_statistics,org_id)
       .then(response => {              
         if (mounted) {
          setStats(response.payload);
         }
       });
     })(organization_id);
    return () => {
      mounted = false;
    };
  }, [organization_id]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton/>}
        title="Animal Types Segmentation"
      />
      <Divider />
      <CardContent className={classes.content}>
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
      </CardContent>
    </Card>
  );
};

AnimalCategorySegmentation.propTypes = {
  className: PropTypes.string
};

export default AnimalCategorySegmentation;
