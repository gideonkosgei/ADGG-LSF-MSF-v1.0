import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, Card, Fab, CardActions, CircularProgress, CardContent, LinearProgress, Tooltip, Grid, Divider, TextField, colors, Box, Switch, Typography, IconButton } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { getLookups, genericFunctionFiveParameters, genericFunctionFourParameters, putAnimalDetails, genericFunctionTwoParameters } from '../../../../../../utils/API';
import { endpoint_lookup, endpoint_farms, endpoint_herd, endpoint_animal_update, endpoint_animal, endpoint_countries_all } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { AnimalDetailsMetaData } from '../../../Modal';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import moment from 'moment';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AnimalModal } from '../../../Modal';
import { Page } from 'components';
import { Header } from '../index';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
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
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  toggle: {
    justifyContent: 'center'
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
  localStorage.setItem('animal_id', parseInt(props.match.params.id));
  const { className, ...rest } = props;
  const [{ organization_id }] = useContext(authContext);
  const [{ user_id }] = useContext(authContext);

  const [values, setValues] = useState({});
  const [animal_types, setAnimalTypes] = useState([]);
  const [main_breeds, setMainBreeds] = useState([]);
  const [breed_composition, setBreedComposition] = useState([]);
  const [gender, setGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [sire_types, setSireTypes] = useState([]);
  const [allHerds, setAllHerds] = useState([]);
  const [herds, setHerds] = useState([]);
  const [farms, setFarms] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [deformaties, setDeformaties] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const animal_id = parseInt(props.match.params.id);
  const initial_farm_id = parseInt(props.match.params.farm);
  const [openMetadata, setMetadata] = useState(false);
  const [countries, setCountries] = useState([]);
  const [sex, setSex] = useState();
  const [modalStatus, setModalStatus] = useState(false);
  const [parent, setParent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  sessionStorage.setItem('animal_tag', values.tag_id);
  sessionStorage.setItem('animal_name', values.animal_name);
  sessionStorage.setItem('animal_dob', values.dob);
  sessionStorage.setItem('animal_type', values.animal_type);
  sessionStorage.setItem('farm_id', values.farm_id);  

  useEffect(() => {
    let mounted_lookup = true;
    let mounted_herds = true;
    let mounted_farms = true;
    let mounted_animal_details = true;
    let mounted_countries = true;    

    (async (endpoint, desc) => {
      await genericFunctionTwoParameters(endpoint, desc)
        .then(response => {
          if (mounted_countries) {
            setCountries(response.payload);
          }
        });
    })(endpoint_countries_all, 'get all countries');

    (async (endpoint, id) => {
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {
            const data = response.payload[0];
            let lookup_main_breeds = [];
            let lookup_breed_composition = [];
            let lookup_animal_types = [];
            let lookup_gender = [];
            let lookup_colors = [];
            let lookup_sire_types = [];
            let lookup_deformaties = [];
            let lookup_entry_types = [];

            for (let i = 0; i < data.length; i++) {
              //main breeds
              if (data[i].list_type_id === 8) {
                lookup_main_breeds.push(data[i]);
              }
              //breed Composition
              if (data[i].list_type_id === 14) {
                lookup_breed_composition.push(data[i]);
              }
              //animal Types
              if (data[i].list_type_id === 62) {
                lookup_animal_types.push(data[i]);
              }
              //Gender
              if (data[i].list_type_id === 3) {
                lookup_gender.push(data[i]);
              }
              //Colors
              if (data[i].list_type_id === 83) {
                lookup_colors.push(data[i]);
              }
              //Sire Types
              if (data[i].list_type_id === 13) {
                lookup_sire_types.push(data[i]);
              }
              //deformaties
              if (data[i].list_type_id === 11) {
                lookup_deformaties.push(data[i]);
              }
              //Entry types
              if (data[i].list_type_id === 69) {
                lookup_entry_types.push(data[i]);
              }
            }
            setAnimalTypes(lookup_animal_types);
            setMainBreeds(lookup_main_breeds);
            setBreedComposition(lookup_breed_composition);
            setGender(lookup_gender);
            setColors(lookup_colors);
            setSireTypes(lookup_sire_types);
            setEntryTypes(lookup_entry_types);
            setDeformaties(lookup_deformaties);
          }
        });
    })(endpoint_lookup, '8,14,62,3,83,13,11,69');

    (async (endpoint, desc, option, id, user) => {
      await genericFunctionFiveParameters(endpoint, desc, option, id, user)
        .then(response => {
          if (mounted_herds) {
            setAllHerds(response.payload[0]);
            if (typeof initial_farm_id !== "undefined") {
              let herd_array = [];
              for (let i = 0; i < response.payload[0].length; i++) {
                if (parseInt(response.payload[0][i].farm_id) === initial_farm_id) {
                  herd_array.push(response.payload[0][i]);
                }
              }
              setHerds(herd_array);
            }
          }
        });
    })(endpoint_herd, 'get all herds', 0, user_id, user_id);


    (async (endpoint, desc, _option, _id) => {
      await genericFunctionFourParameters(endpoint, desc, _option, _id)
        .then(response => {
          if (mounted_farms) {
            setFarms(response.payload[0]);
          }
        });
    })(endpoint_farms, 'get all farms', 3, user_id);


    (async (endpoint, desc, id, option) => {
      await genericFunctionFourParameters(endpoint, desc, id, option)
        .then(response => {
          if (mounted_animal_details) {
            const data = response.payload[0];
            setValues(data);
            sessionStorage.setItem('farm_id', data.farm_id);
            setSex(data.sex)
            setIsLoading(false);
            sessionStorage.setItem('_sire_id', !data.sire_id ? '' : data.sire_id);
            sessionStorage.setItem('_dam_id', !data.dam_id ? '' : data.dam_id);
          }
        });
    })(endpoint_animal, 'get animal details -> animal id', 3, animal_id); /* option 3 -> get specific animal details */




    return () => {
      mounted_lookup = false;
      mounted_herds = false;
      mounted_farms = false;
      mounted_animal_details = false;
      mounted_countries = false;
    };
  }, [organization_id, animal_id, user_id, initial_farm_id]);

  if (!countries || !values || !animal_types || !main_breeds || !breed_composition || !gender || !colors || !sire_types || !entryTypes || !deformaties || !allHerds || !farms) {
    return null;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    });

    if (event.target.name === 'animal_type') {
      let selectedSex = (event.target.value === '1' || event.target.value === '2' || event.target.value === '4') ? 2 : 1;
      setSex(selectedSex);
    }

    if (event.target.name === 'farm_id') {
      let herd_array = [];
      for (let i = 0; i < allHerds.length; i++) {
        if (parseInt(allHerds[i].farm_id) === parseInt(event.target.value)) {
          herd_array.push(allHerds[i]);
        }
      }
      setHerds(herd_array);
    }
  };

  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async (endpoint, org_id, values, user_id, animal_id, sire, dam) => {
      await putAnimalDetails(endpoint, org_id, values, user_id, animal_id, sire, dam)
        .then((response) => {
          setOutput({ status: null, message: '' })
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
    })(endpoint_animal_update, organization_id, values, user_id, animal_id,sessionStorage.getItem('_sire_id'), sessionStorage.getItem('_dam_id'));
  };

  const handleMetadataOpen = () => {
    setMetadata(true);
  };
  const handleMetadataClose = () => {
    setMetadata(false);
  };
  const handleClickSire = () => {
    setModalStatus(true);
    setParent('sire');
  };
  const handleMouseDownSire = (event) => {
    event.preventDefault();
  };
  const handleClickDam = () => {
    setModalStatus(true);
    setParent('dam');
  };
  const handleMouseDownDam = (event) => {
    event.preventDefault();
  };
  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <Page
      className={classes.root}
      title="Animal Details"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {`ANIMAL DETAILS : ${values.tag_id}`}
      </Typography>
      <br />
      <Header />
      <br />
      {isLoading &&
        <LinearProgress />
      }
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form id='new_reg' onSubmit={handleSubmit}>
          <CardContent>
            {output.status === 0 ?
              <>
                <Alert severity="error" >{output.message}</Alert>
                <br /><br />
              </>
              : output.status === 1 ?
                <>
                  <Alert severity="success" >{output.message}</Alert>
                  <br /><br />
                </>
                : null
            }

            <Grid container spacing={4} >
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
                    readOnly: true,
                    disabled: true,
                    max: moment(new Date()).format('YYYY-MM-DD')
                  }}

                  label="Registration Date"
                  type="date"
                  name="reg_date"
                  onChange={handleChange}
                  variant="outlined"
                  required
                  value={values.registration_date}
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
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.farm_id}
                  variant="outlined"
                >
                  <option value=""></option>
                  {farms.map(farm => (
                    <option
                      value={farm.id}
                    >
                      {farm.farm_name_code}
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

                  label="Herd"
                  name="herd_id"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.herd_id}
                  variant="outlined"
                >
                  <option value=""></option>
                  {herds.map(herd => (
                    <option
                      value={herd.id}
                    >
                      {herd.herd_name}
                    </option>
                  ))
                  }

                </TextField>
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
                  label="Entry Type"
                  name="entry_type"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={values.entry_type}
                >
                  <option value=""></option>
                  {entryTypes.map(types => (
                    <option
                      value={types.id}
                    >
                      {types.value}
                    </option>
                  ))
                  }
                </TextField>
              </Grid>
              {parseInt(values.entry_type) === 1 ?
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

                    label="Purchase Cost"
                    name="purchase_cost"
                    onChange={handleChange}
                    variant="outlined"
                    type="number"
                    value={values.purchase_cost}
                  />
                </Grid>
                : null}

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

                  label="Origin Country "
                  name="country_of_origin"
                  onChange={handleChange}
                  variant="outlined"
                  value={values.country_of_origin}
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

                  label="Animal Type"
                  name="animal_type"
                  onChange={handleChange}
                  default=""
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={values.animal_type}
                >
                  <option value=""></option>
                  {animal_types.map(types => (
                    <option
                      value={types.id}
                    >
                      {types.value}
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
                    readOnly: true,
                    disabled: true
                  }}


                  label="Sex"
                  name="sex"
                  onChange={handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={sex}
                  variant="outlined"
                >
                  <option value=""></option>
                  {gender.map(sex => (
                    <option
                      value={sex.id}
                    >
                      {sex.value}
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
                    readOnly: Boolean(readOnly)
                  }}

                  label="Tag ID "
                  name="tag_id"
                  onChange={handleChange}
                  required
                  variant="outlined"
                  value={values.tag_id}

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
                  label="Animal Name"
                  name="animal_name"
                  onChange={handleChange}
                  variant="outlined"
                  value={values.animal_name}
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
                    disabled: Boolean(readOnly),
                    max: moment(new Date()).format('YYYY-MM-DD')
                  }}


                  label="DOB"
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  variant="outlined"
                  required
                  value={values.dob}
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

                  label="Breed Composition"
                  name="breed_composition"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}

                  inputProps={{
                    readOnly: Boolean(readOnly),
                    disabled: Boolean(readOnly)
                  }}

                  value={values.breed_composition}
                  variant="outlined"
                >
                  <option value=""></option>
                  {breed_composition.map(breed_comp => (
                    <option
                      value={breed_comp.id}
                    >
                      {breed_comp.value}
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

                  label="Main Breed"
                  name="main_breed"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  value={values.main_breed}
                >
                  <option value=""></option>
                  {main_breeds.map(main_breed => (
                    <option
                      value={main_breed.id}
                    >
                      {main_breed.value}
                    </option>
                  ))
                  }
                </TextField>
              </Grid>
              {parseInt(values.main_breed) === -66 ?
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


                    label="Main Breed Other"
                    name="main_breed_other"
                    onChange={handleChange}
                    variant="outlined"
                    value={values.main_breed_other}
                  />
                </Grid>
                : null}
              {parseInt(values.breed_composition) !== 1 ?
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


                    label="Secondary Breed"
                    name="secondary_breed"
                    onChange={handleChange}
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}
                    variant="outlined"
                    value={values.secondary_breed}
                  >
                    <option value=""></option>
                    {main_breeds.map(main_breed => (
                      <option
                        value={main_breed.id}
                      >
                        {main_breed.value}
                      </option>
                    ))
                    }
                  </TextField>
                </Grid>
                : null}

              {parseInt(values.secondary_breed) === -66 ?

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


                    label="Sec Breed Other"
                    name="secondary_breed_other"
                    onChange={handleChange}
                    variant="outlined"
                    value={values.secondary_breed_other}
                  />
                </Grid>
                : null}

              {parseInt(values.breed_composition) !== 1 ?

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


                    label="Breed Composition Details"
                    name="breed_composition_details"
                    multiline
                    rowsMax={4}
                    onChange={handleChange}
                    variant="outlined"
                    value={values.breed_composition_details}
                  />
                </Grid>
                : null}

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
                  label="Color"
                  name="color"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value={values.color}
                  variant="outlined"
                >
                  <option value=""></option>
                  {colors.map(color => (
                    <option
                      value={color.id}
                    >
                      {color.value}
                    </option>
                  ))
                  }
                </TextField>
              </Grid>

              {parseInt(values.color) === -66 ?
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


                    label="Color Other"
                    name="color_other"
                    onChange={handleChange}
                    variant="outlined"
                    value={values.color_other}
                  />
                </Grid>
                : null}


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

                  label="Sire Type"
                  name="sire_type"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}

                  inputProps={{
                    readOnly: Boolean(readOnly),
                    disabled: Boolean(readOnly)
                  }}

                  value={values.sire_type}
                  variant="outlined"
                >
                  <option value=""></option>
                  {sire_types.map(sire_type => (
                    <option
                      value={sire_type.id}
                    >
                      {sire_type.value}
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
                  InputProps={{  
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end"  >
                        <IconButton
                          edge="end"
                          variant="outlined"
                          color="inherit"
                          onClick={handleClickSire}
                          onMouseDown={handleMouseDownSire}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label="Sire ID"
                  name="sire_id"
                  onChange={handleChange}
                  variant="outlined"
                  value={sessionStorage.getItem('_sire_id')}
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

                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end"  >
                        <IconButton
                          edge="end"
                          variant="outlined"
                          color="inherit"
                          onClick={handleClickDam}
                          onMouseDown={handleMouseDownDam}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}

                  label="Dam"
                  name="dam_id"
                  onChange={handleChange}
                  variant="outlined"
                  value={sessionStorage.getItem('_dam_id')}
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

                  label="Deformaties"
                  name="deformaties"
                  onChange={handleChange}
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  inputProps={{
                    readOnly: Boolean(readOnly),
                    disabled: Boolean(readOnly)
                  }}

                  value={values.deformaties}
                  variant="outlined"
                >
                  <option value=""></option>
                  {deformaties.map(deformaty => (
                    <option
                      value={deformaty.id}
                    >
                      {deformaty.value}
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


                  label="Hair Sample ID"
                  name="hair_sample_id"
                  onChange={handleChange}
                  variant="outlined"
                  type="number"
                  value={values.hair_sample_id}

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

                  label="Herd Book Info"
                  name="herd_book_number"
                  onChange={handleChange}
                  variant="outlined"
                  value={values.herd_book_number}
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
                  label="Notes"
                  name="notes"
                  multiline
                  rowsMax={4}
                  onChange={handleChange}
                  variant="outlined"
                  value={values.notes}
                />
              </Grid>
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
              <Tooltip title="Metadata">
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

        <AnimalDetailsMetaData
          animalDetails={values}
          onClose={handleMetadataClose}
          open={openMetadata}
        />
        <AnimalModal
          parentType={parent}
          onClose={handleClose}
          open={modalStatus}
        />
      </Card>
    </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
