import React, { useState, useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, colors, CardActions, Button, Fab, CircularProgress } from '@material-ui/core';
import { batchProcessActions, genericFunctionSixParameters } from '../../../../../../../../utils/API';
import { endpoint_batch_validation_un_processed_view, endpoint_batch_actions } from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import authContext from '../../../../../../../../contexts/AuthContext';
import { ErrorDetails } from '../errorDetailsModal';
import { Details } from '../DetailsModal';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import clsx from 'clsx';
import SlowMotionVideoIcon from '@material-ui/icons/SlowMotionVideo';
import { Redirect } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  root: {},
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

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        backgroundColor: "#FFF",
        width: "150px"
      }
    }
  }
});

const Validate = props => {
  const { step, UploadedRecords, batchInfo } = props;
  const classes = useStyles();
  const [values, setValues] = useState(UploadedRecords);
  const [{ organization_id }] = useContext(authContext);
  const [{ user_id }] = useContext(authContext);
  const [openErrorLog, setErrorLog] = useState(false);
  const [record_id, setRecordID] = useState();
  const [openDetails, setDetails] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const uuid = batchInfo.uuid;
  const batch_type = batchInfo.batch_type;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });


  useEffect(() => {
    console.log('xxx');
    let mounted = true;
    (async (endpoint, desc, type, org_id, step, user_id) => {
      await genericFunctionSixParameters(endpoint, desc, type, org_id, step, user_id)
        .then(response => {
          if (mounted) {
            setValues(response.payload);
          }
        });
    })(endpoint_batch_validation_un_processed_view, 'unfinalzed batches', batch_type, organization_id, step, user_id);

    return () => {
      mounted = false;

    };
  }, [organization_id, step, user_id, batch_type]);


  if (!values) {
    return null;
  }

  const handleValidate = event => {
    event.preventDefault();
    (async (_endpoint, _uuid, _action, _user_id) => {
      await batchProcessActions(_endpoint, _uuid, _action, _user_id)
        .then(() => {
          setSent(true);
        }).catch(() => {

        });
    })(endpoint_batch_actions, uuid, 1, user_id);
  };

  const handleDiscard = event => {
    event.preventDefault();
    (async (_endpoint, _uuid, _action, _user_id) => {
      await batchProcessActions(_endpoint, _uuid, _action, _user_id)
        .then(() => {
          var delayInMilliseconds = 1000; //1 second
          setTimeout(function () {
            window.location.reload();
          }, delayInMilliseconds);

        }).catch(() => {

        });
    })(endpoint_batch_actions, uuid, 2, user_id);
  };

  const handleProgressToPostingQueue = event => {
    event.preventDefault();
    (async (_endpoint, _uuid, _action, _user_id) => {
      await batchProcessActions(_endpoint, _uuid, _action, _user_id)
        .then(() => {

          var delayInMilliseconds = 1000; //1 second
          setTimeout(function () {
            window.location.reload();
          }, delayInMilliseconds);

        }).catch(() => {

        });
    })(endpoint_batch_actions, uuid, 3, user_id);
  };


  const handleErrorLogOpen = (record_id) => {
    setRecordID(record_id);
    setErrorLog(true);
  };

  const handleErrorLogClose = () => {
    setErrorLog(false);
  };

  const handleDetailsOpen = (record_id) => {
    setRecordID(record_id);
    setDetails(true);
  };

  const handleDetailsClose = () => {
    setDetails(false);
  };
  //purchase_cost

  const columns = [
    { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
    { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
    { name: "farmer_name", label: "FARMER NAME", options: { filter: false, sort: true, display: true } },
    { name: "tag_id", label: "TAG ID", options: { filter: false, sort: true, display: true } },
    { name: "tag_prefix", label: "TAG PREFIX", options: { filter: false, sort: true, display: true } },
    { name: "tag_sequence", label: "TAG SEQUENCE", options: { filter: false, sort: true, display: true } },
    { name: "animal_name", label: "ANIMAL NAME", options: { filter: false, sort: true, display: true } },
    { name: "color", label: "COLOR", options: { filter: false, sort: true, display: true } },
    { name: "reg_date", label: "REGISTRATION DATE", options: { filter: false, sort: true, display: true } },
    { name: "derived_birth_date", label: "DERIVED BIRTH DATE", options: { filter: false, sort: true, display: true } },
    { name: "date_of_birth", label: "DATE OF BIRTH", options: { filter: false, sort: true, display: true } },
    { name: "approx_age", label: "APPROXIMATE AGE", options: { filter: false, sort: true, display: true } },
    { name: "deformaties", label: "DEFORMATIES", options: { filter: false, sort: true, display: true } },
    { name: "sire_type", label: "SIRE TYPE", options: { filter: false, sort: true, display: true } },
    { name: "sire_known", label: "SIRE KNOWN", options: { filter: false, sort: true, display: true } },
    { name: "sire_tag_id", label: "SIRE TAG ID", options: { filter: false, sort: true, display: true } },
    { name: "dam_known", label: "DAM KNOWN", options: { filter: false, sort: true, display: true } },
    { name: "dam_tag_id", label: "DAM TAG ID", options: { filter: false, sort: true, display: true } },
    { name: "main_breed", label: "Main Breed", options: { filter: false, sort: true, display: true } },
    { name: "breed_composition", label: "BREED COMPOSITION", options: { filter: false, sort: true, display: true } },
    { name: "secondary_breed", label: "SECONDARY BREED", options: { filter: false, sort: true, display: true } },
    { name: "entry_type", label: "ENTRY TYPE", options: { filter: false, sort: true, display: true } },
    { name: "entry_date", label: "ENTRY DATE", options: { filter: false, sort: true, display: true } },
    { name: "Purchase_cost", label: "PURCHASE COST", options: { filter: false, sort: true, display: true } },
    { name: "animal_photo", label: "ANIMAL PHOTO", options: { filter: false, sort: true, display: true } },
    { name: "latitude", label: "LATITUDE", options: { filter: false, sort: true, display: true } },
    { name: "longitute", label: "LONGITUDE", options: { filter: false, sort: true, display: true } },
    { name: "altitude", label: "ALTITUDE", options: { filter: false, sort: true, display: true } },
    { name: "grps_accuracy", label: "GPRS ACCURACY", options: { filter: false, sort: true, display: true } },
    { name: "sex", label: "SEX", options: { filter: false, sort: true, display: true } },
    { name: "hair_sample_id", label: "HAIR SAMPLE ID", options: { filter: false, sort: true, display: true } },
    { name: "created_by", label: "CREATED BY", options: { filter: false, sort: true, display: true } },
    { name: "created_date", label: "DATE CREATED", options: { filter: false, sort: true, display: true } },
    { name: "created_time", label: "TIME CREATED", options: { filter: false, sort: true, display: true } },
    { name: "record_status", label: "STATUS", options: { filter: false, sort: true, display: true } },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        display: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0])}>
                < OpenInNewIcon className={classes.buttonIcon} />
              </Button>
              <Button onClick={() => handleErrorLogOpen(tableMeta.rowData[0])}>
                <ErrorOutlineIcon className={classes.buttonIcon} />
              </Button>
            </>
          );
        }
      }
    }
  ];


  const options = {
    filter: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    selectableRows: 'none',
    filterType: 'checkbox',
    responsive: 'stacked',
    rowHover: true,
    setTableProps: () => {
      return {
        padding: "none",
        size: "small",
      };
    }
  };

  return (
    <Fragment>
      {sent ? (
        <Redirect to= {`/batch-processing/workflow/${uuid}/${batch_type}`} />
      ) : (
        <Fragment>
          <Grid container spacing={1} justify="center">
            <Grid item xs={12}>
              <Card style={{ border: "none", boxShadow: "none" }}>
                <CardContent>
                  <div className={classes.inner}>
                    <PerfectScrollbar>
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          title=""
                          data={values}
                          columns={columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </PerfectScrollbar>
                  </div>

                </CardContent>
                <CardActions>
                  <form onSubmit={handleValidate}>
                    <>
                      <div className={classes.wrapper}>
                        <Fab
                          color="primary"
                          aria-label="save"
                          className={buttonClassname}
                        >
                          {success ? <CheckIcon /> : <SlowMotionVideoIcon />}
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
                          validate
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                    </>
                  </form>

                </CardActions>
                <ErrorDetails
                  record_id={record_id}
                  onClose={handleErrorLogClose}
                  open={openErrorLog}
                />
                <Details
                  record_id={record_id}
                  data={values}
                  onClose={handleDetailsClose}
                  open={openDetails}
                />
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

Validate.propTypes = {
  className: PropTypes.string,
  batchInfo: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
  UploadedRecords: PropTypes.object.isRequired
};

export default Validate;