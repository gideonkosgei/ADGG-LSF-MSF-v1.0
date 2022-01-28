import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, LinearProgress, CardContent, Divider, TextField, Grid } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import { endpoint_lactation_curve } from '../../../../../../configs/endpoints';
import { getlactationCurveData } from '../../../../../../utils/API';
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

const LactationCurve = props => {
  const { className, option, id, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [records, setRecords] = useState([]);
  const [milkData, setMilkData] = useState([]);
  const [dimData, setDimData] = useState([]);
  const [parities, setParities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async (endpoint, id, option) => {
      await getlactationCurveData(endpoint, id, option)
        .then(response => {
          if (mounted) {
            setRecords(response.payload);
            let lactations = [];
            if (response.payload.length > 0) {
              for (let i = 0; i < response.payload.length; i++) {
                lactations.push(response.payload[i].parity);
              }
            }
            setParities(lactations.filter(onlyUnique));
            setLoading(false);
          }
        });
    })(endpoint_lactation_curve, id, option);
    return () => {
      mounted = false;
    };
  }, [id, option]);

  if (!records) {
    return null;
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  let dim = [];
  let milk = [];


  const data = {
    lactation_data: {
      data: milkData,
      labels: dimData
    }
  };
  const handleChange = event => {
    setValues({ ...values });
    event.persist();
    if (records.length > 0) {
      for (let i = 0; i < records.length; i++) {
        if (records[i].parity === parseInt(event.target.value)) {
          dim.push(records[i].dim);
          milk.push(records[i].total_milk);
        }
      }
    }
    setMilkData(milk);
    setDimData(dim);
  };

  return (
    <Page>
      {loading && <LinearProgress />}
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader
          action={<GenericMoreButton />}
          title= {option === 0 ? "LACTATION CURVE": "HERD LACTATION CURVE"}
        />
        <Divider />
        <CardContent className={classes.content}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={4}>
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin='dense'
                label=" SELECT PARITY"
                name="parity"
                onChange={handleChange}
                default=""
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                variant="outlined"
              >
                <option></option>
                {parities.map(parity => (
                  <option
                    value={parity}
                  >
                    {parity}
                  </option>
                ))
                }
              </TextField>
            </Grid>
          </Grid>
          <br />
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Chart
                className={classes.chart}
                data={data.lactation_data.data}
                labels={data.lactation_data.labels}
              />
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </Page>
  );
};


LactationCurve.propTypes = {
  className: PropTypes.string,
  option: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired
};

export default LactationCurve;
