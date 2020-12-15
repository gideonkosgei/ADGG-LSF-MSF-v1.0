import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors } from '@material-ui/core';
import {getBatchValidation}   from '../../../../../../utils/API';
import {endpoint_batch_validation_view} from '../../../../../../configs/endpoints';
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

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,batch_uuid) => {     
        await  getBatchValidation(endpoint,batch_uuid)
        .then(response => {                             
          if (mounted) { 
            if(response.payload.length>0){                       
              setValues(response.payload);               
            }              
          }
        });
      })(endpoint_batch_validation_view,uuid);       
    return () => {
      mounted = false;           
    };
  }, [uuid]); 

  if (!values) {
    return null;
  }

    
    const columns = [
      { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
      { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
      { name: "exit_date",label: "Exit Date",options: {filter: true,sort: true, display:true}},
      { name: "disposal_reason",label: "Exit Reason",options: {filter: true,sort: true, display:true}},
      { name: "disposal_amount",label: "Disposal Amount",options: {filter: true,sort: true, display:true}},
      { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}
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
        <CardHeader title= "POSTED EXIT & DISPOSAL RECORDS"/>
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
                          title = "POSTED EXIT & DISPOSAL RECORDS RECORDS"
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