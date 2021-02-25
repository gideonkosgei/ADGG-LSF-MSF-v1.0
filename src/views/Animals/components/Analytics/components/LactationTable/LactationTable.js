import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import {endpoint_lactation_table} from '../../../../../../configs/endpoints';
import {getlactationTable}   from '../../../../../../utils/API';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { GenericMoreButton } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.white
  },
  actions: {
    justifyContent: 'flex-end'
  },
  
}));

const LactationTable = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,animal_id)=>{     
      await  getlactationTable(endpoint,animal_id)
       .then(response => {              
         if (mounted) {
          setValues(response.payload);                           
         }
       });
     })(endpoint_lactation_table,animal_id);
    return () => {
      mounted = false;
    };
  }, [animal_id]);

  if (!values) {
    return null;
  }

  const columns = [
    { name: "lactation_id",label: "Lactation ID",options: {filter: false,sort: true,display:false}},  
    { name: "parity",label: "Parity",options: {filter: false,sort: true,display:true}},  
    { name: "date_start",label: "Lactation Start",options: {filter: false,sort: true,display:true}},
    { name: "date_end",label: "Lactation End",options: {filter: false,sort: true,display:true}},
    { name: "total_days_in_milk",label: "DIM",options: {filter: false,sort: true,display:true}},
    { name: "total_milk",label: "Total Milk ",options: {filter: false,sort: true,display:true}},
    { name: "avg_daily_milk",label: "Avg Daily Milk",options: {filter: false,sort: true,display:true}},    
    { name: "max_milk_amount",label: "Max Milk",options: {filter: false,sort: true, display:true}},    
    { name: "min_milk_amount",label: "Min Milk",options: {filter: false,sort: true,display:true}},
    { name: "calving_interval",label: "Calving Interval",options: {filter: false,sort: true,display:true}}         
  ];

  const options = {  
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'stacked',                
    rowHover: true, 
    search: false,
    filter: false,  
    print: true,
    viewColumns: false,    
    setTableProps: () => {
     return {
       padding: "none" ,         
       size: "small",
     };
   }    
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="LACTATION SUMMARY"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <MuiThemeProvider>                
              <MUIDataTable
                title = ""
                data={values}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </PerfectScrollbar> 
      </CardContent>
      <Divider /> 
    </Card>    
  );
};
LactationTable.propTypes = {
  className: PropTypes.string
};
export default LactationTable;
