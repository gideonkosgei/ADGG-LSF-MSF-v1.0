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


const RelativeHumidity = props => {
  const { className, data, ...rest } = props;
  const classes = useStyles();

  let dates = [];
  let rh2m = [];

  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      dates.push(data[i].period);
      rh2m.push(data[i].RH2M);
    }
  }

  const chart_data = { 
    rh2m: rh2m,
    labels: dates 
};

  return (
    <Page>

      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="RELATIVE HUMIDITY"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Chart
                className={classes.chart}               
                data={chart_data.rh2m}
                labels={chart_data.labels}
              />
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </Page>
  );
};

RelativeHumidity.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};
export default RelativeHumidity;
