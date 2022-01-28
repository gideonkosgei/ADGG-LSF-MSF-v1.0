import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Divider, Button, colors, Link, Typography, Card, CardContent, LinearProgress } from '@material-ui/core';
import { Page } from 'components';
import { genericFunctionFourParameters, delinkFarmUnitsFromOrgUnit } from '../../../../utils/API';
import { endpoint_farms, endpoint_delink_farm_unit } from '../../../../configs/endpoints';
import theme from '../../../../theme';
import authContext from '../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const Edit = props => {
  const { org } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [{ user_id, is_admin }] = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowData, SetSelectedRows] = useState([]);
  const [output, setOutput] = useState({ status: null, message: "" });
  const timer = React.useRef();
  const display_add = parseInt(is_admin) === 1 ? true : false;

  let option = null;
  let id = null;
  let title = null;

  if (typeof org === 'undefined') {
    id = user_id;
    option = parseInt(props.match.params.admin) === 0 ? 3 : 2; // props.match.params.admin > when 0 -> normal user  1-> admin area
    title = "FARMS";
  } else {
    id = org;
    option = 4;
    title = "LINKED FARMS";
  }

  async function getallfarms(endpoint, desc, _option, _id) {
    setValues([]);
    setIsLoading(true);
    await genericFunctionFourParameters(endpoint, desc, _option, _id)
      .then(response => {
        setIsLoading(false);
        setValues(response.payload[0]);
      });
  };


  async function remove_link(endpoint, data_array, user, org) {
    setIsLoading(true);
    const record_id = data_array[0].id;
    await delinkFarmUnitsFromOrgUnit(endpoint, record_id, user, org)
      .then(response => {
        setOutput({ status: null, message: '' });
        timer.current = window.setTimeout(() => {
          setIsLoading(false);
          if (parseInt(response.status) === 1) {
            setOutput({ status: parseInt(response.status), message: response.message })
          } else {
            setOutput({ status: parseInt(response.status), message: response.message })
          }
        }, 500);
      }).catch((error) => {
        setOutput({ status: 0, message: error.message });
        setIsLoading(false);
      });

  };
  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, _option, _id) => {
      await genericFunctionFourParameters(endpoint, desc, _option, _id)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0]);
          }
        });
    })(endpoint_farms, 'get all farms', option, id);

    return () => {
      mounted = false;
    };
  }, [id, option]);

  if (!values) {
    return null;
  }



  const columns = [
    { name: "id", label: "ID", options: { filter: false, sort: false, display: false } },
    { name: "name", label: "FARM NAME", options: { filter: false, sort: true, display: true } },
    { name: "farmer_name", label: "FARMER NAME", options: { filter: false, sort: true, display: true } },
    { name: "code", label: "FARM CODE", options: { filter: true, sort: false, display: true } },
    { name: "farm_type", label: "FARM TYPE", options: { filter: true, sort: true, display: true } },
    { name: "org_name", label: "ORG", options: { filter: true, sort: true, display: true } },
    { name: "phone",label: "PHONE",options: {filter: false,sort: true,display:true}},
    { name: "email",label: "EMAIL",options: {filter: false,sort: true,display:true}},
    { name: "country", label: "COUNTRY", options: { filter: true, sort: true, display: true } },
    { name: "region", label: "REGION", options: { filter: true, sort: true, display: true } },
    { name: "district", label: "DISTRICT", options: { filter: false, sort: true, display: true } },
    { name: "ward", label: "WARD", options: { filter: true, sort: false, display: true } },
    { name: "village", label: "VILLAGE", options: { filter: true, sort: false, display: true } },
    { name: "reg_date", label: "REG DATE", options: { filter: false, sort: false, display: true } },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link
              component={RouterLink}
              to={`/management/farms/edit/${tableMeta.rowData[0]}/${tableMeta.rowData[1]}/details`}
            >
              <OpenInNewIcon />
            </Link>
          );
        }
      }
    }
  ];



  const options = {
    filter: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    selectableRows: (typeof org !== 'undefined') ? "single" : "none",
    selectableRowsHeader: true,
    onRowsSelect: (rowsSelected, allRows) => {
      const data = [];
      allRows.forEach(row => {
        data.push(values[row.dataIndex]);
      });
      SetSelectedRows(data);
    },
    filterType: 'checkbox',
    responsive: 'standard',
    rowHover: true,
    setTableProps: () => {
      return {
        padding: "none",
        size: "small",
      };
    },

    customToolbar: () => {
      return (
        display_add && <CustomToolbar />
      );
    },
    customToolbarSelect: selectedRows => (
      <Tooltip title="remove link">
        <IconButton
          onClick={() => {
            remove_link(endpoint_delink_farm_unit, selectedRowData, user_id, id);
          }}
          style={{
            marginRight: "24px"
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  };

  const handleClickRefresh = () => {
    getallfarms(endpoint_farms, 'get all farms', option, id);
    setOutput({ status: null, message: '' });
  };

  return (
    <Page
      className={classes.root}
      title="farms"
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={11}>
          <Typography
            component="h1"
            gutterBottom
            variant="h3"
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="outlined"
            onClick={handleClickRefresh}
          >
            Refresh
          </Button>
        </Grid>
      </Grid>



      <br />
      {isLoading &&
        <LinearProgress />
      }
      <Divider />
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {output.status === 0 ?
                <>
                  <Alert severity="error" >{output.message}</Alert>
                  <br /><br />
                </>
                : output.status === 1 ?
                  <>
                    <Alert severity="success" >{output.message}</Alert>
                    <br /><br />
                  </>
                  : null
              }
              <PerfectScrollbar>
                <MuiThemeProvider theme={theme}>
                  <MUIDataTable
                    title=""
                    data={values}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </PerfectScrollbar>
            </CardContent>
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
