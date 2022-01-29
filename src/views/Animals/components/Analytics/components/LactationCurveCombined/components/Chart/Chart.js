import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  }
}));


const Chart = props => {
  const { className, datasets, labels, ...rest } = props;
  const classes = useStyles();

  const ChartData = {
    labels: labels,
    datasets: datasets
  };

  const chartOptions = {
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            display: true,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Daily Average Milk (ltrs)'
          }       

        }
      ],
      xAxes: [
        {
          ticks: {
            display: true,
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: '#eeeff8',
            drawBorder: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Days In Milk'
          }
        }
      ]
    },
    legend: {
      display: true
    },
    responsive: true,
    maintainAspectRatio: false
  };


  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >


      <Line data={ChartData} options={chartOptions} />
    </div>
  );
};

Chart.propTypes = {
  className: PropTypes.string,
  datasets: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};

export default Chart;
