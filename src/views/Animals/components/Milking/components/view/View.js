import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,TextField, Grid,Divider,colors,Link,Typography,LinearProgress} from '@material-ui/core';
import {getMilking}   from '../../../../../../utils/API';
import {endpoint_milking} from '../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';
import {Header} from '../index';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
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
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [valuesOriginal, setValuesOriginal] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const [lactations, setLactations]  =  useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getMilking(endpoint,id,option)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);  
            setValuesOriginal(response.payload[0]);
            setIsLoading(false);  
             let lactation_array = []  
            if  (response.payload[0].length > 0){      
              for (let i = 0 ; i< response.payload[0].length; i++ ) {
                lactation_array.push(response.payload[0][i].lactation_id);                
              }
              const unique_lactations = [...new Set(lactation_array)];  
              setLactations(unique_lactations.sort((a, b) => a - b));
           }
          }
        });
      })(endpoint_milking,animal_id,0); 
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }  
 

    const columns = [
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}}, 
    { name: "milk_date",label: "Milk Date",options: {filter: false,sort: true,display:true}}, 
    { name: "lactation_id",label: "Lactation ID",options: {filter: true,sort: true,display:true}}, 
    { name: "testday_no",label: "Test Day",options: {filter: false,sort: true,display:true}},   
    { name: "days_in_milk",label: "Days in Milk",options: {filter: false,sort: true,display:true}},
    { name: "milk_am_litres",label: "Milk(am)(ltr)",options: {filter: false,sort: true,display:true}},    
    { name: "milk_mid_day",label: "Milk(midday)(ltr)",options: {filter: false,sort: true, display:true}},
    { name: "milk_pm_litres",label: "Milk(pm)(ltr)",options: {filter: false,sort: true,display:true}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/milking/edit/${tableMeta.rowData[0]}`}              
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
   textLabels: {
    body: {
        noMatch: isLoading ? 'Loading...':'Sorry, there is no matching records to display',
      },
    },
   customToolbar: () => {
    return (
      <CustomToolbar />
    );
  }  
  }; 

  const handleChange = event => {
    setValues({...values });
    event.persist();
    let filtered_values = []; 
   
    if (valuesOriginal.length > 0 ){
      if(parseInt(event.target.value) === 0){
        setValues(valuesOriginal);        
      } else {      
        for (let i = 0; i< valuesOriginal.length; i++){          
          if (valuesOriginal[i].lactation_id === event.target.value){           
            filtered_values.push(valuesOriginal[i]);         
          }  
        }
        setValues(filtered_values); 
      }       
    } 
  };
 
  
  return (
    <Page
    className={classes.root}
    title="milking"
  >
     <Typography
      component="h1"
      gutterBottom
      variant="h3"
    >
     {`MILKING RECORDS  - ${animal_name}(${animal_tag}) `}
    </Typography>
    { isLoading  &&
      <LinearProgress/>
    }  
    <Divider />  
    <br/>  
    <Header />
    <br/>           
    <Grid container spacing={1} justify="center">            
      <Grid item  xs={1} >  
        <Sidebar animal_id = {animal_id}/>
      </Grid>       
      <Grid item xs={11}>
        <Card> 
          <CardContent>
          <Grid container >  
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}               
                  label="LACTATION ID"
                  name="lactation_id"                                 
                  default = "" 
                  margin = 'dense'                             
                  select                
                  SelectProps={{ native: true }}                    
                  variant="filled"
                  onChange={handleChange} 
                >
                  <option value ={0}></option>
                  {lactations.map(lactation_id => (
                    <option value={lactation_id}> {lactation_id}</option>
                    ))
                  }          
                </TextField>
              </Grid>
            </Grid>  
            <PerfectScrollbar>                  
                <MuiThemeProvider>                
                  <MUIDataTable
                    title = ""
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
