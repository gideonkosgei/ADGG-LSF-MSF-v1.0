import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import { Chart } from './components';
import { Page } from 'components';

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


const MaxTemp = props => {
  const { className, data, ...rest } = props;
  const classes = useStyles();

  let dates = [];
  let temp = [];

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      dates.push(data[i].period);
      temp.push(data[i].T2M_MAX);
    }
  }

  const chart_data = { 
    temp: temp,
    labels: dates 
};

  return (
    <Page>

      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="MAXIMUM TEMPERATURE"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Chart
                className={classes.chart}               
                data={chart_data.temp}
                labels={chart_data.labels}
              />
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </Page>
  );
};

MaxTemp.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};
export default MaxTemp;
