import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Typography,LinearProgress, Grid,Divider,colors,Link } from '@material-ui/core';
import {getWeights}   from '../../../../../../utils/API';
import {endpoint_weight} from '../../../../../../configs/endpoints';
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
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
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
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');  
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getWeights(endpoint,id,option)
        .then(response => {               
          if (mounted) {            
            setValues(response.payload[0]); 
            setIsLoading(false);                  
          }
        });
      })(endpoint_weight,animal_id,0);
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }

  const columns = [
    { name: "Event_ID",label: "Event ID",options: {filter: false,sort: true,display:true}},    
    { name: "event_date",label: "Weight Date",options: {filter: false,sort: true,display:true}},
    { name: "body_length",label: "Body Length",options: {filter: false,sort: true,display:true}},
    { name: "heart_girth",label: "Heart Girth",options: {filter: true,sort: true, display:true}},
    { name: "weight_kg",label: "Weight(kg)",options: {filter: true,sort: true, display:true}},
    { name: "body_score_id",label: "Body Score",options: {filter: false,sort: true,display:true}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/weight/edit/${tableMeta.rowData[0]}`}              
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
      title="weight & growth"
    >
 
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
       {`WEIGHT & GROWTH RECORDS : ${animal_tag}`}
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
