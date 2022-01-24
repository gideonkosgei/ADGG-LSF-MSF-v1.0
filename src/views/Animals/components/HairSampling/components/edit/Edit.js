import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Fab, LinearProgress, CircularProgress, Grid, Tooltip, TextField, colors, Button, CardActions, Box, Switch, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import {postPutHairSample, genericFunctionFourParameters } from '../../../../../../utils/API';
import {endpoint_hair_sample_update, endpoint_hair_sample_get } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Sidebar } from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { EventMetaData } from '../../../Modal';
import moment from 'moment';
import { Page } from 'components';
import { Header } from '../index';
import Alert from '@material-ui/lab/Alert';

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
  localStorage.setItem('event_id', parseInt(props.match.params.id));
  const [{ user_id }] = useContext(authContext);
  const [values, setValues] = useState({});
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);
  const event_id = localStorage.getItem('event_id');
  const animal_tag = sessionStorage.getItem('animal_tag');
  const dob = sessionStorage.getItem('animal_dob');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    let mounted = true;

    (async  (endpoint,desc,id,option) => {     
      await  genericFunctionFourParameters(endpoint, desc, id, option)
      .then(response => {               
        if (mounted) {    
          setValues(response.payload[0]); 
          setIsLoading(false);                  
        }
      });
    })(endpoint_hair_sample_get,'get hair samples',event_id,1);



    return () => {
      mounted = false;
    };
  }, [event_id]);

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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async (endpoint, id, values, user_id) => {
      await postPutHairSample(endpoint, id, values, user_id)
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
    })(endpoint_hair_sample_update, event_id, values, user_id);
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
      title="Weight & Growth"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {readOnly ? `HAIR SAMPLE : ${animal_tag}` : `EDIT HAIR SAMPLE: ${animal_tag}`}
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
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),
                        max: moment(new Date()).format('YYYY-MM-DD'),
                        min: dob
                      }}
                      required
                      label="Sampling Date"
                      type="date"
                      name="event_date"
                      value={values.event_date}
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
                        shrink: true
                      }}
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),
                      }}
                      label="Barcode"
                      name="barcode"
                      onChange={handleChange}
                      type="number"
                      variant="outlined"
                      value={values.barcode}
                    />
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
            <EventMetaData
              Details={values}
              onClose={handleMetadataClose}
              open={openMetadata}
            />
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
