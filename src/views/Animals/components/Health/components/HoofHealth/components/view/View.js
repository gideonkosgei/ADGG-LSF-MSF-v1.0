import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,colors,Link } from '@material-ui/core';
import {getHoofHealth}   from '../../../../../../../../utils/API';
import {endpoint_hoof_health_get} from '../../../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Edit = () => {  
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getHoofHealth(endpoint,id,option)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);                 
          }
        });
      })(endpoint_hoof_health_get,animal_id,0);
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }
 
  const columns = [
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},
    { name: "health_date",label: "Date",options: {filter: false,sort: true,display:true}},    
    { name: "digital_dermatitis",label: "Digital Dermatitis",options: {filter: false,sort: true,display:true}},
    { name: "interdigital_hyperplasia",label: "I Hyperplasia",options: {filter: true,sort: true, display:true}},
    { name: "interdigital_phlegmon",label: "I Phlegmon",options: {filter: false,sort: true,display:true}},
    { name: "scissor_claws",label: "Scissor Claws",options: {filter: true,sort: true,display:true}},
    { name: "horizontal_horn_fissure",label: "H Horn Fissure",options: {filter: true,sort: true,display:true}},     
    { name: "vertical_horn_fissure",label: "V Horn Fissure",options: {filter: true,sort: true,display:true}},
    { name: "swelling_of_coronet",label: "Swelling Coronet",options: {filter: true,sort: true,display:true}}, 
    { name: "heel_horn_erosion",label: "Heel/Horn Erosion",options: {filter: true,sort: true,display:true}},  
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/health/hoof-health/edit/${tableMeta.rowData[0]}`}              
          >
            <OpenInNewIcon/>
          </Link>          
        );
      }
    }
  }
    
  ];

  
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
      <Page
        className={classes.root}
        title="Hoof Health"
      >
      <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar animal_id = {animal_id}/>
          </Grid> 
          <Grid item xs={11}>
            <Card> 
              <CardContent>
                <PerfectScrollbar>                   
                  <MuiThemeProvider>                
                    <MUIDataTable
                      title = "HOOF HEALTH"
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
