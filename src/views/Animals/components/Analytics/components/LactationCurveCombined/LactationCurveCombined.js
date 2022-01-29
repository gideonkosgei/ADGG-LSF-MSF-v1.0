import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, LinearProgress, CardContent, Divider } from '@material-ui/core';
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


function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const LactationCurveCombined = props => {
  const { className, option, id, ...rest } = props;
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async (endpoint, id, option) => {
      await getlactationCurveData(endpoint, id, option)
        .then(response => {

          if (mounted) {
            setRecords(response.payload);
            let data = response.payload;
            let parities = [];
            let labels_temp = [];
            let unique_parities = [];
            let dataset_temp = [];

            /** get unique parities */

            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                parities.push(data[i].parity);
              }

              unique_parities = parities.filter(onlyUnique); //unique parities
              let max_dim = Math.max(...data.map(o => o.dim), 0); // maximum dim
              let max_dim_object = data.find(o => o.dim === max_dim); // objects with the maximum dim  - Returns the 1st occurrence

              /** get labels */
              for (let i = 0; i < data.length; i++) {
                if (data[i].parity === max_dim_object.parity) {
                  labels_temp.push(data[i].dim);
                }
              }

              setLabels(labels_temp)

              for (let i = 0; i < unique_parities.length; i++) {
                let milk_values = [];
                for (let r = 0; r < data.length; r++) {
                  if (data[r].parity === parseInt(unique_parities[i])) {
                    milk_values.push(data[r].total_milk);
                  }                 
                }

                let random_random = getRandomColor();

                dataset_temp.push(
                  {
                    backgroundColor: 'rgba(65, 145, 255, 0.4)',
                    fill: false,
                    borderColor: random_random,  
                    pointBackgroundColor: '#ffffff', 
                    pointHoverBackgroundColor: random_random,                 
                    
                    /*
                    borderCapStyle: 'round',
                    borderDash: [],
                    borderWidth: 3,                   
                    borderDashOffset: 0.0,
                    
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: random_random,
                    pointBorderColor: random_random,
                    pointBorderWidth: 3,
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 3,
                    pointRadius: 4,
                    borderJoinStyle: 'round',
                    */
                    data: milk_values,
                    datalabels: {
                      display: true
                    },
                    label: `parity ${unique_parities[i]}`
                  }
                );
              }
            }

            setDataset(dataset_temp);
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


  return (
    <Page>
      {loading && <LinearProgress />}
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardHeader
          action={<GenericMoreButton />}
          title={option === 0 ? "COMBINED LACTATION CURVE (PARITY)" : "COMBINED HERD LACTATION CURVE (PARITY)"}
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Chart
                className={classes.chart}
                labels={labels}
                datasets={dataset}
              />
            </div>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </Page>
  );
};


LactationCurveCombined.propTypes = {
  className: PropTypes.string,
  option: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired
};

export default LactationCurveCombined;
