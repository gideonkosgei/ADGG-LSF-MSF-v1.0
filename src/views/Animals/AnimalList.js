import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { endpoint_animal } from '../../configs/endpoints';
import { genericFunctionFourParameters } from '../../utils/API';
import authContext from '../../contexts/AuthContext';
import theme from '../../theme';
import { LinearProgress, Typography, Link, Card, CardContent, Divider, } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CustomToolbar from "./CustomToolbar";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const AnimalList = props => {
  const { HerdIdProp } = props;
  const classes = useStyles();
  const [animals, setAnimals] = useState([]);
  const [caption, setCaption] = useState('');
  const [{ user_id }] = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);

  let animal_categ_id = null;
  let herd_id = null;
  let option = null;
  let option2 = null;
  let id = null;

  if (typeof HerdIdProp === "undefined") {

    animal_categ_id = parseInt(props.match.params.id);
    herd_id = parseInt(props.match.params.herd);
    id = user_id;
    option = isNaN(parseInt(props.match.params.admin)) ? 5 : 6;
    option2 = isNaN(parseInt(props.match.params.admin)) ? 0 : 1;

  } else {
    animal_categ_id = parseInt(null);
    herd_id = parseInt(HerdIdProp);
    option = 4;
    option2 = 0;
    id = herd_id;
  }

  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, _option, _id) => {
      await genericFunctionFourParameters(endpoint, desc, _option, _id)
        .then(response => {
          if (mounted) {
            let filtered = [];
            setIsLoading(false);

            if (typeof (animal_categ_id) != 'undefined' && isNaN(herd_id)) {
              for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].animal_type_id === animal_categ_id) {
                  filtered.push(response.payload[i]);
                }
              }
            }

            if (typeof (animal_categ_id) != 'undefined' && isNaN(herd_id) === false) {
              for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].animal_type_id === animal_categ_id && response.payload[i].herd_id === parseInt(herd_id)) {
                  filtered.push(response.payload[i]);
                }
              }
            }

            const res = isNaN(animal_categ_id) ? response.payload : filtered;
            if (!isNaN(animal_categ_id)) {
              setCaption(res[0].animalType);
            }
            setAnimals(res);
          }
        });
    })(endpoint_animal, 'get animals -> by user', option, id); /* RAC of animals */

    return () => {
      mounted = false;
    };
  }, [animal_categ_id, herd_id, id, option]);

  if (!animals) {
    return null;
  }
  
  const columns = [
    { name: "animal_id", label: "ID", options: { filter: false, sort: true, display: true } },
    { name: "farm_id", label: "Farm Id", options: { filter: false, sort: true, display: false } },
    { name: "registration_date", label: "Reg Date", options: { filter: false, sort: true, display: true } },
    { name: "org_name", label: "Org", options: { filter: true, sort: true, display: false } },
    { name: "farm_name", label: "Farm", options: { filter: true, sort: true, display: false } },
    { name: "farm_code", label: "Farm Code", options: { filter: false, sort: true, display: false } },
    { name: "herd_name", label: "Herd", options: { filter: true, sort: false, display: false } },
    { name: "tag_id", label: "Tag", options: { filter: false, sort: true, display: true } },
    { name: "animal_name", label: "Name", options: { filter: false, sort: true, display: true } },
    { name: "sex", label: "Sex", options: { filter: true, sort: true, display: true } },
    { name: "animalType", label: "Type", options: { filter: true, sort: true, display: true } },
    { name: "dateofBirth", label: "DOB", options: { filter: false, sort: true, display: true } },
    { name: "main_breed", label: "Main Breed", options: { filter: true, sort: true, display: true } },
    { name: "breedComposition", label: "Breed Composition", options: { filter: false, sort: false, display: true } },
    { name: "sire_tag_id", label: "Sire", options: { filter: false, sort: true, display: true } },
    { name: "dam_tag_id", label: "Dam", options: { filter: false, sort: true, display: true } },

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
              to={`/management/details/edit/${tableMeta.rowData[0]}/${tableMeta.rowData[1]}/${option2}`}
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
    rowsPerPage: 20,
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
      title="Animals List"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        ANIMAL LIST
      </Typography>
      <br />
      {isLoading &&
        <LinearProgress />
      }

      <Card>
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <MuiThemeProvider theme={theme}>
              <MUIDataTable
                title={caption}
                data={animals}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </Page>
  );
};
AnimalList.propTypes = {
   HerdIdProp: PropTypes.number
};

export default AnimalList;
