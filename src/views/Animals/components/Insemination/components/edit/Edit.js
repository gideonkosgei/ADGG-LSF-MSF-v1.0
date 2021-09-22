import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, Fab, CircularProgress, InputAdornment, CardContent, LinearProgress, Grid, Divider, TextField, colors, Button, CardActions, Box, Switch, Typography, Tooltip, IconButton } from '@material-ui/core';
import { getLookups, postOrPutInsemination, getInseminationEventById, getAgents, getStraws, genericFunctionTwoParameters, getServiceProviders } from '../../../../../../utils/API';
import { endpoint_lookup, endpoint_insemination_update, endpoint_insemination_specific, endpoint_agent, endpoint_straw, endpoint_countries_all, endpoint_service_provider } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Sidebar } from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { EventInseminationMetaData } from '../../../Modal';
import { Page } from 'components';
import { Header } from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import { AnimalModal } from '../../../Modal';


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
  const classes = useStyles();
  localStorage.setItem('insemination_event_id', parseInt(props.match.params.id));
  const [{ user_id, organization_id }] = useContext(authContext);
  const [values, setValues] = useState({});
  const [body_scores, setBodyScores] = useState([]);
  const [breed_compositions, setBreedCompositions] = useState([]);
  const [semen_sources, setSemenSources] = useState([]);
  const [bull_breeds, setBullBreeds] = useState([]);
  const [semen_types, setSemenTypes] = useState([]);
  const [ai_types, setAiTypes] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);
  const event_id = localStorage.getItem('insemination_event_id');
  const animal_tag = sessionStorage.getItem('animal_tag');
  const  dob = sessionStorage.getItem('animal_dob'); 
  const [modalStatus, setModalStatus] = useState(false);
  const [agents, setAgents] = useState([]);
  const option_agent = 0;
  const [countries, setCountries] = useState([]);
  const [straws, setStraws] = useState([]);
  const option_straw = 0;
  const sp_option = 0;
  const is_active = 1;
  const [breedingType, setBreedingType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    let mounted_lookup = true;
    let mounted_insemination = true;
    let mounted_agents = true;
    let mounted_countries = true;
    let mounted_straw = true;
    let mounted_sp = true;

    (async (endpoint, org_id, option) => {
      await getServiceProviders(endpoint, org_id, option)
        .then(response => {
          if (mounted_sp) {
            setSemenSources(response.payload);
          }
        });
    })(endpoint_service_provider, organization_id, sp_option);

    (async (endpoint, org_id, option, is_active) => {
      await getStraws(endpoint, org_id, option, is_active)
        .then(response => {
          if (mounted_straw) {
            setStraws(response.payload);
          }
        });
    })(endpoint_straw, organization_id, option_straw, is_active);

    (async (endpoint, desc) => {
      await genericFunctionTwoParameters(endpoint, desc)
        .then(response => {
          if (mounted_countries) {
            setCountries(response.payload);
          }
        });
    })(endpoint_countries_all, 'get all countries');

    (async (endpoint, org_id, option) => {
      await getAgents(endpoint, org_id, option)
        .then(response => {
          if (mounted_agents) {
            setAgents(response.payload);
          }
        });
    })(endpoint_agent, organization_id, option_agent);

    (async (endpoint, id) => {
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {

            const data = response.payload[0];
            let lookup_body_scores = [];
            let lookup_breed_compositions = [];
            let lookup_semen_types = [];
            let lookup_ai_types = [];
            let lookup_breed = [];

            for (let i = 0; i < data.length; i++) {
              // body condition scores
              if (data[i].list_type_id === 71) {
                lookup_body_scores.push(data[i]);
              }

              //breed compositions
              if (data[i].list_type_id === 14) {
                lookup_breed_compositions.push(data[i]);
              }

              //semen types
              if (data[i].list_type_id === 73) {
                lookup_semen_types.push(data[i]);
              }

              //ai Types
              if (data[i].list_type_id === 72) {
                lookup_ai_types.push(data[i]);
              }

              //bull breeds
              if (data[i].list_type_id === 8) {
                lookup_breed.push(data[i]);
              }
            }

            setBodyScores(lookup_body_scores);
            setBreedCompositions(lookup_breed_compositions);
            setBullBreeds(lookup_breed);
            setSemenTypes(lookup_semen_types);
            setAiTypes(lookup_ai_types);
          }
        });
    })(endpoint_lookup, '8,14,71,72,73');

    (async (endpoint, id) => {
      await getInseminationEventById(endpoint, id)
        .then(response => {
          if (mounted_insemination) {
            const data = response.payload[0][0];
            setValues(data);
            setBreedingType(parseInt(data.breeding_type));
            sessionStorage.setItem('_sire_tag_id', data.straw_tag_id);
            sessionStorage.setItem('_sire_breed', data.breed_of_bull);
            sessionStorage.setItem('_sire_breed_composition', data.breed_composition);
            sessionStorage.setItem('_sire_country_of_origin', data.origin_country_bull);
            sessionStorage.setItem('_sire_id', data.sire_id);
            setIsLoading(false);

          }
        });
    })(endpoint_insemination_specific, event_id);



    return () => {
      mounted_lookup = false;
      mounted_insemination = false;
      mounted_agents = false;
      mounted_countries = false;
      mounted_straw = false;
      mounted_sp = false;
    };
  }, [event_id, organization_id]);


  if (!values || !breed_compositions || !straws || !body_scores || !semen_sources || !bull_breeds || !semen_types || !ai_types || !agents || !countries) {
    return null;
  }


  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });

    if (event.target.name === 'breeding_type') {
      sessionStorage.setItem('_sire_tag_id', '');
      sessionStorage.setItem('_sire_breed', '');
      sessionStorage.setItem('_sire_breed_composition', '');
      sessionStorage.setItem('_sire_country_of_origin', '');
      sessionStorage.setItem('_sire_id', '');
      setBreedingType(isNaN(parseInt(event.target.value)) ? null : parseInt(event.target.value));
    }

  };


  const handleSubmit = event => {
    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }

    if (sessionStorage.getItem('_sire_id') === '') {
      setOutput({ status: 0, message: 'Sire not selected' });
      setSuccess(false);
      setLoading(false);

    } else {

      (async (endpoint, id, values, user_id, sire_id) => {
        await postOrPutInsemination(endpoint, id, values, user_id, sire_id)
          .then((response) => {
            setOutput({ status: null, message: '' });
            timer.current = window.setTimeout(() => {
              setSuccess(true);
              setLoading(false);
              if (parseInt(response.status) === 1) {
                setBreedingType(null);
                setOutput({ status: parseInt(response.status), message: response.message });
              } else {
                setOutput({ status: parseInt(response.status), message: response.message })
              }
            }, 500);
          }).catch((error) => {
            setOutput({ status: 0, message: error.message })
            setSuccess(false);
            setLoading(false);
          });
      })(endpoint_insemination_update, event_id, values, user_id, sessionStorage.getItem('_sire_id'));

    }
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


  const handleClickSire = () => {
    setOutput({ status: null, message: '' });
    setModalStatus(true);
  };

  const handleMouseDownSire = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setModalStatus(false);
  };



  return (
    <Page
      className={classes.root}
      title="breeding"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {readOnly ? `BREEDING : ${animal_tag}` : `EDIT BREEDING RECORD : ${animal_tag}`}
      </Typography>
      <br />
      <Header />
      <br />
      {isLoading &&
        <LinearProgress />
      }

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
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: moment(new Date()).format('YYYY-MM-DD'),
                        min: dob,
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      required
                      value={values.service_date}
                      label="Event Date"
                      type="date"
                      name="service_date"
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}

                      label="Cow Body Condition"
                      name="body_condition_score"
                      value={values.body_condition_score}
                      onChange={handleChange}
                      default=""
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      {body_scores.map(body_score => (
                        <option
                          value={body_score.id}
                        >
                          {body_score.id}
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
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)
                      }}
                      label="Breeding Type"
                      name="breeding_type"
                      value={values.breeding_type}
                      onChange={handleChange}
                      required
                      select
                      SelectProps={{ native: true }}
                      variant="outlined"
                    >
                      <option value=""></option>
                      <option value="1"> Artificial Insemination</option>
                      <option value="2"> Natural Mating</option>
                    </TextField>
                  </Grid>

                  {breedingType === 1 ?
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
                          readOnly: Boolean(readOnly),
                          disabled: Boolean(readOnly)
                        }}

                        label="AI Type"
                        name="ai_type"
                        onChange={handleChange}
                        value={values.ai_type}
                        required
                        default=""
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                      >
                        <option value=""></option>
                        {ai_types.map(ai_type => (
                          <option
                            value={ai_type.id}
                          >
                            {ai_type.value}
                          </option>
                        ))
                        }
                      </TextField>
                    </Grid>
                    : null
                  }

                  {(breedingType === 1 || breedingType === 2) ?
                    <>
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
                          label="Bull ID / Straw ID"
                          name="sire_id"
                          onChange={handleChange}
                          value={sessionStorage.getItem('_sire_id') === '' ? '' : sessionStorage.getItem('_sire_tag_id')}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end"  >
                                <IconButton
                                  onClick={handleClickSire}
                                  onMouseDown={handleMouseDownSire}
                                  edge="end"
                                  variant="outlined"
                                  color="inherit"
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      {sessionStorage.getItem('_sire_id') === '' ? null :

                        <>
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
                                readOnly: true,
                                disabled: true
                              }}

                              label="Bull Breed"
                              name="sire_breed_of_bull"
                              onChange={handleChange}
                              value={sessionStorage.getItem('_sire_breed')}
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              <option value=""></option>
                              {bull_breeds.map(bull_breed => (
                                <option
                                  value={bull_breed.id}
                                >
                                  {bull_breed.value}
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
                              inputProps={{
                                readOnly: true,
                                disabled: true
                              }}
                              label="Bull Breed Composition"
                              name="sire_breed_composition"
                              value={sessionStorage.getItem('_sire_breed_composition')}
                              onChange={handleChange}
                              default=""
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                            >
                              <option value=""></option>
                              {breed_compositions.map(breed_composition => (
                                <option
                                  value={breed_composition.id}
                                >
                                  {breed_composition.value}
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

                              inputProps={{
                                readOnly: true,
                                disabled: true
                              }}
                              label="Bull Origin Country"
                              name="sire_origin_country_bull"
                              value={sessionStorage.getItem('_sire_country_of_origin')}
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
                        </>
                      }

                    </>
                    : null
                  }
                  {breedingType === 1 && sessionStorage.getItem('_sire_id') !== '' ?
                    <>
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
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          label="Semen Batch"
                          name="semen_batch"
                          onChange={handleChange}
                          variant="outlined"
                          value={values.semen_batch}
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
                            shrink: true
                          }}
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}

                          label="Straw Semen Type"
                          name="straw_semen_type"
                          onChange={handleChange}
                          value={values.straw_semen_type}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                        >
                          <option value=""></option>
                          {semen_types.map(semen_type => (
                            <option
                              value={semen_type.id}
                            >
                              {semen_type.value}
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
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          label="Semen Source"
                          name="source_of_semen"
                          onChange={handleChange}
                          default=""
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                          value={values.source_of_semen}
                        >
                          <option value=""></option>
                          {semen_sources.map(semen_source => (
                            <option
                              value={semen_source.id}
                            >
                              {semen_source.acronym}
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
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          label="AI Cost"
                          name="cost"
                          value={values.cost}
                          onChange={handleChange}
                          type="number"
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
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          required
                          label="AI Tech"
                          name="field_agent_id"
                          value={values.field_agent_id}
                          onChange={handleChange}
                          variant="outlined"
                          select
                          SelectProps={{ native: true }}
                        >
                          <option value=""></option>
                          {agents.map(agent => (
                            <option
                              value={agent.id}
                            >
                              {agent.name}
                            </option>
                          ))
                          }
                        </TextField>
                      </Grid>

                    </>
                    : null
                  }

                </Grid>
              </CardContent>
              <Divider />
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
            <EventInseminationMetaData
              inseminationDetails={values}
              onClose={handleMetadataClose}
              open={openMetadata}
            />
          </Card>
        </Grid>
      </Grid>
      <AnimalModal
        parentType="sire"
        onClose={handleClose}
        open={modalStatus}
        option={breedingType === 1 ? 0 : 1}
      />
    </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
