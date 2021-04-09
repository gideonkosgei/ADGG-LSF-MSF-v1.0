import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Typography,LinearProgress, Grid,Divider,colors,Link} from '@material-ui/core';
import {getParametersLimitAll}   from '../../../../../../utils/API';
import {endpoint_parameter_limit_all} from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';

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
  }
}));

const Edit = props => { 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint) => {     
        await  getParametersLimitAll(endpoint)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);  
            setLoading(false);                  
          }
        });
      })(endpoint_parameter_limit_all); 
      
    return () => {
      mounted = false;
           
    };
  }, []); 

  if (!values) {
    return null;
  }   
  
 
    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "category",label: "Category",options: {filter: true,sort: true,display:true}},
    { name: "description",label: "Description",options: {filter: false,sort: true,display:true}},  
    { name: "min_value",label: "Minimum Value",options: {filter: false,sort: true,display:true}}, 
    { name: "max_value",label: "Maximum Value",options: {filter: false,sort: true,display:true}},   
    { name: "is_active",label: "Is Active?",options: {filter: false,sort: true,display:true}},    
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/settings/parameters/limits/edit/${tableMeta.rowData[0]}`}              
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
        noMatch: loading ? 'Loading...':'Sorry, there is no matching records to display',
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
      title="Profile"
    >
    <Typography
      component="h1"
      gutterBottom
      variant="h3"
    >
      LIMITING PARAMETERS    
    </Typography>
    { loading  &&
      <LinearProgress/>
    }  
    <Divider />  
    <br/> 
    <Grid container spacing={1} justify="center"> 
          <Grid item xs={12}>
              <Card> 
                <CardContent>                 
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
