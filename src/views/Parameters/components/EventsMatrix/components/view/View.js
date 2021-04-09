import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,LinearProgress, Typography, Grid,Divider,colors,Link} from '@material-ui/core';
import {getEventSetupAll}   from '../../../../../../utils/API';
import {endpoint_event_setup_all} from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
        await  getEventSetupAll(endpoint)
        .then(response => {                        
          if (mounted) { 
            setLoading(false);             
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_event_setup_all);      

    return () => {
      mounted = false;           
    };
  }, []); 

  if (!values) {
    return null;
  } 
 
    const columns = [
    { name: "animal_type_id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "animal_type",label: "Animal Type",options: {filter: true,sort: true,display:true}},
    { name: "calving",label: "Calving",options: {filter: false,sort: true,display:true}},  
    { name: "milking",label: "Milking",options: {filter: false,sort: true,display:true}}, 
    { name: "health",label: "Health",options: {filter: false,sort: true,display:true}}, 
    { name: "bio_data",label: "Bio Data",options: {filter: false,sort: true,display:true}},
    { name: "insemination",label: "Insemination",options: {filter: false,sort: true,display:true}}, 
    { name: "sync",label: "Sync",options: {filter: false,sort: true,display:true}}, 
    { name: "exit",label: "Exit",options: {filter: false,sort: true,display:true}}, 
    { name: "weight",label: "Weight",options: {filter: false,sort: true,display:true}},
    { name: "pd",label: "PD",options: {filter: false,sort: true,display:true}}, 
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/settings/parameters/events-matrix/edit/${tableMeta.rowData[0]}`}              
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
    }   
  };

  return (
    <Page
      className={classes.root}
      title="event matrix"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
    >
      EVENTS MATRIX    
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
