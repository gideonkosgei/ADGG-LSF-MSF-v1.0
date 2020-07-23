import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors } from '@material-ui/core';
import {getCalving}   from '../../../../../../utils/API';
import {endpoint_calving} from '../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";

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

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id) => {     
        await  getCalving(endpoint,id)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_calving,186390); 
      
    return () => {
      mounted = false;
           
    };
  }, [animal_id]); 

  if (!values) {
    return null;
  }  
    const columns = [
    { name: "calving_date",label: "Calving Date",options: {filter: false,sort: true,display:true}}, 
    { name: "calf_tag_id",label: "C.Tag ID",options: {filter: false,sort: true,display:true}}, 
    { name: "calf_name",label: "C.Name",options: {filter: false,sort: true,display:true}},   
    { name: "calving_birth_type",label: "Birth Type",options: {filter: false,sort: true,display:true}},
    { name: "calf_body_condition_score",label: "C.Body Score",options: {filter: false,sort: true,display:true}},    
    { name: "calf_sex",label: "C.Gender",options: {filter: true,sort: true, display:true}},
    { name: "calf_color",label: "C.Color",options: {filter: false,sort: true,display:true}},
    { name: "calf_weight",label: "C.Weight",options: {filter: true,sort: true,display:true}},    
    { name: "calf_heart_girth",label: "Calf H. Girth",options: {filter: true,sort: true,display:true}},     
    { name: "calf_deformities",label: "Deformaties",options: {filter: true,sort: true,display:true}}    
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
        <CardHeader title="Calving Details" />
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
                          title = ""
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