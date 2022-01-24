import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Fab, Typography, Grid, Divider, CircularProgress, TextField, colors, Button, CardActions } from '@material-ui/core';
import { postPutHairSample } from '../../../../../../utils/API';
import { endpoint_hair_sample_add } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Sidebar } from '../index';
import moment from 'moment';
import { Page } from 'components';
import { Header } from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
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
  const [{ user_id }] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({});
  const animal_id = localStorage.getItem('animal_id');
  const animal_tag = sessionStorage.getItem('animal_tag');
  const dob = sessionStorage.getItem('animal_dob');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {

    return () => {
    };
  }, []);


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
              setValues({});
              document.forms["event"].reset();
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
    })(endpoint_hair_sample_add, animal_id, values, user_id);
  };

  return (
    <Page
      className={classes.root}
      title="Hair sampling"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {`NEW HAIR SAMPLE : ${animal_tag}`}
      </Typography>
      <br />
      <Header />
      <br />

      <Grid container spacing={1} justifyContent='center'>
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
                        min: dob
                      }}
                      required
                      label="Sampling Date"
                      type="date"
                      name="event_date"
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
                      label="Barcode"
                      name="barcode"
                      onChange={handleChange}
                      type="number"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
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
