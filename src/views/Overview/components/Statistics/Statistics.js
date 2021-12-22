import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Card, Typography, Grid, Link } from '@material-ui/core';
import { endpoint_animal_statistics } from '../../../../configs/endpoints';
import { getAnimalStats } from '../../../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  overline: {
    marginTop: theme.spacing(1)
  }
}));

const Statistics = props => {
  const { className, org, level, herd, ...rest } = props;
  const classes = useStyles();
  const [statistics, setStatistics] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async (endpoint, org_id, level, herd) => {
      await getAnimalStats(endpoint, org_id, level, herd)
        .then(response => {
          if (mounted) {
            setStatistics(response.payload);
          }
        });
    })(endpoint_animal_statistics, org, level, herd);

    return () => {
      mounted = false;
    };
  }, [org, level, herd]);

  if (!statistics) {
    return null;
  }

  const cows = statistics.find(stat => stat.animal_type === 'Cow');
  const heifers = statistics.find(stat => stat.animal_type === 'Heifer');
  const male_calves = statistics.find(stat => stat.animal_type === 'Male Calf');
  const female_calves = statistics.find(stat => stat.animal_type === 'Female Calf');
  const bulls = statistics.find(stat => stat.animal_type === 'Bull');
  const uncategorized = statistics.find(stat => stat.animal_type === 'Uncategorized');
  //const ai_straws = statistics.find(stat => stat.animal_type === 'AI Straw');


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="center"
        container
        justifyContent="space-between"
      >
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(cows) ? cows.count.toLocaleString('en') : 0}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (cows) === 'undefined') ? '#' : `/management/animals/${cows.animal_type_id}/${herd}`}
              variant="h6"
            >
              COWS
            </Link>
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(heifers) ? heifers.count.toLocaleString('en') : 0}
          </Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (heifers) === 'undefined') ? '#' : `/management/animals/${heifers.animal_type_id}/${herd}`}
              variant="h6"
            >
              Heifers
            </Link>
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(male_calves) ? male_calves.count.toLocaleString('en') : 0}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (male_calves) === 'undefined') ? '#' : `/management/animals/${male_calves.animal_type_id}/${herd}`}
              variant="h6"
            >
              MALE CALVES
            </Link>
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(female_calves) ? female_calves.count.toLocaleString('en') : 0}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (female_calves) === 'undefined') ? '#' : `/management/animals/${female_calves.animal_type_id}/${herd}`}
              variant="h6"
            >
              FEMALE CALVES
            </Link>
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(bulls) ? bulls.count.toLocaleString('en') : 0}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (bulls) === 'undefined') ? '#' : `/management/animals/${bulls.animal_type_id}/${herd}`}
              variant="h6"
            >
              BULLS
            </Link>
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{(uncategorized) ? uncategorized.count.toLocaleString('en') : 0}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            <Link
              color="inherit"
              component={RouterLink}
              to={(typeof (uncategorized) === 'undefined') ? '#' : `/management/animals/${uncategorized.animal_type_id}/${herd}`}
              variant="h6"
            >
              UNCATEGORIZED
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

Statistics.propTypes = {
  className: PropTypes.string,
  org: PropTypes.number,
  level: PropTypes.number,
  herd: PropTypes.number
};
export default Statistics;
