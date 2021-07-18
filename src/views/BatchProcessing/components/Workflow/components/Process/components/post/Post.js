import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, LinearProgress, Grid, Fab, TextField, colors, CircularProgress, CardActions, Button } from '@material-ui/core';
import { batchProcessActions } from '../../../../../../../../utils/API';
import clsx from 'clsx';
import { endpoint_batch_actions } from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "./CustomToolbar";
import authContext from '../../../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import { Details } from '../DetailsModal';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import { green } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';

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
    marginTop: theme.spacing(2),
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

const Post = props => {
  const { UploadedRecords, batchInfo } = props;
  const classes = useStyles();
  const [{ user_id }] = useContext(authContext);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [record_id, setRecordID] = useState();
  const [openDetails, setDetails] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const timer = React.useRef();
  const [output, setOutput] = useState({ status: null, message: "" });
  const uuid = batchInfo.uuid;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  let data = [];

  for (let i = 0; i < UploadedRecords.length; i++) {
    if (UploadedRecords[i].record_status_id === 2) {
      data.push(UploadedRecords[i]);
    }
  }

  useEffect(() => {
  }, []);

  async function discard(_endpoint, _uuid, _action, _user_id) {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    setIsLoading(true);
    await batchProcessActions(_endpoint, _uuid, _action, _user_id)
      .then((response) => {
        setOutput({ status: null, message: '' });
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);
          if (parseInt(response.status) === 1) {
            setOutput({ status: parseInt(response.status), message: response.message });
          } else {
            setOutput({ status: parseInt(response.status), message: response.message })
          }
        }, 500);
      }).catch((error) => {
        setOutput({ status: 0, message: error.message })
        setSuccess(false);
        setLoading(false);
        setIsLoading(false);
      });
  }

  async function save(_endpoint, _uuid, _action, _user_id) {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    setIsLoading(true);
    await batchProcessActions(_endpoint, _uuid, _action, _user_id)
      .then((response) => {
        console.log(response);
        setOutput({ status: null, message: '' });
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);
          if (parseInt(response.status) === 1) {
            setOutput({ status: parseInt(response.status), message: response.message });
          } else {
            setOutput({ status: parseInt(response.status), message: response.message })
          }
        }, 500);

      }).catch((error) => {
        setOutput({ status: 0, message: error.message })
        setSuccess(false);
        setLoading(false);
        setIsLoading(false);
      });
  }


  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleDetailsOpen = (record_id) => {
    setRecordID(record_id);
    setDetails(true);
  };

  const handleDetailsClose = () => {
    setDetails(false);
  };

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
            <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0])}>
              < OpenInNewIcon className={classes.buttonIcon} />
            </Button>
          );
        }
      }

    },
  ];


  const options = {
    filter: true,
    rowsPerPage: 5,
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
    },
    customToolbar: () => {
      return (
        <CustomToolbar />
      );
    }
  };

  const handleClickExecute = () => {
    setOutput({ status: null, message: '' });
    const action = parseInt(values.action);
    switch (action) {
      case 1: // post
        save(endpoint_batch_actions, uuid, 4, user_id);
        break;
      case 2: //discard
        discard(endpoint_batch_actions, uuid, 2, user_id);
        break;
      default:
      // Do nothing: Invalid option
    }
  };

  const handleChange = event => {
    event.persist();
    setSuccess(false);
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value

    });
  };

  return (
    <Grid container spacing={1} justify="center">
      <Grid item xs={12}>
        {isLoading &&
          <>
            <LinearProgress />
            <br />
          </>
        }
        {
          output.status === 0 ?
            <>
              <Alert severity="error" >{output.message}</Alert>
            </>
            : output.status === 1 ?
              <>
                <Alert severity="success" >{output.message}</Alert>
              </>
              : null
        }

        <Card style={{ border: "none", boxShadow: "none" }}>
          <CardContent>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    data={data}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </div>
            </PerfectScrollbar>
          </CardContent>
          <CardActions>

            <TextField
              fullWidth={false}
              InputLabelProps={{
                shrink: true,
              }}
              required
              size="medium"
              margin='normal'
              label="ACTION"
              name="action"
              select
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="1">Post</option>
              <option value="2">Discard</option>
            </TextField>

            <>
              <div className={classes.wrapper}>
                <Fab
                  aria-label="save"
                  color="primary"
                  className={buttonClassname}
                >
                  {
                    success ? <CheckIcon /> :
                      parseInt(values.action) === 1 ? <SaveIcon /> :
                        parseInt(values.action) === 2 ? <DeleteIcon /> : null
                  }
                </Fab>
                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
              </div>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={buttonClassname}
                  disabled={loading}
                  onClick={handleClickExecute}
                  size='large'
                >
                  EXECUTE
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </>
          </CardActions>
          <SuccessSnackbar
            onClose={handleSnackbarSuccessClose}
            open={openSnackbarSuccess}
          />
          <ErrorSnackbar
            onClose={handleSnackbarErrorClose}
            open={openSnackbarError}
          />
          <Details
            record_id={record_id}
            data={data}
            onClose={handleDetailsClose}
            open={openDetails}
          />
        </Card>
      </Grid>
    </Grid>

  );
};

Post.propTypes = {
  className: PropTypes.string,
  batchInfo: PropTypes.object.isRequired,
};

export default Post;