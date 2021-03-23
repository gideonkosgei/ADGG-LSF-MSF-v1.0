import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors } from '@material-ui/core';
import {getBatchTemplate}   from '../../../../../../utils/API';
import {endpoint_batch_template} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../sidebar';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

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
  const {className,uuid, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]); 
  const [ {organization_id} ] = useContext(authContext);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,type,org) => {     
        await  getBatchTemplate(endpoint,type,org)
        .then(response => {                             
          if (mounted) { 
            if(response.payload.length>0){                       
              setValues(response.payload);               
            }              
          }
        });
      })(endpoint_batch_template,1,organization_id);       
    return () => {
      mounted = false;           
    };
  }, [organization_id]); 

  if (!values) {
    return null;
  }							

    const columns = [
      { name: "animal_id",label: "DAM_ID",options: {filter: false,sort: false,display:true}},
      { name: "estimated_due_date",label: "CALVING_DATE",options: {filter: true,sort: true, display:true}},
      { name: "",label: "C_TAG_ID",options: {filter: true,sort: true, display:true}},
      { name: "",label: "C_NAME",options: {filter: true,sort: true, display:true}},
      { name: "",label: "SEX",options: {filter: true,sort: true, display:true}}, 
      { name: "",label: "C_METHOD",options: {filter: true,sort: true, display:true}},
      { name: "",label: "C_TYPE",options: {filter: true,sort: true, display:true}},
      { name: "",label: "C_EASE",options: {filter: true,sort: true, display:true}}, 
      { name: "",label: "C_STATUS",options: {filter: true,sort: true, display:true}},
      { name: "",label: "USE_OF_CALF",options: {filter: true,sort: true, display:true}}, 
      { name: "",label: "BODY_COND",options: {filter: true,sort: true, display:true}},
      { name: "",label: "COLOR",options: {filter: true,sort: true, display:true}},
      { name: "",label: "GENDER",options: {filter: true,sort: true, display:true}},
      { name: "",label: "WEIGHT",options: {filter: true,sort: true, display:true}},
      { name: "",label: "HEART_GIRTH",options: {filter: true,sort: true, display:true}}     					
    
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
   }   
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title= "BATCH - CALVING TEMPLATE"/>
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
          </Grid> 
          <Grid item xs={11}>
              <Card> 
                <CardContent> 
                 
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = "BATCH - CALVING TEMPLATE"
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