import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, Fab, LinearProgress, CircularProgress, Box, CardContent, Typography, Grid, TextField, colors, Button, CardActions, Switch, Tooltip } from '@material-ui/core';
import { putHerd, getCountries, getAdminUnits, genericFunctionFourParameters, genericFunctionFiveParameters, genericFunctionSixParameters } from '../../../../../../utils/API';
import { endpoint_herd_update, endpoint_countries, endpoint_admin_units, endpoint_farms, endpoint_herd, endpoint_admin_units_all } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Header } from '../Header';
import { default as Statistics } from '../../../../../Overview/components/Statistics';
import { default as AnimalCategorySegmentation } from '../../../../../DashboardAnalytics/components/AnimalCategorySegmentation';
import { default as BreedDistribution } from '../../../../../DashboardAnalytics/components/BreedDistribution';
import { default as EventsSummary } from '../../../../../DashboardAnalytics/components/EventsSummary';
import { default as Animals } from '../../../../../Animals'
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { MetaData } from '../Modal';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
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

const Edit = props => {
  const [{ organization_id, user_id, country_id }] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [villages, setVillages] = useState([]);
  const [farms, setFarms] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const option = 1;
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState({
    unit1: 'Regions',
    unit2: 'District',
    unit3: 'Ward',
    unit4: 'Village'
  });

  const timer = React.useRef();
  const herd_id = parseInt(props.match.params.id);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  async function adminUnits(endpoint, unit, option) {
    await getAdminUnits(endpoint, unit, option)
      .then(response => {
        if (option === 1) {
          if (isNaN(unit)) {
            setRegions([]);
          } else {
            setRegions(response.payload[0]);
          }

          setDistricts([]);
          setWards([]);
          setVillages([]);
        }

        if (option === 2) {

          if (isNaN(unit)) {
            setDistricts([]);
          } else {
            setDistricts(response.payload[0]);
          }
          setWards([]);
          setVillages([]);
        }

        if (option === 3) {
          if (isNaN(unit)) {
            setWards([]);
          } else {
            setWards(response.payload[0]);
          }
          setVillages([]);
        }
        if (option === 4) {
          if (isNaN(unit)) {
            setVillages([]);
          } else {
            setVillages(response.payload[0]);
          }
        }

      });
  };

  async function adminUnitsAll(endpoint, desc, country, region, district, ward) {
    await genericFunctionSixParameters(endpoint, desc, country, region, district, ward)
      .then(response => {
        let data = response.payload[0];
        let regions = [];
        let districts = [];
        let wards = [];
        let villages = [];

        for (let i = 0; i < data.length; i++) {
          if (data[i].option === 1) {
            regions.push(data[i]);
          }

          if (data[i].option === 2) {
            districts.push(data[i]);
          }

          if (data[i].option === 3) {
            wards.push(data[i]);
          }

          if (data[i].option === 4) {
            villages.push(data[i]);
          }
        }
        setRegions(regions);
        setDistricts(districts);
        setWards(wards);
        setVillages(villages);
      });
  };

  useEffect(() => {
    let mounted_countries = true;
    let mounted_farms = true;
    let mounted = true;


    (async (endpoint) => {
      await getCountries(endpoint)
        .then(response => {
          if (mounted_countries) {
            setCountries(response.payload);

            if (country_id && country_id !== '') {
              let getUnits = response.payload.find(country => country.id === parseInt(country_id));
              setUnits({
                unit1: getUnits.unit1_name,
                unit2: getUnits.unit2_name,
                unit3: getUnits.unit3_name,
                unit4: getUnits.unit4_name
              });
            }

          }
        });
    })(endpoint_countries);


    (async (endpoint, desc, option, id, user) => {
      await genericFunctionFiveParameters(endpoint, desc, option, id, user)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0][0]);
            adminUnitsAll(
              endpoint_admin_units_all,
              'all units',
              response.payload[0][0].country,
              response.payload[0][0].region,
              response.payload[0][0].district,
              response.payload[0][0].ward
            );
          }
        });
    })(endpoint_herd, 'get herd details', option, herd_id, user_id);





    (async (endpoint, desc, option, id) => {
      await genericFunctionFourParameters(endpoint, desc, option, id)
        .then(response => {
          if (mounted_farms) {
            setFarms(response.payload[0]);
          }
        });
    })(endpoint_farms, 'get farms', 3, user_id);

    return () => {
      mounted_countries = false;
      mounted_farms = false;
      mounted = false;
    };
  }, [organization_id, herd_id, country_id, user_id]);

  if (!countries || !farms || !values) {
    return null;
  }
  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });
    if (event.target.name === 'country') {
      adminUnits(endpoint_admin_units, parseInt(event.target.value), 1);
      if (event.target.value !== '') {
        let getUnits = countries.find(country => country.id === parseInt(event.target.value));
        setUnits({
          unit1: getUnits.unit1_name,
          unit2: getUnits.unit2_name,
          unit3: getUnits.unit3_name,
          unit4: getUnits.unit4_name
        });
      }
    }

    if (event.target.name === 'region') {
      adminUnits(endpoint_admin_units, parseInt(event.target.value), 2);
    }

    if (event.target.name === 'district') {
      adminUnits(endpoint_admin_units, parseInt(event.target.value), 3);
    }

    if (event.target.name === 'ward') {
      adminUnits(endpoint_admin_units, parseInt(event.target.value), 4);
    }

  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async (endpoint, values, user_id, rec_id) => {
      await putHerd(endpoint, values, user_id, rec_id)
        .then((response) => {
          setOutput({ status: null, message: '' });
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            if (parseInt(response.status) === 1) {
              setOutput({ status: parseInt(response.status), message: response.message })
            } else {
              setOutput({ status: parseInt(response.status), message: response.message })
            }
          }, 500);
        }).catch((error) => {
          setOutput({ status: 0, message: error.message })
          setSuccess(false);
          setLoading(false);
        });

    })(endpoint_herd_update, values, user_id, organization_id);
  };


  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);
  };

  const handleMetadataOpen = () => {
    setMetadata(true);
  };
  const handleMetadataClose = () => {
    setMetadata(false);
  };


  return (
    <Page
      className={classes.root}
      title="herd register"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {readOnly ? `HERD - ${values.herd_name}` : `EDIT HERD  - ${values.herd_name}`}
      </Typography>
      <br />
      <Header />

      <br />
      {isLoading &&
        <LinearProgress />
      }
      <Grid container spacing={1} justify="center">

        <Grid
          item
          lg={12}
          xl={12}
          xs={12}
        >
          <EventsSummary org={organization_id} level={1} herd={herd_id} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <form id='event' onSubmit={handleSubmit} >
              <CardContent>
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

                <Grid
                  container
                  spacing={4}
                >
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),
                        max: moment(new Date()).format('YYYY-MM-DD')
                      }}

                      label="Registration Date"
                      type="date"
                      name="reg_date"
                      value={values.reg_date}
                      onChange={handleChange}
                      variant="outlined"
                      required
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}

                      label="Herd Name"
                      name="herd_name"
                      value={values.herd_name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    md={4}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      required
                      label="Farm"
                      name="farm_id"
                      value={values.farm_id}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {farms.map(farm => (
                        <option
                          value={farm.id}
                        >
                          {(typeof farm.code === 'undefined' || farm.code === null) ? farm.name : `${farm.name} - ${farm.code}`}
                        </option>
                      ))
                      }
                    </TextField>
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      label="Country"
                      name="country"
                      required
                      value={values.country}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {countries.map(country => (
                        <option
                          value={country.id}
                        >
                          {country.name}
                        </option>
                      ))
                      }
                    </TextField>
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      label={units.unit1}
                      name="region"
                      value={values.region}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {regions.map(region => (
                        <option
                          value={region.id}
                        >
                          {region.name}
                        </option>
                      ))
                      }
                    </TextField>
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}

                      label={units.unit2}
                      name="district"
                      value={values.district}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {districts.map(district => (
                        <option
                          value={district.id}
                        >
                          {district.name}
                        </option>
                      ))
                      }
                    </TextField>
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      label={units.unit3}
                      name="ward"
                      value={values.ward}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {wards.map(ward => (
                        <option
                          value={ward.id}
                        >
                          {ward.name}
                        </option>
                      ))
                      }
                    </TextField>
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}

                      label={units.unit4}
                      name="village"
                      value={values.village}
                      onChange={handleChange}
                      variant="outlined" select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {villages.map(village => (
                        <option
                          value={village.id}
                        >
                          {village.name}
                        </option>
                      ))
                      }
                    </TextField>
                  </Grid>


                </Grid>
              </CardContent>
              <CardActions>
                {readOnly ? null :
                  <>
                    <div className={classes.wrapper}>
                      <Fab
                        aria-label="save"
                        color="primary"
                        className={buttonClassname}
                      >
                        {success ? <CheckIcon /> : <SaveIcon />}
                      </Fab>
                      {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                    </div>
                    <div className={classes.wrapper}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={buttonClassname}
                        disabled={loading}
                        type="submit"
                      >
                        Save Changes
                      </Button>
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                  </>
                }
                <Box>
                  <Tooltip title="view Metadata">
                    <Button onClick={handleMetadataOpen}>
                      <OpenInNewIcon className={classes.buttonIcon} />
                    </Button>
                  </Tooltip>
                </Box>
                <Box>
                  <Typography variant="h6">{readOnly ? "Enable Form" : "Disable Form"} </Typography>
                </Box>
                <Box>
                  <Switch
                    className={classes.toggle}
                    checked={values.readOnly}
                    color="secondary"
                    edge="start"
                    onChange={handleSwitchChange}
                  />
                </Box>


              </CardActions>
            </form>
            <MetaData
              Details={values}
              onClose={handleMetadataClose}
              open={openMetadata}
            />

          </Card>
        </Grid>
      </Grid>

      <Typography
        component="h2"
        gutterBottom
        variant="h4"
      >
        <br />
        {`HERD SUMMARY - ${values.herd_name}`}
      </Typography>
      <br />
      <Statistics className={classes.statistics} org={organization_id} level={1} herd={herd_id} />
      <br />
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={5}
          xl={4}
          xs={12}
        >
          <AnimalCategorySegmentation org={organization_id} level={1} herd={herd_id} />
        </Grid>
        <Grid
          item
          lg={7}
          xl={4}
          xs={12}
        >
          <BreedDistribution org={organization_id} level={1} herd={herd_id} />
        </Grid>
        <Grid
          item
          lg={12}
          xl={12}
          xs={12}
        >
          <Animals HerdIdProp={herd_id} />
        </Grid>
      </Grid>

    </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
