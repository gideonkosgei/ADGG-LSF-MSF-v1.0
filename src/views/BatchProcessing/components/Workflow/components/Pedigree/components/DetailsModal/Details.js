import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal, Card, Box, Switch, Typography, CardContent, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import authContext from '../../../../../../../../contexts/AuthContext';
import { getBatchValidationErrors, animalBatchModifyRevalidate, getLookups } from '../../../../../../../../utils/API';
import { endpoint_batch_errors, endpoint_animalRevalidate, endpoint_lookup } from '../../../../../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '70%',
    maxHeight: '80%',
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
  }
}));

const Details = props => {
  const { open, onClose, className, record_id, data, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [{ organization_id, user_id }] = useContext(authContext);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [animal_types, setAnimalTypes] = useState([]);
  const [main_breeds, setMainBreeds] = useState([]);
  const [breed_composition, setBreedComposition] = useState([]);
  const [gender, setGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [sire_types, setSireTypes] = useState([]);
  const [entryTypes, setEntryTypes] = useState([]);
  const [deformaties, setDeformaties] = useState([]);



  const batch_type = 8; // milking batch

  useEffect(() => {
    let mounted = true;
    let mounted_lookup = true;


    (async (endpoint, id, type) => {
      await getBatchValidationErrors(endpoint, id, type)
        .then(response => {
          if (mounted) {
            setErrors(response.payload);
          }
        });
    })(endpoint_batch_errors, record_id, batch_type);

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





    return () => {
      mounted = false;
      mounted_lookup = false;
    };
  }, [record_id, organization_id]);

  if (!errors || !animal_types || !main_breeds || !breed_composition || !gender || !colors || !sire_types || !entryTypes || !deformaties) {
    return null;
  }



  let records = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].record_id === record_id) {
      records.push(data[i]);
    }
  }

  if (typeof records[0] != 'undefined' && Object.keys(values).length === 0) {
    setValues(records[0]);
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
    (async (endpoint, values, record_id, user_id, batch_type) => {
      await animalBatchModifyRevalidate(endpoint, values, record_id, user_id, batch_type)
        .then((response) => {
          setOutput({ status: null, message: '' });
          if (parseInt(response.status) === 1) {
            setOutput({ status: parseInt(response.status), message: response.message })
          } else {
            setOutput({ status: parseInt(response.status), message: response.message })
          }
        }).catch((error) => {
          setOutput({ status: 0, message: error.message })
        });
    })(endpoint_animalRevalidate, values, record_id, user_id, batch_type);
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
        <form id='event' onSubmit={handleSubmit} >
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
                    margin='dense'
                    label="Entry Type"
                    value={values.entry_type_id}
                    variant="outlined"
                    name="entry_type_id"
                    onChange={handleChange} required
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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                    value={values.dob}
                    variant="outlined"
                    name="dob"
                    onChange={handleChange}

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


                    //required
                    margin='dense'
                    label="Animal Type"
                    variant="outlined"
                    value={values.animal_type_id}
                    name="animal_type_id"
                    onChange={handleChange} required
                    select
                    SelectProps={{ native: true }}

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
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}


                    //required
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
                  md={3}
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
                    value={values.sec_breed_id}
                    name="sec_breed_id"
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
                  md={3}
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
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}


                    margin='dense'
                    label="Sex"
                    variant="outlined"
                    value={values.sex_id}
                    name="sex_id"
                    onChange={handleChange} select
                    SelectProps={{ native: true }}

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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                  md={3}
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
                  md={3}
                  xs={12}
                >
                  <Box>
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
            <Box flexGrow={1}>
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden="true"
              >
                Validate & Save
              </Button>
            </Box>
            <Button
              className={classes.saveButton}
              onClick={onClose}
              variant="contained"
            >
              Close
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
};

Details.displayName = 'Details';

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

Details.defaultProps = {
  open: false,
  onClose: () => { }
};

export default Details;
