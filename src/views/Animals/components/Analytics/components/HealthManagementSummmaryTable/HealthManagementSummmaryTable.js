import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import {endpoint_health_summary_table} from '../../../../../../configs/endpoints';
import {getHealthManagementSummary}   from '../../../../../../utils/API';
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

const HealthManagementSummmaryTable = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,animal_id)=>{     
      await  getHealthManagementSummary(endpoint,animal_id)
       .then(response => {              
         if (mounted) {
          setValues(response.payload);                           
         }
       });
     })(endpoint_health_summary_table,animal_id);
    return () => {
      mounted = false;
    };
  }, [animal_id]);

  if (!values) {
    return null;
  } 
  
  const columns = [
    { name: "health_category",label: "Health Category",options: {filter: false,sort: true,display:true}},  
    { name: "frequency",label: "Frequency",options: {filter: false,sort: true,display:true}},  
    { name: "cummulative_cost",label: " Cummulative Cost",options: {filter: false,sort: true,display:true}}           
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
        title="ANIMAL HEALTH SUMMARY"
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
HealthManagementSummmaryTable.propTypes = {
  className: PropTypes.string
};
export default HealthManagementSummmaryTable;
