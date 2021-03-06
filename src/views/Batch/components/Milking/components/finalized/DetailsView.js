import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Button } from '@material-ui/core';
import {getBatchValidation}   from '../../../../../../utils/API';
import {endpoint_batch_validation_view} from '../../../../../../configs/endpoints';
import {Sidebar} from '../sidebar';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "./CustomToolbar";
import {Details} from '../add/components/DetailsModal';
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
  const {className,uuid, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]); 
  const [record_id, setRecordID] = useState();   
  const [openDetails, setDetails] = useState(false);

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

  const handleDetailsOpen = (record_id) => { 
    setRecordID(record_id);
    setDetails(true);
  };

  const handleDetailsClose = () => {
    setDetails(false);
  };

 
    const columns = [
      { name: "record_id",label: "Record Id",options: {filter: false,sort: false, display:false}},
      { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
      { name: "animal_id",label: "Animal",options: {filter: true,sort: true, display:true}},
      { name: "milk_date",label: "Milk Date",options: {filter: true,sort: true, display:true}},
      { name: "amount_morning",label: "Morning",options: {filter: true,sort: true, display:true}},
      { name: "amount_noon",label: "Noon",options: {filter: true,sort: true, display:true}},
      { name: "amount_afternoon",label: "Afternoon",options: {filter: true,sort: true, display:true}},
      { name: "lactation_id",label: "Lact ID",options: {filter: true,sort: true, display:true}},
      { name: "lactation_number",label: "Lact No",options: {filter: true,sort: true, display:true}},
      { name: "days_in_milk",label: "Days in Milk",options: {filter: true,sort: true, display:true}},
      { name: "test_day_no",label: "Test Day",options: {filter: true,sort: true, display:true}},
      { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true, 
      display:true,   
      customBodyRender: (value, tableMeta, updateValue) => {         
        return (                              
          <Button onClick = {() => handleDetailsOpen(tableMeta.rowData[0])}>            
          < OpenInNewIcon className={classes.buttonIcon} />                
          </Button>
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
        <CardHeader title= "POSTED MILK RECORDS"/>
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
                          title = "POSTED MILK RECORDS"
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
        <Details
            record_id={record_id}
            data = {values}
            onClose={handleDetailsClose}
            open={openDetails}    
           />  
    </Card>
  );
};

DetailsView.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsView;