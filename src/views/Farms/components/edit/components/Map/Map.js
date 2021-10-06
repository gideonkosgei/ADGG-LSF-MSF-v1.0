import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, LinearProgress, CardContent, Grid, colors } from '@material-ui/core';
import { genericFunctionFourParameters } from '../../../../../../utils/API';
import { endpoint_farms } from '../../../../../../configs/endpoints';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
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

const Map = props => {
  const { farm_id } = props;
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const option = 1;

  const defaultProps = {
    center: {
      lat: -1.28,
      lng: 36.81
    },
    zoom: 11
  };

  useEffect(() => {
    let mounted = true;

    (async (endpoint, desc, option, id) => {
      await genericFunctionFourParameters(endpoint, desc, option, id)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0][0]);
          }
        });
    })(endpoint_farms, 'get herd details', option, farm_id);

    return () => {
      mounted = false;
    };
  }, [farm_id]);

  if (!values) {
    return null;
  }
  return (
    <Page
      className={classes.root}
      title="herd register"
    >
      <br />
      {isLoading &&
        <LinearProgress />
      }

      <Grid container spacing={1} justify="center">
        <Grid item xs={12}>
          <Card>
            <CardContent>

              <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyDkziO3B7MEacsF1LLupXuFPdbntcpN_uU" }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                >
                  <AnyReactComponent
                    lat={values.latitude}
                    lng={values.longitude}
                    text= {values.farm_name}
                  />
                </GoogleMapReact>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

Map.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  farm_id: PropTypes.number.isRequired
};

export default Map;
