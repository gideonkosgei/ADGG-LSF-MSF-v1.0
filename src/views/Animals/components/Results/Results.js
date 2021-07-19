import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Divider, Link } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CustomToolbar from "./CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 15
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  }
}));

const Results = props => {
  const { animals, caption } = props;
  const classes = useStyles();

  const columns = [
    { name: "animal_id", label: "ID", options: { filter: false, sort: true, display: true } },
    { name: "farm_id", label: "farm_id", options: { filter: false, sort: false, display: false } },
    { name: "registration_date", label: "Reg Date", options: { filter: false, sort: true, display: true } },
    { name: "org_name", label: "Org", options: { filter: true, sort: true, display: false } },
    { name: "farm_name", label: "Farm", options: { filter: true, sort: true, display: false } },
    { name: "farm_code", label: "Farm Code", options: { filter: false, sort: true, display: false } },
    { name: "herd_name", label: "Herd", options: { filter: true, sort: false, display: false} },
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
              to={`/management/details/edit/${tableMeta.rowData[0]}/${tableMeta.rowData[1]}`}
            >
              <OpenInNewIcon />
            </Link>
          );
        }
      }
    }

  ];

  const data = animals;

  const options = {
    filter: true,
    rowsPerPage: 20,
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

  console.log(data);

  return (
    <Card>
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <MuiThemeProvider>
            <MUIDataTable
              title={caption}
              data={data}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  clients: PropTypes.array.isRequired
};

Results.defaultProps = {
  clients: []
};
export default Results;
