import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, Fab, CircularProgress, CardContent, Typography, Grid, TextField, colors, Button, CardActions } from '@material-ui/core';
import { getLookups, postStraw, getServiceProviders, genericFunctionTwoParameters } from '../../../../../../utils/API';
import { endpoint_lookup, endpoint_straw_add, endpoint_service_provider, endpoint_countries_all } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Sidebar } from '../index';
import moment from 'moment';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
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
  const [{ organization_id, user_id }] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [specifications, setSpecification] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [breedCompositions, setBreedCompositions] = useState([]);
  const [service_providers, setServiceProviders] = useState([]);
  const [countries, setCountries] = useState([]);
  const option = 0;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    let mounted_lookup = true;
    let mounted_sp = true;
    let mounted_countries = true;

    (async (endpoint,desc) => {
      await genericFunctionTwoParameters(endpoint,desc)
        .then(response => {
          if (mounted_countries) {
            setCountries(response.payload);
          }
        });
    })(endpoint_countries_all,'get all countries');

    (async (endpoint, org_id, option) => {
      await getServiceProviders(endpoint, org_id, option)
        .then(response => {
          if (mounted_sp) {
            setServiceProviders(response.payload);
          }
        });
    })(endpoint_service_provider, organization_id, option);

    (async (endpoint, id) => {
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {
            const data = response.payload[0];

            let lookup_specification = [];
            let lookup_breed = [];
            let lookup_breed_composition = [];

            for (let i = 0; i < data.length; i++) {
              //specifications
              if (data[i].list_type_id === 20001) {
                lookup_specification.push(data[i]);
              }
              //main breeds
              if (data[i].list_type_id === 8) {
                lookup_breed.push(data[i]);
              }
              //breed Composition
              if (data[i].list_type_id === 14) {
                lookup_breed_composition.push(data[i]);
              }
            }
            setSpecification(lookup_specification);
            setBreedCompositions(lookup_breed_composition);
            setBreeds(lookup_breed);
          }
        });
    })(endpoint_lookup, '20001,8,14');
    return () => {
      mounted_lookup = false;
      mounted_sp = false;
      mounted_countries = false;
    };
  }, [organization_id]);

  if (!breeds || !breedCompositions || !specifications || !service_providers || !countries) {
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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async (endpoint, values, user_id, org_id) => {
      await postStraw(endpoint, values, user_id, org_id)
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

    })(endpoint_straw_add, values, user_id, organization_id);
  }; 

  return (
    <Page
      className={classes.root}
      title="AI Straws"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        AI STRAW REGISTRATION
      </Typography>
      <br />
      <Grid container spacing={1} justify="center">
        <Grid item xs={1} >
          <Sidebar />
        </Grid>
        <Grid item xs={11}>
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
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Semen Source"
                      name="semen_source"
                      onChange={handleChange}
                      variant="outlined"
                      required
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      {service_providers.map(service_provider => (
                        <option
                          value={service_provider.id}
                        >
                          {service_provider.name}
                        </option>
                      ))
                      }
                    </TextField>
                  </Grid>

                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Farm Name/ID"
                      name="farm_name"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      label="Straw ID"
                      name="straw_id"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Semen Bar Code"
                      name="barcode"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Batch Number"
                      name="batch_number"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      label="Bull ID / Tag ID"
                      name="bull_tag_id"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Bull Name"
                      name="bull_name"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Breed of Bull"
                      name="breed"                      
                      onChange={handleChange}
                      default=""
                      select                     
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      {breeds.map(breed => (
                        <option
                          value={breed.id}
                        >
                          {breed.value}
                        </option>
                      ))
                      }
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Bull Breed Composition"
                      name="breed_composition"
                      onChange={handleChange}
                      default=""
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      {breedCompositions.map(comp => (
                        <option
                          value={comp.id}
                        >
                          {comp.value}
                        </option>
                      ))
                      }
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Ejaculation Number"
                      name="ejaculation_number"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: moment(new Date()).format('YYYY-MM-DD')
                      }}
                      label="Production Date"
                      type="date"
                      name="production_date"
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Bull Origin Country"
                      name="origin_country"
                      onChange={handleChange}
                      variant="outlined"
                      select
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
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Specification"
                      name="specification"
                      onChange={handleChange}
                      default=""
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      {specifications.map(spec => (
                        <option
                          value={spec.id}
                        >
                          {spec.value}
                        </option>
                      ))
                      }
                    </TextField>
                  </Grid>


                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}

                      label="Additional Info"
                      name="additional_info"
                      multiline
                      rowsMax={4}
                      rows={3}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>


                </Grid>
              </CardContent>
              <CardActions>
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
              </CardActions>
            </form>

          </Card>
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
