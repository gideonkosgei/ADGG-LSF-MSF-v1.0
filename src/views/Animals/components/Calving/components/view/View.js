import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Divider, colors, Link, LinearProgress, Typography } from '@material-ui/core';
import { genericFunctionFourParameters } from '../../../../../../utils/API';
import { endpoint_calving } from '../../../../../../configs/endpoints';
import { Sidebar } from '../index';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';
import { Header } from '../index';

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
  }
}));

const Edit = () => {
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const animal_id = localStorage.getItem('animal_id');
  const animal_tag = sessionStorage.getItem('animal_tag');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, id, option) => {
      await genericFunctionFourParameters(endpoint, desc, id, option)
        .then(response => {
          if (mounted) {
            setIsLoading(false);
            setValues(response.payload[0]);
          }
        });
    })(endpoint_calving, 'view -> all calving records for an animal', animal_id, 0);

    return () => {
      mounted = false;

    };
  }, [animal_id]);

  if (!values) {
    return null;
  }
  const columns = [
    { name: "event_id", label: "Event ID", options: { filter: false, sort: false, display: false } },
    { name: "calving_date", label: "Calving Date", options: { filter: false, sort: true, display: true } },
    { name: "lactation_number", label: "Lactation Number", options: { filter: false, sort: true, display: true } },
    { name: "calf_tag_id", label: "C.Tag ID", options: { filter: false, sort: true, display: true } },
    { name: "calf_name", label: "C.Name", options: { filter: false, sort: true, display: true } },
    { name: "calving_birth_type", label: "Birth Type", options: { filter: false, sort: true, display: true } },
    { name: "calf_body_condition_score_id", label: "C.Body Score", options: { filter: true, sort: true, display: true } },
    { name: "calf_sex", label: "C.Gender", options: { filter: true, sort: true, display: true } },
    { name: "calf_color", label: "C.Color", options: { filter: true, sort: true, display: true } },
    { name: "calf_weight", label: "C.Weight", options: { filter: false, sort: true, display: true } },
    { name: "calf_heart_girth", label: "Calf H. Girth", options: { filter: false, sort: true, display: true } },
    { name: "calf_deformities", label: "Deformaties", options: { filter: false, sort: true, display: true } },
    { name: "calf_sire_type", label: "calf sire type", options: { filter: false, sort: true, display: false } },
    { name: "calving_method", label: "calving method", options: { filter: false, sort: true, display: false } },
    { name: "calving_status", label: "calving status", options: { filter: false, sort: true, display: false } },
    { name: "calving_type", label: "calving type", options: { filter: false, sort: true, display: false } },
    { name: "use_of_calf", label: "use of calf", options: { filter: false, sort: true, display: false } },
    { name: "ease_of_calving", label: "ease of calving", options: { filter: false, sort: true, display: false } },
    { name: "created_by", label: "created by", options: { filter: false, sort: true, display: false } },
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
              to={`/management/calving/edit/${tableMeta.rowData[0]}`}
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
    textLabels: {
      body: {
        noMatch: isLoading ? 'Loading...' : 'Sorry, there is no matching records to display',
      },
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
      title="calving"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        {`CALVING RECORDS : ${animal_tag}`}
      </Typography>
      {isLoading &&
        <LinearProgress />
      }
      <Divider />
      <br />

      <Header />
      <br />
      <Grid container spacing={1} justify="center">
        <Grid item xs={1} >
          <Sidebar animal_id={animal_id} />
        </Grid>
        <Grid item xs={11}>
          <Card>
            <CardContent>
              <PerfectScrollbar>
                <MuiThemeProvider>
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
