import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';

import { GenericMoreButton } from 'components';
import { Chart } from './components';

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
  const { className,body_weight, ...rest } = props;

  const classes = useStyles();

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
      data: body_weight,
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
