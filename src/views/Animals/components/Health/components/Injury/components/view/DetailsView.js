import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,colors,Link } from '@material-ui/core';
import {getInjury}   from '../../../../../../../../utils/API';
import {endpoint_injury_get} from '../../../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const DetailsView = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getInjury(endpoint,id,option)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);                 
          }
        });
      })(endpoint_injury_get,animal_id,0);
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }
  
 
  const columns = [
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},
    { name: "treatment_date",label: "Treatment Date",options: {filter: false,sort: true,display:true}},   
    { name: "injury_type",label: "Injury Type",options: {filter: false,sort: true,display:true}},
    { name: "health_status",label: "Health Status",options: {filter: true,sort: true, display:true}},
    { name: "service_provider",label: "Service Provider",options: {filter: false,sort: true,display:true}},
    { name: "service_cost",label: "Service Cost",options: {filter: true,sort: true,display:true}},
    { name: "drugs_cost",label: "Drugs Cost",options: {filter: true,sort: true,display:true}},        
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/health/injury/edit/${tableMeta.rowData[0]}`}              
          >
            <OpenInNewIcon/>
          </Link>          
        );
      }
    }
  }
    
  ];

  console.log(values);

  
  const options = {       
    filter: true,
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'stacked',                
    rowHover: true,       
    setTableProps: () => {
     return {
       padding: "none" ,         
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar animal_id = {animal_id}/>
          </Grid> 
          <Grid item xs={11}>
              <Card> 
                <CardContent>
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = {`Injury- ${animal_name}(${animal_tag})`}
                          data={values}
                          columns={columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </div>
                  </PerfectScrollbar> 
                </CardContent>
              </Card> 
          </Grid>
        </Grid>
        </CardContent> 
    </Card>
  );
};

DetailsView.propTypes = {
  className: PropTypes.string 
};

export default DetailsView;