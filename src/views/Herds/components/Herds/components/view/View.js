import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Divider, colors, Link, Typography, Card, CardContent, LinearProgress } from '@material-ui/core';
import { Page } from 'components';
import { genericFunctionFiveParameters } from '../../../../../../utils/API';
import theme from '../../../../../../theme';
import { endpoint_herd } from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { default as DefaultHerd } from '../DefaultHerd';

import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

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
    marginTop: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const View = props => {
  const { farm } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [{ user_id }] = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);

  let id = null;
  let option = null;

  if (typeof farm === "undefined") {
    id = user_id;
    option = 0;
  } else {
    id = farm.id;
    option = 2;
  }

  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, option, id, user) => {
      await genericFunctionFiveParameters(endpoint, desc, option, id, user)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0]);
          }
        });
    })(endpoint_herd, 'get all herds', option, id, user_id);

    return () => {
      mounted = false;
    };
  }, [id, option, user_id]);

  if (!values) {
    return null;
  }

  const columns = [
    { name: "id", label: "ID", options: { filter: false, sort: false, display: true } },
    { name: "reg_date", label: "REG DATE", options: { filter: true, sort: false, display: true } },
    { name: "farm_name", label: "FARM NAME", options: { filter: false, sort: true, display: true } },
    { name: "farm_code", label: "FARM CODE", options: { filter: false, sort: true, display: true } },
    { name: "herd_name", label: "HERD NAME", options: { filter: false, sort: true, display: true } },
    { name: "country", label: "COUNTRY", options: { filter: false, sort: true, display: true } },
    { name: "region", label: "REGION", options: { filter: false, sort: true, display: true } },
    { name: "district", label: "DISTRICT", options: { filter: true, sort: true, display: true } },
    { name: "ward", label: "WARD", options: { filter: false, sort: false, display: true } },
    { name: "village", label: "VILLAGE", options: { filter: false, sort: false, display: true } },

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
              to={`/management/herds/edit/${tableMeta.rowData[0]}`}
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
    selectableRows: 'none',
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
        <CustomToolbar />
      );
    }
  };
  return (
    <Page
      className={classes.root}
      title="herds"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        HERDS
      </Typography>
      <br />
      {isLoading &&
        <LinearProgress />
      }
      <Divider />

      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12}>

          {
            farm && Object.keys(values).length === 0 ?
              <>
                <DefaultHerd farm_id={farm.id} />
              </>
              : null
          }

          <Card>
            <CardContent>
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

View.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  farm: PropTypes.object
};
export default View;
