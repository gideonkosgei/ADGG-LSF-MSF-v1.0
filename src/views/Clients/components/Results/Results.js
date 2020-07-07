import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {  Card,CardActions,CardContent,CardHeader, Divider} from '@material-ui/core';
import {GenericMoreButton } from 'components';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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
  const { className,clients, ...rest } = props;
  const classes = useStyles(); 

  const columns = [
    { name: "org_id", label: "org_id", options: {filter: false,sort: true,display:false}}, 
    { name: "Client_Country",label: "Country",options: {filter: true,sort: true,}},
    { name: "Client_CountyRegion",label: "Region",options: {filter: true,sort: false,}},
    { name: "Client_Description",label: "Description",options: {filter: false,sort: true,}},
    { name: "Client_emailAddress",label: "Email",options: {filter: false,sort: true,}},
    { name: "Client_ID",label: "ID",options: {filter: false,sort: true,display:false}},
    { name: "Client_migrationId",label: "Migration ID",options: {filter: false,sort: true,display:false}},
    {name: "Client_Name",label: "Name",options: {filter: false,sort: true,}},
    { name: "Client_odkFormUuid",label: "ODK ID",options: {filter: true,sort: false,display:false}},
    { name: "Client_phone1",label: "Phone 1",options: {filter: true,sort: false,}},
    { name: "Client_phone2",label: "Phone 2",options: {filter: true,sort: false,}},
    { name: "Client_postalAddress",label: "Address",options: {filter: false,sort: true, display:true}},
    { name: "Client_Remarks",label: "Remarks",options: {filter: true,sort: false,display:true}}, 
    { name: "Client_TownCity",label: "Town/City",options: {filter: true,sort: false,}}, 
    { name: "Client_contactPerson",label: "Contact Person",options: {filter: false,sort: true, display:false}}     
  ];
  const data = clients;     
     const options = {       
       filter: true,
       rowsPerPage: 5,      
       filterType: 'checkbox',// //filterType: 'dropdown',
       rowsPerPageOptions :[5,10,20,50,100],
       responsive: 'stacked', //   responsive: 'scrollMaxHeight',                
       rowHover: true,       
       setTableProps: () => {
        return {
          padding: "none" ,         
          size: "small", // material ui v4 only
        };
      } 
     };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Card>
        <CardHeader
          action={<GenericMoreButton />}
          title="All Clients"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
            <MuiThemeProvider>                
              <MUIDataTable
               // title={"Animal List"}
                data={data}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>          
        </CardActions>
      </Card>
     
    </div>
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
