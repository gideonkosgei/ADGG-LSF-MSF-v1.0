import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal, Card, LinearProgress, CircularProgress, Fab, Box, Switch, Typography, CardContent, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import { batchProcessActions, genericFunctionFiveParameters, getParametersLimitAll, getParametersLocalSettingsOrgAll, milkBatchModifyRevalidate } from '../../../../../../../../../utils/API';
import { endpoint_batch_details, endpoint_batch_actions, endpoint_parameter_limit_all, endpoint_parameter_local_settings_org_all, endpoint_milkRevalidate } from '../../../../../../../../../configs/endpoints';
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
    setOutput({ status: null, message: '' });

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
            console.log(response);
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
    };
  }, [record_id, organization_id, batch_type]);

  if (!errors || !limitParameters || !localSettings) {
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


  //local settings  
  const milk_unit = localSettings.filter(obj => obj.name === 'MILK_UNIT');
  const milk_unit_value = (milk_unit.length > 0) ? milk_unit[0].value : "ltrs";

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

                    margin='dense'
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

                    margin='dense'
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
                      shrink: true
                    }}

                    //required
                    margin='dense'
                    onChange={handleChange}
                    label="Lactation ID"
                    variant="outlined"
                    name="lactation_id"
                    value={values.lactation_id}
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
                    margin='dense'
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
                    margin='dense'
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

                    margin='dense'
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
                    margin='dense'
                    onChange={handleChange}
                    label={`Amount Afternoon (${milk_unit_value})`}
                    name="amount_afternoon"
                    value={values.amount_afternoon}
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
                    margin='dense'
                    onChange={handleChange}
                    label="Days In Milk"
                    name="days_in_milk"
                    value={values.days_in_milk}
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
                    margin='dense'
                    onChange={handleChange}
                    label="Test Day No"
                    name="test_day_no"
                    value={values.test_day_no}
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
                    margin='dense'
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
                    margin='dense'
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

                    margin='dense'
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
