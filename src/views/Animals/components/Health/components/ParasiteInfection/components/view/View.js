import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,colors,Link,LinearProgress } from '@material-ui/core';
import {getParasiteInfection}   from '../../../../../../../../utils/API';
import {endpoint_parasite_infection_get} from '../../../../../../../../configs/endpoints';
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

const Edit = props => { 
  const classes = useStyles(); 
  const animal_id  = localStorage.getItem('animal_id');
  const [values, setValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getParasiteInfection(endpoint,id,option)
        .then(response => {                        
          if (mounted) {     
            setIsLoading(false);            
            setValues(response.payload);                 
          }
        });
      })(endpoint_parasite_infection_get,animal_id,0);
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }
 
  const columns = [ 
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},
    { name: "parasite_date",label: "Treatment Date",options: {filter: false,sort: true,display:true}},   
    { name: "parasite_type",label: "Parasite Type",options: {filter: false,sort: true,display:true}},
    { name: "parasite_cow_status",label: "Health Status",options: {filter: true,sort: true, display:true}},
    { name: "parasite_provider",label: "Service Provider",options: {filter: false,sort: true,display:true}},
    { name: "parasite_service_cost",label: "Service Cost",options: {filter: true,sort: true,display:true}},
    { name: "parasite_drug_cost",label: "Drugs Cost",options: {filter: true,sort: true,display:true}}, 
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/health/hoof-treatment/edit/${tableMeta.rowData[0]}`}              
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


  return (
    <Page
      className={classes.root}
      title="PARASITE INFECTION"
    > 
      { isLoading  &&
        <LinearProgress/>
      } 
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
                        title = "Parasite Infection"
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
