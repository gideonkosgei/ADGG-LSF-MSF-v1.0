import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Grid, Divider, colors, Button, CardActions, Switch, Typography, Box, Tooltip } from '@material-ui/core';
import { updateEventSetup, getEventSetupAll } from '../../../../../../utils/API';
import { endpoint_event_setup_update, endpoint_event_setup_all } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { Sidebar } from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { EventsMatrixMetaData } from '../Modal';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const DetailsEdit = props => {
  const { className, ...rest } = props;
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [{ user_id }] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);
  const type_id = localStorage.getItem('type_id');

  useEffect(() => {
    let mounted_params = true;
    (async (endpoint) => {
      await getEventSetupAll(endpoint)
        .then(response => {
          if (mounted_params) {
            const data = response.payload[0];
            for (var j = 0; j < data.length; j++) {
              if (data[j].animal_type_id === parseInt(type_id)) {
                setValues(data[j]);
              }
            }
          }
        });
    })(endpoint_event_setup_all);
    return () => {
      mounted_params = false;
    };
  }, [type_id]);

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
    (async (endpoint, id, values, user_id, type_id) => {
      await updateEventSetup(endpoint, id, values, user_id, type_id)
        .then(() => {
          setopenSnackbarSuccess(true);
        }).catch(() => {
          setopenSnackbarError(true);
        });
    })(endpoint_event_setup_update, values, user_id, type_id);
  };



  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
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

  console.log(values);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >

      <CardHeader title={readOnly ? `Events Matrix - ${values.animal_type}` : `Edit Event Matrix - ${values.animal_type}`} />
      <Divider />
      <CardContent>
        <Grid container spacing={1} justify="center">
          <Grid item xs={1} >
            <Sidebar />
          </Grid>
          <Grid item xs={11}>
            <Card>
              <form id='event' onSubmit={handleSubmit}>
                <CardContent>
                  <Grid
                    container
                    spacing={4}
                  >

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.calving ? "Calving(on)" : "Calving(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="calving"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.calving) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.milking ? "Milking(on)" : "Milking(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="milking"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.milking) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.health ? "Health(on)" : "Health(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="health"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.health) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.bio_data ? "BioData(on)" : "BioData(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="bio_data"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.bio_data) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.insemination ? "Insemination(on)" : "Insemination(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="insemination"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.insemination) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.sync ? "Sync(on)" : "Sync(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="sync"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.sync) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.exit ? "Exit(on)" : "Exit(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="exit"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.exit) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.weight ? "Weight(on)" : "Weight(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="weight"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.weight) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.pd ? "PD(on)" : "PD(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="pd"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.pd) ? true : false}
                        />
                      </Box>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <Box>
                        <Typography variant="h6"> {values.hair ? "Hair Sampling(on)" : "Hair Sampling(off)"} </Typography>
                      </Box>
                      <Box>
                        <Switch
                          inputProps={{
                            readOnly: Boolean(readOnly),
                            disabled: Boolean(readOnly)
                          }}
                          name="hair"
                          className={classes.toggle}
                          color="secondary"
                          edge="start"
                          onChange={handleChange}
                          checked={(values.hair) ? true : false}
                        />
                      </Box>
                    </Grid>

                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <Box flexGrow={1}>
                    {readOnly ? null :
                      <Button
                        className={classes.saveButton}
                        type="submit"
                        variant="contained"
                        hidden="true"
                      >
                        Save Changes
                      </Button>
                    }
                  </Box>
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
              <SuccessSnackbar
                onClose={handleSnackbarSuccessClose}
                open={openSnackbarSuccess}
              />
              <ErrorSnackbar
                onClose={handleSnackbarErrorClose}
                open={openSnackbarError}
              />
              <EventsMatrixMetaData
                EventDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
              />
            </Card>
          </Grid>
        </Grid>
      </CardContent>

    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;