import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link} from '@material-ui/core';
import {getInsemination}   from '../../../../../../utils/API';
import {endpoint_insemination} from '../../../../../../configs/endpoints';
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
        await  getInsemination(endpoint,id,option)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_insemination,animal_id,0); 
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }

    const columns = [
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},
    { name: "ai_date",label: "AI Date",options: {filter: false,sort: true,display:true}},    
    { name: "type_of_ai",label: "AI Type",options: {filter: false,sort: true,display:true}},
    //{ name: "semen_batch",label: "Batch",options: {filter: false,sort: true,display:true}},    
    { name: "straw_id_scan_sire_code",label: "Straw ID",options: {filter: true,sort: true, display:true}},
    { name: "source_of_semen",label: "Semen Source",options: {filter: false,sort: true,display:true}},
    { name: "straw_semen_type",label: "Semen Type",options: {filter: true,sort: true,display:true}},
    //{ name: "country_of_sire_bull_origin",label: "Bull Origin",options: {filter: true,sort: true,display:true}},
    { name: "breed_of_the_bull",label: "Bull Breed",options: {filter: true,sort: true,display:true}},     
    { name: "breed_composition_of_bull",label: "Breed Comp.",options: {filter: true,sort: true,display:true}},
    //{ name: "ai_cost",label: "AI Cost",options: {filter: true,sort: true,display:true}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/insemination/edit/${tableMeta.rowData[0]}`}              
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    > 
        <CardHeader  title= {`INSEMINATION - ${animal_name}(${animal_tag})`} />
        <Divider />
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
                          title = {`INSEMINATION - ${animal_name}(${animal_tag})`}
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
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsView;