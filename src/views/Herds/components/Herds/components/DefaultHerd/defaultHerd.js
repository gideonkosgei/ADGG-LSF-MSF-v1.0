import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Button, CardActions, Box, Switch, Fab, CircularProgress, Typography, Grid, colors } from '@material-ui/core';
import { postDefaultHerd } from '../../../../../../utils/API';
import { endpoint_default_herd_add } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
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

const Weather = props => {
  const { farm_id } = props;
  const [{ user_id }] = useContext(authContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const [showDefaultHerdSection, setshowDefaultHerdSection] = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    return () => {
    };
  }, []);


  const handleSubmitApiCall = event => {
    event.preventDefault();
    setOutput({ status: null, message: '' });
    setSuccess(false);
    setLoading(false);

    if (!loading) {
      setSuccess(false);
      setLoading(false);
    }


    (async (endpoint, farm_id, user_id) => {
      await postDefaultHerd(endpoint, farm_id, user_id)
        .then(response => {
          timer.current = window.setTimeout(() => {
            setSuccess(false);
            setLoading(false);
            setOutput({ status: parseInt(response.status), message: response.message });
          }, 500);
        });
    })(endpoint_default_herd_add, farm_id, user_id);
  };

  const handleShowAPiSwitch = event => {
    event.persist();
    setOutput({ status: null, message: '' });
    setshowDefaultHerdSection(!showDefaultHerdSection);
  };

  return (
    <Page
      className={classes.root}
      title="herd register"
    >
      <form onSubmit={handleSubmitApiCall} >
        <Grid container spacing={2} >
          <Grid
            item
            md={12}
            xs={12}
          >
            <Box>
              <Typography variant="h6">{showDefaultHerdSection ? "Hide Section" : "Create Default Herd"} </Typography>
            </Box>
            <Box>
              <Switch
                className={classes.toggle}
                checked={showDefaultHerdSection}
                color="secondary"
                edge="start"
                onChange={handleShowAPiSwitch}
              />
            </Box>
          </Grid>

          {showDefaultHerdSection ?
            <>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Typography variant="body2">
                  The selected farm has no defined herd. Click button below to create a default herd<br />
                </Typography>
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >
                <Card>
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
                  </CardContent>
                  <CardActions>
                    <div className={classes.wrapper}>
                      <Fab
                        aria-label="save"
                        color="primary"
                        className={buttonClassname}
                      >
                        {success ? <CheckIcon /> : <GetAppIcon />}
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
                        Create Default Herd
                      </Button>
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            </>
            : null}
        </Grid>
      </form>
      <br />
    </Page>
  );
};

Weather.propTypes = {
  farm_id: PropTypes.number.isRequired
};
export default Weather;
