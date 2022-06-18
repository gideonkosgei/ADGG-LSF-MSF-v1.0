import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal, CircularProgress, Card, Fab, Box, Switch, Typography, CardContent, LinearProgress, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import authContext from '../../../../../../../../../contexts/AuthContext';
import { genericFunctionFiveParameters, batchProcessActions, animalBatchModifyRevalidate, getLookups } from '../../../../../../../../../utils/API';
import { endpoint_batch_details, endpoint_batch_actions, endpoint_animalRevalidate, endpoint_lookup,endpoint_herd } from '../../../../../../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';


const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '85%',
    maxHeight: '95%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  details: {
    color: 'green'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
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
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const Details = props => {
  const { open, onClose, className,batch_type, record_id, ...rest } = props;
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [{ organization_id, user_id }] = useContext(authContext);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [animal_types, setAnimalTypes] = useState([]);
  const [main_breeds, setMainBreeds] = useState([]);
  const [breed_composition, setBreedComposition] = useState([]);
  const [gender, setGender] = useState([]);
  const [yesNo, setYesNo] = useState([]);
  const [colors, setColors] = useState([]);
  const [sire_types, setSireTypes] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [deformaties, setDeformaties] = useState([]);
  const [herds, setHerds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [action, setAction] = useState(1);
  const option_errors = 0;
  const option_details = 1;


  const timer = React.useRef();
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  async function refresh(endpoint, desc, id, type, option) {
    setErrors([]);
    setIsLoading(true);
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    await genericFunctionFiveParameters(endpoint, desc, id, type, option)
      .then(response => {
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);
          setErrors(response.payload);
        }, 500);
      }).catch(() => {
        setSuccess(false);
        setLoading(false);
        setIsLoading(true);
      });
  }

  async function validate(_endpoint, _uuid, _action, _user_id) {
    setIsLoading(true);
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    await batchProcessActions(_endpoint, _uuid, _action, _user_id)
      .then((response) => {
        setOutput({ status: null, message: '' });
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);
          setOutput({ status: 1, message: "Validation complete. Execute refresh to check status"  }); 
        }, 500);

      }).catch((error) => {
        setOutput({ status: 0, message: error.message })
        setSuccess(false);
        setLoading(false);
        setIsLoading(false);
      });
  }

  async function save(endpoint, values, record_id, user_id, batch_type) {
    setIsLoading(true);
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    await animalBatchModifyRevalidate(endpoint, values, record_id, user_id, batch_type)
      .then((response) => {
        console.log(response);
        setOutput({ status: null, message: '' });
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);          
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
        setIsLoading(true);
      });
  }

  useEffect(() => {
    let mounted = true;
    let mounted_lookup = true;

    (async (endpoint, desc, id, type, option) => {
      await genericFunctionFiveParameters(endpoint, desc, id, type, option)
        .then(response => {
          if (mounted) {
            setErrors(response.payload);
          }
        });
    })(endpoint_batch_details, 'error details', record_id, batch_type, option_errors);

    (async (endpoint, desc, id, type, option) => {
      setIsLoading(true);
      await genericFunctionFiveParameters(endpoint, desc, id, type, option)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0]);
          }
        });
    })(endpoint_batch_details, 'Batch records details', record_id, batch_type, option_details);

    (async (endpoint, desc, option, id, user) => {
      await genericFunctionFiveParameters(endpoint, desc, option, id, user)
        .then(response => {
          if (mounted) {
            setHerds(response.payload[0]);
          }
        });
    })(endpoint_herd, 'Get herds', 3, record_id, user_id );


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
            let lookup_yes_no = [];

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
              //Yes No
              if (data[i].list_type_id === 67) {
                lookup_yes_no.push(data[i]);
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
            setYesNo(lookup_yes_no);
          }
        });
    })(endpoint_lookup, '8,14,62,3,83,13,11,69,67');

    return () => {
      mounted = false;
      mounted_lookup = false;
    };
  }, [record_id, organization_id,batch_type,user_id]);

  if (!errors || !animal_types || !main_breeds || !breed_composition || !gender || !colors || !sire_types || !entryTypes || !deformaties || !yesNo || !values || !herds) {
    return null;
  }

  


  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value

    });
  };

  const handleChangeAction = event => {
    setSuccess(false);
    event.persist();
    setAction(parseInt(event.target.value));
  };

  const handleClickExecute = () => {
    setOutput({ status: null, message: '' });
    switch (action) {
      case 1: // refresh
        refresh(endpoint_batch_details, 'error details', record_id, batch_type, option_errors);
        break;
      case 2: // validate
        validate(endpoint_batch_actions, values.uuid, 1, user_id);
        break;
      case 3: // save
        save(endpoint_animalRevalidate, values, record_id, user_id, batch_type);
        break;
      default:
      // Do nothing: Invalid option
    }
  };


  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >

        <CardContent>
          <CardHeader title="ANIMAL REGISTRATION RECORD" />
          <Divider />
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
          <div className={classes.inner}>
            <br />
            {errors.length > 0 ?
              <Alert severity="error" >
                {
                  errors.map(error => (
                    <>{error.error_condition} <br /></>
                  ))
                }
              </Alert>
              : null
            }

            <br />
            {isLoading &&
              <>
                <LinearProgress />
                <br />
              </>
            }
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

                  margin='dense'
                  label="Farmer Name"
                  value={values.farmer_name}
                  variant="outlined"
                  name="farmer_name"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Herd"
                  value={values.herd_id}
                  variant="outlined"
                  name="herd_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  {herds.map(herd => (
                    <option
                      value={herd.herd_id}
                    >
                      {herd.herd_name}
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
                  margin='dense'
                  type="date"
                  label="Registration Date"
                  value={values.reg_date}
                  variant="outlined"
                  name="reg_date"
                  onChange={handleChange}
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

                  margin='dense'
                  type="date"
                  label="Entry Date"
                  value={values.entry_date}
                  variant="outlined"
                  name="entry_date"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Entry Type"
                  value={values.entry_type_id}
                  variant="outlined"
                  name="entry_type_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
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

                  margin='dense'
                  label="Tag Prefix"
                  value={values.tag_prefix}
                  variant="outlined"
                  name="tag_prefix"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Tag Sequence"
                  value={values.tag_sequence}
                  variant="outlined"
                  name="tag_sequence"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Tag ID"
                  value={values.tag_id}
                  variant="outlined"
                  name="tag_id"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Animal Name"
                  value={values.animal_name}
                  variant="outlined"
                  name="animal_name"
                  onChange={handleChange}
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

                  type="date"
                  margin='dense'
                  label="DOB"
                  value={values.date_of_birth}
                  variant="outlined"
                  name="date_of_birth"
                  onChange={handleChange}

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

                  type="date"
                  margin='dense'
                  label="Derived Birth Date"
                  value={values.derived_birth_date}
                  variant="outlined"
                  name="derived_birth_date"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Approximate Age"
                  value={values.approx_age}
                  variant="outlined"
                  name="approx_age"
                  onChange={handleChange}
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
                  required
                  margin='dense'
                  label="Main Breed"
                  variant="outlined"
                  value={values.main_breed_id}
                  name="main_breed_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}

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


                  margin='dense'
                  label="Secondary Breed"
                  variant="outlined"
                  value={values.secondary_breed_id}
                  name="secondary_breed_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}

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

                  margin='dense'
                  label="Breed Composition"
                  variant="outlined"
                  value={values.breed_composition_id}
                  name="breed_composition_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
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


                  margin='dense'
                  label="Animal Type"
                  variant="outlined"
                  value={values.animal_type_id}
                  name="animal_type_id"
                  onChange={handleChange} select
                  SelectProps={{ native: true }}

                >
                  <option value=""></option>
                  {animal_types.map(animal_type => (
                    <option
                      value={animal_type.id}
                    >
                      {animal_type.value}
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


                  margin='dense'
                  label="Color"
                  variant="outlined"
                  value={values.color_id}
                  name="color_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
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

                  margin='dense'
                  label="Dam Known"
                  variant="outlined"
                  value={values.dam_known_id}
                  name="dam_known_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  {yesNo.map(yn => (
                    <option
                      value={yn.id}
                    >
                      {yn.value}
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


                  margin='dense'
                  label="Dam Tag ID"
                  variant="outlined"
                  value={values.dam_tag_id}
                  name="dam_tag_id"
                  onChange={handleChange}
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


                  margin='dense'
                  label="Sire Known"
                  value={values.sire_known_id}
                  variant="outlined"
                  name="sire_known_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  {yesNo.map(yn => (
                    <option
                      value={yn.id}
                    >
                      {yn.value}
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
                  margin='dense'
                  label="Sire Type"
                  value={values.sire_type_id}
                  variant="outlined"
                  name="sire_type_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
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
                  margin='dense'
                  label="Sire Tag ID"
                  value={values.sire_tag_id}
                  variant="outlined"
                  name="sire_tag_id"
                  onChange={handleChange}
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
                  margin='dense'
                  type="number"
                  label="Purchase Cost"
                  value={values.Purchase_cost}
                  variant="outlined"
                  name="Purchase_cost"
                  onChange={handleChange}
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
                  margin='dense'
                  label="Deformaties"
                  value={values.deformaties_id}
                  variant="outlined"
                  name="deformaties_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  {deformaties.map(d => (
                    <option
                      value={d.id}
                    >
                      {d.value}
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

                  type="number"
                  margin='dense'
                  label="Altitude"
                  value={values.altitude}
                  variant="outlined"
                  name="altitude"
                  onChange={handleChange}
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
                  margin='dense'
                  type="number"
                  label="Latitude"
                  value={values.latitude}
                  variant="outlined"
                  name="latitude"
                  onChange={handleChange}
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
                  margin='dense'
                  type="number"
                  label="Longitute"
                  value={values.longitude}
                  variant="outlined"
                  name="longitude"
                  onChange={handleChange}
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
                  type="number"
                  margin='dense'
                  label="GPRS accuracy"
                  value={values.grps_accuracy}
                  variant="outlined"
                  name="grps_accuracy"
                  onChange={handleChange}
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
                  margin='dense'
                  label="Hair Sample ID"
                  value={values.hair_sample_id}
                  variant="outlined"
                  name="hair_sample_id"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Created By"
                  value={values.created_by}
                  variant="outlined"
                  onChange={handleChange}
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
                  margin='dense'
                  label='Created Date'
                  value={values.created_date}
                  variant="outlined"
                  onChange={handleChange}
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

                  margin='dense'
                  label="Time Created"
                  value={values.created_time}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <Box >
                  <Typography variant="h6">{values.remove ? "Remove(Yes)" : "Remove(No)"} </Typography>
                </Box>
                <Box>
                  <Switch
                    name="remove"
                    className={classes.toggle}
                    onChange={handleChange}
                    checked={(values.remove) ? true : false}
                    color="secondary"
                    edge="start"
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </CardContent>
        <CardActions className={classes.actions}>
          <Grid
            container
            spacing={2}
            className={classes.wrapper}
          >
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
              size="medium"
              margin='normal'
              label="ACTION"
              name="action"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={handleChangeAction}
            >
              <option value="1">Refresh</option>
              <option value="2">Validate</option>
              <option value="3">Save</option>
            </TextField>
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
          >
            <Fab
              aria-label="save"
              color="primary"
              className={buttonClassname}
            >
              {
                success ? <CheckIcon /> :
                  parseInt(action) === 1 ? <RefreshIcon /> :
                    parseInt(action) === 2 ? <SettingsIcon /> :
                      parseInt(action) === 3 ? <SaveIcon /> : null
              }
            </Fab>
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
          >
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleClickExecute}
            >
              execute
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}

          </Grid>
          <Grid
            item
            md={2}
            xs={12}
          >
            <Button
              className={classes.saveButton}
              onClick={onClose}
              variant="contained"
            >
              Close
            </Button>
          </Grid>
        </CardActions>
      </Card>
    </Modal>
  );
};

Details.displayName = 'Details';

Details.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  batch_type: PropTypes.number.isRequired,
  record_id: PropTypes.number.isRequired
};

Details.defaultProps = {
  open: false,
  onClose: () => { }
};

export default Details;
