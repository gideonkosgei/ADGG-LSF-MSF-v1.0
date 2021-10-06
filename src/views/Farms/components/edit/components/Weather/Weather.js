import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Button, CardActions, Box, Switch, Fab, CircularProgress, Typography, LinearProgress, TextField, Grid, colors } from '@material-ui/core';
import { genericFunctionSixParameters, genericFunctionFiveParameters } from '../../../../../../utils/API';
import { AverageTemp, MaxTemp, MinTemp, RelativeHumidity } from './components';
import { endpoint_weather, endpoint_nasa_power } from '../../../../../../configs/endpoints';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    //padding: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const Weather = props => {
  const { farm_id } = props;
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [successApi, setSuccessApi] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [outputApi, setOutputApi] = useState({ status: null, message: "" });
  const [showApiCallSection, setShowApiCallSection] = useState(false);
  const [showDataTableSection, setShowDataTableSection] = useState(false);

  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const buttonClassnameApi = clsx({
    [classes.buttonSuccess]: successApi,
  });


  const defaults = {
    option: 2,
    date_from: moment(new Date(new Date().getFullYear(), 0, 1)).format('YYYY-MM-DD'),
    date_to: moment(new Date()).format('YYYY-MM-DD')
  }

  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, id, option, date_from, date_to) => {
      await genericFunctionSixParameters(endpoint, desc, id, option, date_from, date_to)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setData(response.payload);
            if (parseInt(response.payload[0].period) === 0) {
              setOutput({ status: 0, message: 'Data not found. Reasons for this may include: (1) Location details not set (2) Invalid location details (3) Outdated data - Invoke NASA POWER API  ' });
            }
          }
        });
    })(endpoint_weather, 'weather data', farm_id, defaults.option, defaults.date_from, defaults.date_to);

    return () => {
      mounted = false;
    };
  }, [farm_id, defaults.option, defaults.date_from, defaults.date_to]);

  if (!values) {
    return null;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setOutput({ status: null, message: '' });
    setOutputApi({ status: null, message: '' });
    setShowApiCallSection(false);

    if (values.date_from > values.date_to) {
      setOutput({ status: 0, message: 'Date error. End Date cannot come earlier than Start date' });
    } else {

      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }

      (async (endpoint, desc, id, option, date_from, date_to) => {
        await genericFunctionSixParameters(endpoint, desc, id, option, date_from, date_to)
          .then(response => {
            timer.current = window.setTimeout(() => {
              setSuccess(true);
              setLoading(false);
              setIsLoading(false);
              setData(response.payload);

              if (parseInt(response.payload[0].period) === 0) {
                setOutput({ status: 0, message: 'Data not found. Reasons for this may include: (1) Location details not set (2) Invalid location details (3) Outdated data - Invoke NASA POWER API  ' });
              }

            }, 500);
          });
      })(endpoint_weather, 'weather data', farm_id, values.option, values.date_from, values.date_to);
    }
  };

  const handleSubmitApiCall = event => {
    event.preventDefault();
    setOutput({ status: null, message: '' });
    setOutputApi({ status: null, message: '' });
    setSuccess(false);
    setLoading(false);

    if (parseInt(data[0].longitude) === 0 || parseInt(data[0].latitude) === 0) {
      setOutputApi({ status: 0, message: 'Location details is either not set or invalid' });
      setSuccess(false);
      setLoading(false);
    } else {

      if (!loadingApi) {
        setSuccessApi(false);
        setLoadingApi(true);
        setSuccess(false);
        setLoading(false);
      }

      let rec_id = parseInt(data[0].id);
      let longitude = data[0].longitude;
      let latitide = data[0].latitude;

      (async (endpoint, desc, id, longitude, latitide) => {
        await genericFunctionFiveParameters(endpoint, desc, id, longitude, latitide)
          .then(response => {
            timer.current = window.setTimeout(() => {
              setSuccessApi(true);
              setLoadingApi(false);
              setSuccess(false);
              setLoading(false);
              setOutputApi({ status: parseInt(response.status), message: response.message })
            }, 500);
          });
      })(endpoint_nasa_power, 'fetch data by invoking data data api', rec_id, longitude, latitide);
    }

  };

  const handleShowAPiSwitch = event => {
    event.persist();
    setOutputApi({ status: null, message: '' });
    setShowApiCallSection(!showApiCallSection);
  };

  const handleShowDataTableSwitch = event => {
    event.persist();
    setShowDataTableSection(!showDataTableSection);
  };


  const columns = [
    { name: "period", label: "PERIOD/DATE", options: { filter: false, sort: false, display: true } },
    { name: "T2M", label: "AVERAGE TEMPERATURE", options: { filter: false, sort: true, display: true } },
    { name: "T2M_MAX", label: "MAXIMUM TEMPERATURE", options: { filter: false, sort: true, display: true } },
    { name: "T2M_MIN", label: "MINUMUM TEMPERATURE", options: { filter: false, sort: true, display: true } },
    { name: "RH2M", label: "RELATIVE HUMIDITY", options: { filter: false, sort: true, display: true } },
  ];

  
  const options = {       
    filter: true,
    rowsPerPage: 10,       
    rowsPerPageOptions :[5,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'stacked',                
    rowHover: true,       
    setTableProps: () => {
     return {
       padding: "none" ,         
       size: "small",
     };
   }
  }; 
  

  return (
    <Page
      className={classes.root}
      title="herd register"
    >
      {output.status === 0 ?
        <>
          <Alert severity="error" >{output.message}</Alert>
        </>
        : output.status === 1 ?
          <>
            <Alert severity="success" >{output.message}</Alert>
          </>
          : null
      }
      <br />
      <form onSubmit={handleSubmit} >
        <Grid container spacing={2} >
          <Grid
            item
            md={2}
            xs={12}
          >
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: moment(new Date()).format('YYYY-MM-DD'),
              }}
              required
              label="START"
              type="date"
              name="date_from"
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>


          <Grid
            item
            md={2}
            xs={12}
          >
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: moment(new Date()).format('YYYY-MM-DD'),
              }}
              required
              label="END"
              type="date"
              name="date_to"
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>


          <Grid
            item
            md={2}
            xs={12}
          >
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="OPTION"
              name="option"
              required
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="1">Daily</option>
              <option value="2">Monthly</option>
              <option value="3">Anually</option>

            </TextField>
          </Grid>

          <Grid
            item
            md={2}
            xs={12}
          >
            <div className={classes.wrapper}>
              <Fab
                aria-label="save"
                color="primary"
                className={buttonClassname}
                type="submit"
              >
                {success ? <CheckIcon /> : <SearchIcon />}
              </Fab>
              {loading && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
          </Grid>
        </Grid>
      </form>
      <form onSubmit={handleSubmitApiCall} >
        <Grid container spacing={2} >
          <Grid
            item
            md={12}
            xs={12}
          >
            <Typography variant="h6">Important Notes</Typography>
            <Typography variant="body2">
              1. Data is obtained from <b>NASA POWER PROJECT </b> which provides solar and meteorological data sets from NASA research for support of renewable energy, building energy efficiency and agricultural needs <br />
              2. Weather data is from <b>01/01/2016</b> to the date of last fetch. If not current, Invoke the NASA POWER API. Special accomodations can be provided if data for an earlier data range is required<br />
              3. If weather details is not populated, check if the location details of the farm is set and are within limits before Invoking the NASA POWER API  <br />
              4. Latitudes range from <b>-90</b> to <b>90</b>, and longitudes range from <b>-180</b> to <b>180</b><br />
              5. Invoke the NASA POWER API to refresh weather data
            </Typography>
          </Grid>

          <Grid
            item
            md={12}
            xs={12}
          >

            <Box>
              <Typography variant="h6">{showApiCallSection ? "Hide Section" : "Invoke NASA POWER API"} </Typography>
            </Box>
            <Box>
              <Switch
                className={classes.toggle}
                checked={showApiCallSection}
                color="secondary"
                edge="start"
                onChange={handleShowAPiSwitch}
              />
            </Box>
          </Grid>

          {showApiCallSection ?
            <>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Typography variant="h6">Steps</Typography>
                <Typography variant="body2">
                  1. Click the Invoke NASA POWER API button to get weather data from <b>01/01/2016</b> to the current date<br />
                </Typography>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Card>

                  <CardContent>
                    {outputApi.status === 0 ?
                      <>
                        <Alert severity="error" >{outputApi.message}</Alert>
                      </>
                      : outputApi.status === 1 ?
                        <>
                          <Alert severity="success" >{outputApi.message}</Alert>
                        </>
                        : null
                    }
                  </CardContent>
                  <CardActions>
                    <div className={classes.wrapper}>
                      <Fab
                        aria-label="save"
                        color="primary"
                        className={buttonClassnameApi}
                      >
                        {successApi ? <CheckIcon /> : <GetAppIcon />}
                      </Fab>
                      {loadingApi && <CircularProgress size={68} className={classes.fabProgress} />}
                    </div>
                    <div className={classes.wrapper}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={buttonClassnameApi}
                        disabled={loadingApi}
                        type="submit"
                      >
                        Invoke NASA POWER API
                      </Button>
                      {loadingApi && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                  </CardActions>

                </Card>
              </Grid>

            </>
            : null}

        </Grid>
      </form>
        
      <br />
      {isLoading &&
        <LinearProgress />
      }
      <br />

      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <AverageTemp data={data} />
        </Grid>

        <Grid item xs={12}>
          <MaxTemp data={data} />
        </Grid>

        <Grid item xs={12}>
          <MinTemp data={data} />
        </Grid>

        <Grid item xs={12}>
          <RelativeHumidity data={data} />
        </Grid>

      </Grid>
      <br /><br />
      <Grid container spacing={2} >
          <Grid
            item
            md={12}
            xs={12}
          >

            <Box>
              <Typography variant="h6">{showDataTableSection ? "Hide Data Tables" : "View Data Tables"} </Typography>
            </Box>
            <Box>
              <Switch
                className={classes.toggle}
                checked={showDataTableSection}
                color="secondary"
                edge="start"
                onChange={handleShowDataTableSwitch}
              />
            </Box>
          </Grid>

          {showDataTableSection ?
            <>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Card>
                  <CardContent>

                  <PerfectScrollbar>
                <MuiThemeProvider>
                  <MUIDataTable
                    title={`COORDINATES(${data[0].latitude},${data[0].longitude})`}
                    data={data}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </PerfectScrollbar>
                   
                  </CardContent>
                </Card>
              </Grid>

            </>
            : null}

        </Grid>
    

    </Page>
  );
};

Weather.propTypes = {
  farm_id: PropTypes.number.isRequired
};
export default Weather;
