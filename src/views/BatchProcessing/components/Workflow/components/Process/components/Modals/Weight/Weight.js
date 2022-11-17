import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Modal, Card, CircularProgress, LinearProgress, Fab, CardContent, Box, Switch, Typography, CardHeader, Grid, Divider, TextField, colors, Button, CardActions } from '@material-ui/core';
import { batchProcessActions, getLookups, genericFunctionFiveParameters, getParametersLimitAll, weightBatchModifyRevalidate } from '../../../../../../../../../utils/API';
import { endpoint_lookup, endpoint_batch_actions, endpoint_batch_details, endpoint_parameter_limit_all, endpoint_weightRevalidate } from '../../../../../../../../../configs/endpoints';
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

const Weight = props => {
  const { open, onClose, className, batch_type, record_id, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [{ organization_id, user_id }] = useContext(authContext);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [body_scores, setBodyScores] = useState([]);
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
      .then(() => {
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

    await weightBatchModifyRevalidate(endpoint, values, record_id, user_id, batch_type)
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
      await getLookups(endpoint, id)
        .then(response => {
          if (mounted_lookup) {
            const data = response.payload[0];
            let lookup_body_scores = [];
            for (let i = 0; i < data.length; i++) {
              //Body Score
              if (data[i].list_type_id === 71) {
                lookup_body_scores.push(data[i]);
              }
            }
            setBodyScores(lookup_body_scores);
          }
        });
    })(endpoint_lookup, '71');

    return () => {
      mounted = false;
      mounted_limit_parameters = false;
      mounted_lookup = false;

    };
  }, [record_id, organization_id, batch_type]);

  if (!errors || !limitParameters || !body_scores || !values ) {
    return null;
  }



  // validate weight
  let mature_weight_limits = limitParameters.filter(obj => obj.category === 'mature_weight_limits');
  let mature_weight_limits_status = false;
  let mature_weight_limits_min_value = 0;
  let mature_weight_limits_max_value = 0;
  if (mature_weight_limits.length > 0) {
    mature_weight_limits_status = mature_weight_limits[0].is_active_id;
    mature_weight_limits_min_value = mature_weight_limits[0].min_value;
    mature_weight_limits_max_value = mature_weight_limits[0].max_value;
  }

  //validate heart Girth
  let mature_heart_girth_limits = limitParameters.filter(obj => obj.category === 'mature_heart_girth_limits');
  let mature_heart_girth_limits_status = false;
  let mature_heart_girth_limits_min_value = 0;
  let mature_heart_girth_limits_max_value = 0;
  if (mature_heart_girth_limits.length > 0) {
    mature_heart_girth_limits_status = mature_heart_girth_limits[0].is_active_id;
    mature_heart_girth_limits_min_value = mature_heart_girth_limits[0].min_value;
    mature_heart_girth_limits_max_value = mature_heart_girth_limits[0].max_value;
  }

  //validate body length
  let mature_body_length_limits = limitParameters.filter(obj => obj.category === 'mature_body_length');
  let mature_body_length_limits_status = false;
  let mature_body_length_limits_min_value = 0;
  let mature_body_length_limits_max_value = 0;
  if (mature_body_length_limits.length > 0) {
    mature_body_length_limits_status = mature_body_length_limits[0].is_active_id;
    mature_body_length_limits_min_value = mature_body_length_limits[0].min_value;
    mature_body_length_limits_max_value = mature_body_length_limits[0].max_value;
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
        save(endpoint_weightRevalidate, values, record_id, user_id, batch_type);
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
          <CardHeader title="Weight & Growth Record" />
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

          <PerfectScrollbar>
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
                    margin='dense'
                    label="Tag ID"
                    name='animal_tag_id'
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
                    required
                    onChange={handleChange}
                    margin='dense'
                    label="Weight Date"
                    name="weight_date"
                    value={values.weight_date}
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

                    inputProps={{
                      min: (mature_body_length_limits_status) ? mature_body_length_limits_min_value : "any",
                      max: (mature_body_length_limits_status) ? mature_body_length_limits_max_value : "any",
                      step: "any"
                    }}
                    onChange={handleChange}
                    //required
                    margin='dense'
                    label="Body Length (cm)"
                    name="body_length"
                    type="number"
                    variant="outlined"
                    value={parseInt(values.body_length) === 0 ? '' : values.body_length}
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
                      min: (mature_heart_girth_limits_status) ? mature_heart_girth_limits_min_value : "any",
                      max: (mature_heart_girth_limits_status) ? mature_heart_girth_limits_max_value : "any",
                      step: "any"
                    }}
                    onChange={handleChange}
                    //required
                    margin='dense'
                    label="Heart Girth (cm)"
                    name="heart_girth"
                    variant="outlined"
                    type="number"
                    value={parseInt(values.heart_girth) === 0 ? '' : values.heart_girth}
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
                      min: (mature_weight_limits_status) ? mature_weight_limits_min_value : "any",
                      max: (mature_weight_limits_status) ? mature_weight_limits_max_value : "any",
                      step: "any"
                    }}
                    onChange={handleChange}
                    margin='dense'
                    label="Weight (kg)"
                    name="body_weight"
                    variant="outlined"
                    type="number"
                    value={parseInt(values.body_weight) === 0 ? '' : values.body_weight}
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
                    onChange={handleChange}
                    margin='dense'
                    label="Body Score"
                    name="body_score"
                    value={values.body_score}
                    //required
                    default=""
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <option value=""></option>
                    {body_scores.map(score => (
                      <option
                        value={score.id}
                      >
                        {score.id}
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

                    onChange={handleChange}

                    margin='dense'
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
                    margin='dense'
                    name="created_date"
                    label='Created Date'
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
                    onChange={handleChange}

                    margin='dense'
                    name="created_time"
                    label="Time Created"
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
          </PerfectScrollbar>
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

Weight.displayName = 'Details';

Weight.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  batch_type: PropTypes.number.isRequired,
  record_id: PropTypes.number.isRequired
};

Weight.defaultProps = {
  open: false,
  onClose: () => { }
};
export default Weight;
