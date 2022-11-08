import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ExcelRenderer } from 'react-excel-renderer';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Card, CardActions, Input, Fab, CircularProgress } from '@material-ui/core';
import authContext from '../../../../../../../../contexts/AuthContext';
import { postBatchUpload } from '../../../../../../../../utils/API';
import { endpoint_batch_upload } from '../../../../../../../../configs/endpoints';
import uuid from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  submitButton: {
    backgroundColor: '#682622',
  },
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  removeBotton: {
    width: '100%'
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

const Upload = props => {
  const classes = useStyles();
  const { batchType } = props;
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [{ user_id, organization_id }] = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({ status: null, message: "" });
  const batch_uuid = uuid();

  const timer = React.useRef();
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const fileInput = React.createRef();
  const renderFile = (fileObj) => {
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err.message);
      }
      else {
        const column_count = resp.rows[0].length;
        
        let new_date = null;

        for (let i = 0; i < resp.rows.length; i++) {
          for (let r = 0; r < resp.rows[i].length; r++) {
            /* Replace whitespaces with underscore on column headers */
            if (i === 0) {
              resp.rows[i][r] = resp.rows[i][r].split(" ").join("_").toUpperCase();
            }             
                     
            /* replace empty slots with null */
            if (typeof resp.rows[i][r] === 'undefined' || resp.rows[i][r] === '') {
              resp.rows[i][r] = null;
            }       
          
            /* Pedigree Batch : Convert numeric dates to normal date */
            if (batchType === 8 && (r === 6 || r === 7 || r === 8 || r === 20)) {
              if (resp.rows[i][r] && !isNaN(resp.rows[i][r])) {
                new_date = new Date(Math.round((resp.rows[i][r] - 25569) * 86400 * 1000));
                resp.rows[i][r] = new_date.getDate() + '/' + (new_date.getMonth() + 1) + '/' + new_date.getFullYear();
              }
            }

            /* Milk Batch : Convert numeric dates to normal date */
            if (batchType === 1 && (r === 1 || r === 2)) {
              if (resp.rows[i][r] && !isNaN(resp.rows[i][r])) {
                new_date = new Date(Math.round((resp.rows[i][r] - 25569) * 86400 * 1000));
                resp.rows[i][r] = new_date.getDate() + '/' + (new_date.getMonth() + 1) + '/' + new_date.getFullYear();
              }
            }

            /* Weight Batch : Convert numeric dates to normal date */
            if (batchType === 2 && r === 0) {
              if (resp.rows[i][r] && !isNaN(resp.rows[i][r])) {
                new_date = new Date(Math.round((resp.rows[i][r] - 25569) * 86400 * 1000));
                resp.rows[i][r] = new_date.getDate() + '/' + (new_date.getMonth() + 1) + '/' + new_date.getFullYear();
              }
            }
          }

          /** this section is very important. It sorts the limitations of the excel renderer
           * the array excludes empty cells after the last cell with a value
           * The code below handles this
           */

          let diff = column_count - resp.rows[i].length;
          for (let x = 0; x < diff; x++) {
            resp.rows[i].push(null);
          }
        }

        /** function to check blank rows */
        function checkBlankRow(row) {
          return row === null;
        }

        /* remove the 1st row. it contains the column header &  skip blank rows */
        let file_rows = [];
        for (let i = 0; i < resp.rows.length; i++) {/* skip header */
          if (i !== 0) {
            if (!resp.rows[i].every(checkBlankRow)) { /* check blank rows & skip */
              file_rows.push(resp.rows[i]);
            }
          }
        }
        
        setCols(resp.rows[0]);
        setRows(file_rows);
        setDataLoaded(true);
      }
    });
  };


  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;


      if (fileName.slice(fileName.lastIndexOf('.') + 1) === "csv" || fileName.slice(fileName.lastIndexOf('.') + 1) === "xls" || fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
        setIsFormInvalid(false);
        setUploadedFileName(fileName);
        renderFile(fileObj)
      }
      else {
        setIsFormInvalid(true);
        setUploadedFileName("");
      }
    }
  };

  const openFileBrowser = () => {
    fileInput.current.click();
  }

  const handleSubmit = event => {
    sessionStorage.setItem("batch_upload_uuid", batch_uuid);
    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }

    (async (endpoint, rows, cols, user_id, org_id, batch_type, uuid) => {
      await postBatchUpload(endpoint, rows, cols, user_id, org_id, batch_type, uuid)
        .then((response) => {
          setOutput({ status: null, message: '' });
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
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
        });
    })(endpoint_batch_upload, rows, cols, user_id, organization_id, batchType, batch_uuid);
  };

  const options = {
    filter: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    selectableRows: 'none',
    filterType: 'checkbox',
    responsive: 'standard',
    rowHover: true,
    setTableProps: () => {
      return {
        padding: "none",
        size: "small",
      };
    }
  };

  /** set datatable columns */
  let columns = [];
  if (cols) {
    for (let i = 0; i < cols.length; i++) {
      columns.push(
        {
          name: cols[i],
          label: cols[i],
          options: {
            filter: false,
            sort: false,
            display: true
          }
        }
      );
    }
  }

  return (
    <Grid container spacing={1} justify="center">
      <Grid item xs={12}>
        <form onSubmit={handleSubmit} id="event">
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
          <br />
          <Grid
            container
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <br />

              {
                isNaN(batchType) ? null :
                  <>

                    <Button color="info" onClick={openFileBrowser}><i className="cui-file"></i> Browse</Button>
                    <input type="file" hidden onChange={fileHandler} ref={fileInput} onClick={(event) => { event.target.value = null }} />
                    <Input type="text" value={uploadedFileName} readOnly invalid={isFormInvalid} />
                  </>
              }
            </Grid>

            <Grid container >
              <Grid item md={12} xs={12} >
                {dataLoaded &&
                  <div>
                    <PerfectScrollbar>
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          title=""
                          data={rows}
                          columns={columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </PerfectScrollbar>
                  </div>
                }
              </Grid>
            </Grid>
          </Grid>
          <br />
          {dataLoaded &&
            <Card style={{ border: "none", boxShadow: "none" }}>
              <CardActions>
                <>
                  <div className={classes.wrapper}>
                    <Fab
                      color="primary"
                      aria-label="save"
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
                      upload
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </>
              </CardActions>
            </Card>
          }
        </form>
      </Grid>
    </Grid>
  );
};

Upload.propTypes = {
  className: PropTypes.string,
  batchType: PropTypes.number.isRequired
}
export default Upload;
