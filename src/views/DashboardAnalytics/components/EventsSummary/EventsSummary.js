import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Chip, Card, LinearProgress, CardContent } from '@material-ui/core';
import { endpoint_events_summary } from '../../../../configs/endpoints';
import { getStatsBreedsDistribution } from '../../../../utils/API';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  chips: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(1)
  },



}));

const EventsSummary = props => {
  const { className, herd, level, org, ...rest } = props;
  const classes = useStyles();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async (endpoint, org_id, level, herd_id) => {
      await getStatsBreedsDistribution(endpoint, org_id, level, herd_id)
        .then(response => {
          if (mounted) {
            setStats(response.payload);
            setLoading(false);
          }
        });
    })(endpoint_events_summary, org, level, herd);
    return () => {
      mounted = false;
    };
  }, [org, level, herd]);

  return (
    <Page>
      {loading && <LinearProgress />}
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <div className={classes.chips}>
            {stats.map(chip => (
              <Chip
                className={classes.chip}
                label={`${chip.description}(${chip.count})`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

EventsSummary.propTypes = {
  className: PropTypes.string,
  org: PropTypes.number,
  level: PropTypes.number,
  herd: PropTypes.number
};
export default EventsSummary;
