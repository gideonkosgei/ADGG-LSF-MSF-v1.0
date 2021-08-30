import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal, Card, LinearProgress, CircularProgress, Fab, Box, Switch, Typography, CardContent, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import {getLookups, batchProcessActions, genericFunctionFiveParameters, getParametersLimitAll, getParametersLocalSettingsOrgAll, milkBatchModifyRevalidate } from '../../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_batch_details, endpoint_batch_actions, endpoint_parameter_limit_all, endpoint_parameter_local_settings_org_all, endpoint_milkRevalidate } from '../../../../../../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';
import authContext from '../../../../../../../../../contexts/AuthContext';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '60%',
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

const Milking = props => {
  const { open, onClose, className, batch_type, record_id, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [localSettings, setLocalSettings] = useState([]);
  const [{ organization_id, user_id }] = useContext(authContext);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [action, setAction] = useState(1);
  const [quality_fields_view, setQualityFieldsView] = useState(false);
  const [sample_types, setSampleTypes] = useState([]);
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
          setOutput({ status: 1, message: "Validation complete. Execute refresh to check status" });
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

    await milkBatchModifyRevalidate(endpoint, values, record_id, user_id, batch_type)
      .then((response) => {
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
    let mounted_limit_parameters = true;
    let mounted_settings = true;
    let mounted_lookup = true;
    setOutput({ status: null, message: '' });

    (async (endpoint, id) => {
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {
            const data = response.payload[0];
            let lookup_sample_types = [];
            for (let i = 0; i < data.length; i++) {
              //Sample Types
              if (data[i].list_type_id === 70) {
                lookup_sample_types.push(data[i]);
              }
            }
            setSampleTypes(lookup_sample_types);
          }
        });
    })(endpoint_lookup, '70');

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

    (async (endpoint) => {
      await getParametersLimitAll(endpoint)
        .then(response => {
          if (mounted_limit_parameters) {
            const data = response.payload;
            setBodyLimitParameters(data);
          }
        });
    })(endpoint_parameter_limit_all);

    (async (endpoint, id) => {
      await getParametersLocalSettingsOrgAll(endpoint, id)
        .then(response => {
          if (mounted_settings) {
            setLocalSettings(response.payload);
          }
        });
    })(endpoint_parameter_local_settings_org_all, organization_id);

    return () => {
      mounted = false;
      mounted_limit_parameters = false;
      mounted_settings = false;
      mounted_lookup = false;
    };
  }, [record_id, organization_id, batch_type]);

  if (!errors || !limitParameters || !localSettings || !sample_types) {
    return null;
  }

 
  // validate milk amount
  let milk_amount_limits = limitParameters.filter(obj => obj.category === 'milk_amount_limits');
  let milk_amount_limits_status = false;
  let milk_amount_limits_min_value = 0;
  let milk_amount_limits_max_value = 0;
  if (milk_amount_limits.length > 0) {
    milk_amount_limits_status = milk_amount_limits[0].is_active_id;
    milk_amount_limits_min_value = milk_amount_limits[0].min_value;
    milk_amount_limits_max_value = milk_amount_limits[0].max_value;
  }

  // validate milk lactose
  let milk_lactose_limits = limitParameters.filter(obj => obj.category === 'milk_lactose_limits');
  let milk_lactose_limits_status = false;
  let milk_lactose_limits_min_value = 0;
  let milk_lactose_limits_max_value = 0;
  if (milk_lactose_limits.length > 0) {
    milk_lactose_limits_status = milk_lactose_limits[0].is_active_id;
    milk_lactose_limits_min_value = milk_lactose_limits[0].min_value;
    milk_lactose_limits_max_value = milk_lactose_limits[0].max_value;
  }

  // validate milk fat
  let milk_fat_limits = limitParameters.filter(obj => obj.category === 'milk_fat_limits');
  let milk_fat_limits_status = false;
  let milk_fat_limits_min_value = 0;
  let milk_fat_limits_max_value = 0;
  if (milk_fat_limits.length > 0) {
    milk_fat_limits_status = milk_fat_limits[0].is_active_id;
    milk_fat_limits_min_value = milk_fat_limits[0].min_value;
    milk_fat_limits_max_value = milk_fat_limits[0].max_value;
  }

  // validate milk protein
  let milk_protein_limits = limitParameters.filter(obj => obj.category === 'milk_protein_limits');
  let milk_protein_limits_status = false;
  let milk_protein_limits_min_value = 0;
  let milk_protein_limits_max_value = 0;
  if (milk_protein_limits.length > 0) {
    milk_protein_limits_status = milk_protein_limits[0].is_active_id;
    milk_protein_limits_min_value = milk_protein_limits[0].min_value;
    milk_protein_limits_max_value = milk_protein_limits[0].max_value;
  }

  // validate milk urea
  let milk_urea_limits = limitParameters.filter(obj => obj.category === 'milk_urea_limits');
  let milk_urea_limits_status = false;
  let milk_urea_limits_min_value = 0;
  let milk_urea_limits_max_value = 0;
  if (milk_urea_limits.length > 0) {
    milk_urea_limits_status = milk_urea_limits[0].is_active_id;
    milk_urea_limits_min_value = milk_urea_limits[0].min_value;
    milk_urea_limits_max_value = milk_urea_limits[0].max_value;
  }

  // validate somatic cell count
  let milk_somatic_cell_count_limits = limitParameters.filter(obj => obj.category === 'milk_somatic_cell_count_limits');
  let milk_somatic_cell_count_limits_status = false;
  let milk_somatic_cell_count_limits_min_value = 0;
  let milk_somatic_cell_count_limits_max_value = 0;
  if (milk_somatic_cell_count_limits.length > 0) {
    milk_somatic_cell_count_limits_status = milk_somatic_cell_count_limits[0].is_active_id;
    milk_somatic_cell_count_limits_min_value = milk_somatic_cell_count_limits[0].min_value;
    milk_somatic_cell_count_limits_max_value = milk_somatic_cell_count_limits[0].max_value;
  }

  //local settings  
  const milk_unit = localSettings.filter(obj => obj.name === 'MILK_UNIT');
  const milk_unit_value = (milk_unit.length > 0) ? milk_unit[0].value : "ltrs";

  const weight_unit = localSettings.filter(obj => obj.name === 'WEIGHT_UNIT');
  const weight_unit_value = (weight_unit.length > 0) ? weight_unit[0].value : "kg";

  const urea_unit = localSettings.filter(obj => obj.name === 'UREA_UNIT');
  const urea_unit_value = (urea_unit.length > 0) ? urea_unit[0].value : "mg/dl";

  const somatic_cell_count = localSettings.filter(obj => obj.name === 'SOMATIC_CELL_COUNT');
  const somatic_cell_count_value = (somatic_cell_count.length > 0) ? somatic_cell_count[0].value : "cells/ml";


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
        save(endpoint_milkRevalidate, values, record_id, user_id, batch_type);
        break;
      default:
      // Do nothing: Invalid option
    }
  };

  const handleQualitySwitchChange = event => {
    event.persist();
    setQualityFieldsView(!quality_fields_view);
  };

  console.log(values);


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
            <CardHeader title="MILKING RECORD" />
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
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}

                  
                    onChange={handleChange}
                    label="Tag ID"
                    name="animal_tag_id"
                    value={values.animal_tag_id}
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

                  
                    type="date"
                    onChange={handleChange}
                    label="Milk Date"
                    name="milk_date"
                    value={values.milk_date}
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

                  
                    type="date"
                    onChange={handleChange}
                    label="Dry Date"
                    name="dry_date"
                    value={values.dry_date}
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
                      readOnly: true,
                      disabled: true
                    }}
                    //required
                  
                    onChange={handleChange}
                    label="Lactation Number"
                    variant="outlined"
                    name="lactation_number"
                    value={values.lactation_number}
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
                      min: (milk_amount_limits_status) ? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status) ? milk_amount_limits_max_value : "any",
                      step: "any"
                    }}
                  
                    type="number"
                    onChange={handleChange}
                    label={`Amount Morning (${milk_unit_value})`}
                    variant="outlined"
                    name="amount_morning"
                    value={values.amount_morning}
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
                      min: (milk_amount_limits_status) ? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status) ? milk_amount_limits_max_value : "any",
                      step: "any"
                    }}

                  
                    type="number"
                    onChange={handleChange}
                    label={`Amount Noon (${milk_unit_value})`}
                    name="amount_noon"
                    value={values.amount_noon}
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
                      min: (milk_amount_limits_status) ? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status) ? milk_amount_limits_max_value : "any",
                      step: "any"
                    }}
                    type="number"
                  
                    onChange={handleChange}
                    label={`Amount Afternoon (${milk_unit_value})`}
                    name="amount_afternoon"
                    value={values.amount_afternoon}
                    variant="outlined"
                  />
                </Grid>

                <Grid
                    item
                    md={12}
                    xs={12}
                  >

                    <Box>
                      <Typography variant="h6">{quality_fields_view ? "Discard/Hide Milk Quality Attributes" : "Capture Milk Quality Attributes"} </Typography>
                    </Box>
                    <Box>
                      <Switch
                        className={classes.toggle}
                        checked={quality_fields_view}
                        color="secondary"
                        edge="start"
                        onChange={handleQualitySwitchChange}
                      />
                    </Box>
                  </Grid>


                <Grid item md={12} xs={12}>
                    <Box>
                      {quality_fields_view ?
                        <Grid container spacing={3}>
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
                              label="Milk Sample Type"
                              name="milk_sample_type"
                              onChange={handleChange}
                              default=""
                              select
                              // eslint-disable-next-line react/jsx-sort-props
                              SelectProps={{ native: true }}
                              variant="outlined"
                              value={values.milk_sample_type}
                            >
                              <option value=""></option>
                              {sample_types.map(sample_type => (
                                <option
                                  value={sample_type.id}
                                >
                                  {sample_type.value}
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
                              label={`Milk Weight (${weight_unit_value})`}
                              name="milk_Weight"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_Weight === 0 ? null : values.milk_Weight}
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
                                min: (milk_fat_limits_status) ? milk_fat_limits_min_value : "any",
                                max: (milk_fat_limits_status) ? milk_fat_limits_max_value : "any",
                                step: "any"
                              }}

                              label="Milk Butter Fat(%)"
                              name="milk_butter_fat"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_butter_fat === 0 ? null : values.milk_butter_fat}
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
                                min: (milk_lactose_limits_status) ? milk_lactose_limits_min_value : "any",
                                max: (milk_lactose_limits_status) ? milk_lactose_limits_max_value : "any",
                                step: "any"
                              }}

                              label="Milk Lactose(%)"
                              name="milk_lactose"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_lactose === 0 ? null : values.milk_lactose}
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
                                min: (milk_protein_limits_status) ? milk_protein_limits_min_value : "any",
                                max: (milk_protein_limits_status) ? milk_protein_limits_max_value : "any",
                                step: "any"
                              }}

                              label="Milk Protein(%)"
                              name="milk_protein"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_protein === 0 ? null : values.milk_protein}
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
                                min: (milk_urea_limits_status) ? milk_urea_limits_min_value : "any",
                                max: (milk_urea_limits_status) ? milk_urea_limits_max_value : "any",
                                step: "any"
                              }}

                              label={`Milk Urea (${urea_unit_value})`}
                              name="milk_urea"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_urea === 0 ? null : values.milk_urea}
                            />
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
                              inputProps={{
                                min: (milk_somatic_cell_count_limits_status) ? milk_somatic_cell_count_limits_min_value : "any",
                                max: (milk_somatic_cell_count_limits_status) ? milk_somatic_cell_count_limits_max_value : "any"
                              }}

                              label={`Somatic Cell Count(${somatic_cell_count_value})`}
                              name="milk_somatic_cell_count"
                              onChange={handleChange}
                              variant="outlined"
                              type="number"
                              value={values.milk_somatic_cell_count === 0 ? null : values.milk_somatic_cell_count}
                            />
                          </Grid>

                        </Grid>
                        : null
                      }
                    </Box>
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
                  
                    onChange={handleChange}
                    label="Created By"
                    name="created_by"
                    value={values.created_by}
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
                      readOnly: true,
                      disabled: true
                    }}
                  
                    onChange={handleChange}
                    label='Created Date'
                    name="created_date"
                    value={values.created_date}
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
                      readOnly: true,
                      disabled: true
                    }}
                    label="Time Created"
                    name="created_time"
                    value={values.created_time}
                    variant="outlined"
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

            <Grid
              container
              spacing={2}
              className={classes.wrapper}
            >
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
              md={2}
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

Milking.displayName = 'Details';
Milking.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  batch_type: PropTypes.number.isRequired,
  record_id: PropTypes.number.isRequired
};

Milking.defaultProps = {
  open: false,
  onClose: () => { }
};

export default Milking;
