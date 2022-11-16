import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography, CardContent, LinearProgress, Grid, colors, CardActions, Fab, Button, CircularProgress, TextField } from '@material-ui/core';
import { batchProcessActions, genericFunctionThreeParameters} from '../../../../../../../../utils/API';
import { endpoint_batch_validation_view, endpoint_batch_actions } from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import authContext from '../../../../../../../../contexts/AuthContext';
import { ErrorDetails,Pedigree,Milking,Weight } from '../Modals';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';

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

const getMuiTheme = () => createTheme({
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
  const { UploadedRecords, batchInfo } = props;
  const classes = useStyles();
  const [data, setData] = useState(UploadedRecords);
  const [values, setValues] = useState({});
  const [{ user_id }] = useContext(authContext);
  const [openErrorLog, setErrorLog] = useState(false);
  const [record_id, setRecordID] = useState();  
  const [modal_pedigree, set_modal_pedigree] = useState(false);
  const [modal_weight, set_modal_weight] = useState(false);
  const [modal_milking, set_modal_milking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timer = React.useRef();
  const [output, setOutput] = useState({ status: null, message: "" });
  const [batchStatus, setBatchStatus] = useState(UploadedRecords.length > 0 ? UploadedRecords[0].batch_status_id : null);
  const [batchStatusOther, setBatchStatusOther] = useState(UploadedRecords.length > 0 ? UploadedRecords[0].batch_status_id_other : null);
  let columns = [];

  console.log(UploadedRecords);

  const uuid = batchInfo.uuid;
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
  }, []);

  async function refresh(endpoint, desc, batch_uuid) {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    setIsLoading(true);
    await genericFunctionThreeParameters(endpoint, desc, batch_uuid)
      .then(response => {
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          setIsLoading(false);
          setData(response.payload);
          setBatchStatus(response.payload.length > 0 ? response.payload[0].batch_status_id : null);
          setBatchStatusOther(response.payload.length > 0 ? response.payload[0].batch_status_id_other : null);
        }, 500);
      }).catch((error) => {
        setSuccess(false);
        setLoading(false);
        setIsLoading(true);
      })
  }


  async function validate(_endpoint, _uuid, _action, _user_id) {
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

  const handleErrorLogOpen = (record_id) => {
    setRecordID(record_id);
    setErrorLog(true);
  };

  const handleErrorLogClose = () => {
    setErrorLog(false);
  };

  const handleDetailsOpen = (record_id,batch_type) => {
    setRecordID(record_id);

    switch (batch_type) {
      case 1: // milk Batch
        set_modal_milking(true);
        break;
        case 2: // weight Batch
        set_modal_weight(true);
        break;
      case 8: // pedigree Batch
        set_modal_pedigree(true);
        break;      
      default:
      // Do nothing: Invalid option
    }
    
  };

  const handleDetailsClose = () => {
    switch (batchInfo.batch_type) {
      case 1: // milk Batch
        set_modal_milking(false);
        break;
        case 2: // weight Batch
        set_modal_weight(false);
        break;
      case 8: // pedigree Batch
        set_modal_pedigree(false);
        break;      
      default:
      // Do nothing: Invalid option
    }
  };

  const handleClickExecute = () => {
    setOutput({ status: null, message: '' });
    const action = parseInt(values.action);
    switch (action) {
      case 1: // refresh
        refresh(endpoint_batch_validation_view, 'view batches', uuid);
        break;
      case 2: // validate
        validate(endpoint_batch_actions, uuid, 1, user_id);
        break;
      case 3: // save
        save(endpoint_batch_actions, uuid, 3, user_id);
        break;
      case 4: //discard
        discard(endpoint_batch_actions, uuid, 2, user_id);
        break;
      default:
      // Do nothing: Invalid option
    }

  };

  switch (batchInfo.batch_type) {
    case 1:
      columns = [
        { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
        { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } }, 
        { name: "animal_tag_id", label: "Tag ID", options: { filter: true, sort: true, display: true } },    
        { name: "milk_date", label: "Milk Date", options: { filter: true, sort: true, display: true } },
        { name: "dry_date", label: "Dry Date", options: { filter: true, sort: true, display: true } },
        { name: "calving_date", label: "Calving Date", options: { filter: true, sort: true, display: true } },
        { name: "amount_morning", label: "Morning Milk", options: { filter: true, sort: true, display: true } },
        { name: "amount_midday", label: "Mid-day Milk", options: { filter: true, sort: true, display: true } },
        { name: "amount_evening", label: "Evening Milk", options: { filter: true, sort: true, display: true } },        
        { name: "milk_sample_type", label: "Milk Sample Type", options: { filter: true, sort: true, display: true } },
        { name: "fat", label: "Milk Fat", options: { filter: true, sort: true, display: true } },
        { name: "proteins", label: "Milk Proteins", options: { filter: true, sort: true, display: true } },
        { name: "urea", label: "Milk Urea", options: { filter: true, sort: true, display: true } },
        { name: "lactose", label: "Milk Lactose", options: { filter: true, sort: true, display: true } },
        { name: "somatic_cell_count", label: "Somatic cell Count", options: { filter: true, sort: true, display: true } },
        { name: "heart_girth", label: "Animal Heart Girth", options: { filter: true, sort: true, display: true } },
        { name: "animal_weight", label: "Animal Weight", options: { filter: true, sort: true, display: true } },        
        { name: "milk_estimated_weight", label: "Milk Estimated Weight", options: { filter: true, sort: true, display: true } },
        { name: "milk_bodyscore", label: "Body Score", options: { filter: true, sort: true, display: true } },
        { name: "lactation_id", label: "Lact ID", options: { filter: true, sort: true, display: true } },
        { name: "lactation_number", label: "Lact No", options: { filter: true, sort: true, display: true } },
        { name: "days_in_milk", label: "Days in Milk", options: { filter: true, sort: true, display: true } },
        { name: "test_day_no", label: "Test Day", options: { filter: true, sort: true, display: true } },
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
                  <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0],batchInfo.batch_type)}>
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
      break;
    case 2:
      columns = [
        { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
        { name: "animal_tag_id", label: "Animal Tag ID", options: { filter: true, sort: true, display: true } },
        { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },
        { name: "weight_date", label: "Weight Date", options: { filter: true, sort: true, display: true } },
        { name: "body_length", label: "Body Length", options: { filter: true, sort: true, display: true } },
        { name: "heart_girth", label: "Heart Girth", options: { filter: true, sort: true, display: true } },
        { name: "body_weight", label: "Body Weight", options: { filter: true, sort: true, display: true } },
        { name: "body_score", label: "Body Score", options: { filter: true, sort: true, display: true } },
        { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } },
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
                  <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0],batchInfo.batch_type)}>
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

      break;
      case 9:

        columns = [
          { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
          { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
          { name: "calf_animal_id", label: "Calf ID", options: { filter: true, sort: true, display: true } },
          { name: "calf_tag_id", label: "Calf Tag ID", options: { filter: true, sort: true, display: true } },
          { name: "calf_name", label: "Calf Name", options: { filter: true, sort: true, display: true } },
          { name: "calf_dob", label: "Calf DOB", options: { filter: true, sort: true, display: true } },          
          { name: "calf_registration_date", label: "Calf Reg Date", options: { filter: true, sort: true, display: true } },
          { name: "dam_animal_id", label: "Dam ID", options: { filter: true, sort: true, display: true } },
          { name: "dam_tag_id", label: "Dam Tag ID", options: { filter: true, sort: true, display: true } },
          { name: "dam_name", label: "Dam Name", options: { filter: true, sort: true, display: true } },
          { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } },
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
                    <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0],batchInfo.batch_type)}>
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
  
        break;
        case 10:

          columns = [
            { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
            { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },

            

            { name: "event_date", label: "Date", options: { filter: true, sort: true, display: true } },
            { name: "animal_id", label: "Animal ID", options: { filter: true, sort: true, display: true } },  
            { name: "tag_id", label: "Tag ID", options: { filter: true, sort: true, display: true } },          
            { name: "current_farmer_id", label: "Farm ID", options: { filter: true, sort: true, display: true } },
            { name: "current_farmer_name", label: "Farmer Name", options: { filter: true, sort: true, display: true } },
            { name: "current_farmer_country", label: "Farmer Country", options: { filter: true, sort: true, display: true } },          
            { name: "new_farmer_id", label: "New Farm ID", options: { filter: true, sort: true, display: true } },

            { name: "new_farmer_name", label: "New Farmer", options: { filter: true, sort: true, display: true } },
            { name: "new_farmer_country", label: "New Country", options: { filter: true, sort: true, display: true } },
            { name: "new_farmer_region", label: "New Region", options: { filter: true, sort: true, display: true } },
            { name: "new_farmer_district", label: "New District", options: { filter: true, sort: true, display: true } },
            { name: "new_farmer_ward", label: "New Ward", options: { filter: true, sort: true, display: true } },          
            { name: "new_farmer_village", label: "New Village", options: { filter: true, sort: true, display: true } },


            { name: "record_status", label: "Status", options: { filter: true, sort: true, display: true } },
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
                      <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0],batchInfo.batch_type)}>
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
    
          break;
    default:
      columns = [
        { name: "record_id", label: "record_id", options: { filter: false, sort: false, display: false } },
        { name: "uuid", label: "uuid", options: { filter: false, sort: false, display: false } },
        { name: "farmer_name", label: "FARM", options: { filter: false, sort: true, display: true } },
        { name: "herd_name", label: "HERD", options: { filter: false, sort: true, display: true } },
        { name: "herd_id", label: "HERD ID", options: { filter: false, sort: true, display: false } },
        { name: "tag_id", label: "TAG ID", options: { filter: false, sort: true, display: true } },
        { name: "tag_prefix", label: "TAG PREFIX", options: { filter: false, sort: true, display: false } },
        { name: "tag_sequence", label: "TAG SEQUENCE", options: { filter: false, sort: true, display: false } },
        { name: "animal_name", label: "ANIMAL NAME", options: { filter: false, sort: true, display: true } },
        { name: "color", label: "COLOR", options: { filter: false, sort: true, display: false } },
        { name: "reg_date", label: "REG DATE", options: { filter: false, sort: true, display: true } },
        { name: "derived_birth_date", label: "DERIVED BIRTH DATE", options: { filter: false, sort: true, display: false } },
        { name: "date_of_birth", label: "DATE OF BIRTH", options: { filter: false, sort: true, display: true } },
        { name: "approx_age", label: "APPROXIMATE AGE", options: { filter: false, sort: true, display: false } },
        { name: "deformaties", label: "DEFORMATIES", options: { filter: false, sort: true, display: false } },
        { name: "sire_type", label: "SIRE TYPE", options: { filter: false, sort: true, display: false } },
        { name: "sire_known", label: "SIRE KNOWN", options: { filter: false, sort: true, display: false } },
        { name: "sire_tag_id", label: "SIRE TAG ID", options: { filter: false, sort: true, display: true } },
        { name: "dam_known", label: "DAM KNOWN", options: { filter: false, sort: true, display: false } },
        { name: "dam_tag_id", label: "DAM TAG ID", options: { filter: false, sort: true, display: true } },
        { name: "animal_type", label: "Animal Type", options: { filter: false, sort: true, display: true } },
        { name: "sex", label: "SEX", options: { filter: false, sort: true, display: true } },      
        { name: "main_breed", label: "Main Breed", options: { filter: false, sort: true, display: true } },
        { name: "breed_composition", label: "BREED COMPOSITION", options: { filter: false, sort: true, display: false } },
        { name: "secondary_breed", label: "SECONDARY BREED", options: { filter: false, sort: true, display: false } },
        { name: "entry_type", label: "ENTRY TYPE", options: { filter: false, sort: true, display: false } },
        { name: "entry_date", label: "ENTRY DATE", options: { filter: false, sort: true, display: false } },
        { name: "Purchase_cost", label: "PURCHASE COST", options: { filter: false, sort: true, display: false } },
        { name: "animal_photo", label: "ANIMAL PHOTO", options: { filter: false, sort: true, display: false } },
        { name: "latitude", label: "LATITUDE", options: { filter: false, sort: true, display: false } },
        { name: "longitude", label: "LONGITUDE", options: { filter: false, sort: true, display: false } },
        { name: "altitude", label: "ALTITUDE", options: { filter: false, sort: true, display: false } },
        { name: "grps_accuracy", label: "GPRS ACCURACY", options: { filter: false, sort: true, display: false } },        
        { name: "hair_sample_id", label: "HAIR SAMPLE ID", options: { filter: false, sort: true, display: false } },
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
                  <Button onClick={() => handleDetailsOpen(tableMeta.rowData[0],batchInfo.batch_type)}>
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
  }


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

  const handleChange = event => {
    event.persist();
    setSuccess(false);
    setValues({
      ...values,
      [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value

    });
  };

  function get_actions(status) {
    let actions = [];
    switch (status) {
      case 1:
        actions = [{ id: 1, name: "Refresh" }, { id: 2, name: "Validate" }, { id: 4, name: "Discard" }];
        break;
      case 4:
        actions = [{ id: 1, name: "Refresh" }];
        break;
      default:
        actions = [{ id: 1, name: "Refresh" }, { id: 2, name: "Validate" }, { id: 3, name: "Save" }, { id: 4, name: "Discard" }];
    }
    return actions;
  }



  
  return (
    <Grid container spacing={2} justify="center">
      <Grid
        item
        md={11}
        xs={12}
      >
        {
          batchStatusOther === 2 ?
            <>
              <Typography variant="h6">Important Notes</Typography>
              <br />
              <Typography variant="body2">
                1. All records <b>failed</b> validation<br />
                2. This batch <b>cannot</b> be progressed to posting stage <br />
                2. Individual records can be <b>editted</b> and <b>re-validated</b> <br />
              </Typography>
            </>
            : batchStatusOther === 3 ?
              <>
                <br />
                <Typography variant="body2">
                  1. Some records have  <b>failed</b> validation<br />
                  2. <b>Only</b> sucessfully validated records will be progressed to posting stage <br />
                  2. Individual records can be <b>editted</b> and <b>re-validated</b> <br />
                </Typography>
              </>
              : null
        }

      </Grid>

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
            <div className={classes.inner}>
              <PerfectScrollbar>
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    title=""
                    data={data}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </PerfectScrollbar>
            </div>
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
              {get_actions(batchStatus).map(action => (
                <option
                  value={action.id}
                >
                  {action.name}
                </option>
              ))
              }
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
                      parseInt(values.action) === 1 ? <RefreshIcon /> :
                        parseInt(values.action) === 2 ? <SettingsIcon /> :
                          parseInt(values.action) === 3 ? <SaveIcon /> :
                            parseInt(values.action) === 4 ? <DeleteIcon /> : null
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
          <ErrorDetails
            record_id={record_id}
            batch_type={batchInfo.batch_type}
            onClose={handleErrorLogClose}
            open={openErrorLog}
          />
          <Pedigree
            batch_type = {batchInfo.batch_type}
            record_id = {record_id}
            onClose = {handleDetailsClose}
            open = {modal_pedigree}
          />
           <Milking
            batch_type = {batchInfo.batch_type}
            record_id = {record_id}
            onClose = {handleDetailsClose}
            open = {modal_milking}
          />
          <Weight
            batch_type = {batchInfo.batch_type}
            record_id = {record_id}
            onClose = {handleDetailsClose}
            open = {modal_weight}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

Validate.propTypes = {
  className: PropTypes.string,
  batchInfo: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
  UploadedRecords: PropTypes.object.isRequired
};
export default Validate;