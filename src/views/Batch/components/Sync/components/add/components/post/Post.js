import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Grid,colors,CardActions,Box,Button } from '@material-ui/core';
import {batchProcessActions}   from '../../../../../../../../utils/API';
import {endpoint_batch_actions} from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "./CustomToolbar";
import authContext from '../../../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import {Details} from '../DetailsModal';
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

const Post = props => {
  const {className,step,UploadedRecords, ...rest } = props; 
  const classes = useStyles();   
  const [ {user_id} ] = useContext(authContext);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [record_id, setRecordID] = useState();   
  const [openDetails, setDetails] = useState(false); 
  
  const uuid= localStorage.getItem('batch_upload_uuid');
  localStorage.removeItem('batch_upload_uuid');

  let values = [];

  for (let i = 0; i<UploadedRecords.length;i++){
    if (UploadedRecords[i].record_status_id === 2){
      values.push(UploadedRecords[i]);
    }
  }

  useEffect(() => {  
  }, []);

  const handlePostRecords = event => {
    event.preventDefault(); 
    (async  (_endpoint,_uuid,_action,_user_id) => { 
      await  batchProcessActions(_endpoint,_uuid,_action,_user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);               
        var delayInMilliseconds = 1000; //1 second
        setTimeout(function() {
           window.location.reload();           
        }, delayInMilliseconds);

      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_batch_actions,uuid,4,user_id);    
  };

  const handleDiscard = event => {   
    event.preventDefault(); 
    (async  (_endpoint,_uuid,_action,_user_id) => { 
      await  batchProcessActions(_endpoint,_uuid,_action,_user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
        var delayInMilliseconds = 1000; //1 second
        setTimeout(function() {
           window.location.reload();           
        }, delayInMilliseconds);

      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_batch_actions,uuid,2,user_id);    
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleDetailsOpen = (record_id) => { 
    setRecordID(record_id);
    setDetails(true);
  };

  const handleDetailsClose = () => {
    setDetails(false);
  };
   
    const columns = [
      { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
      { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
      { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
      { name: "sync_date",label: "Sync Date",options: {filter: true,sort: true, display:true}},
      { name: "sync_number",label: "Sync Number",options: {filter: true,sort: true, display:true}},
      { name: "hormone_type",label: "Hormone Type",options: {filter: true,sort: true, display:true}},
      { name: "hormone_source",label: "Source",options: {filter: true,sort: true, display:true}},
      { name: "admin_name",label: "Admin",options: {filter: true,sort: true, display:true}},
      { name: "cost",label: "Cost",options: {filter: true,sort: true, display:true}},    
      { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}},
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
      },    
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
        <Grid container spacing={1} justify="center"> 
          <Grid item xs={11}>
            <Card {...rest} className={clsx(classes.root, className)}>      
                <CardContent>
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = "BATCH LISTING - POSTING"
                          data={values}
                          columns={columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </div>
                  </PerfectScrollbar> 
                </CardContent>
                <CardActions>          
          <Box flexGrow={1}>           
          </Box>   
          <Box>      
            {
            values[0].batch_status_id ===3 || (values[0].batch_status_id ===2 &&   values[0].successful_records > 0)?            
            <form onSubmit={handlePostRecords}>                
              <Button
                className={classes.saveButton}               
                variant="contained"
                hidden = "true"
                type="submit"                                              
              >
                Post Records
              </Button>
            </form>  
              : 
              null
            } 
          </Box> 
          {
          values[0].batch_status_id ===4 ?  null : 
          <Box> 
            <form onSubmit={handleDiscard}>         
              <Button
                className={classes.saveButton}
                variant="contained"
                hidden = "true" 
                type = "submit"                              
              >
                Discard Batch
              </Button>
            </form>             
          </Box>
      
          }
                  
        </CardActions>
          <SuccessSnackbar
            onClose={handleSnackbarSuccessClose}
            open={openSnackbarSuccess}
          />
          <ErrorSnackbar
            onClose={handleSnackbarErrorClose}
            open={openSnackbarError}
          />  
          <Details
            record_id={record_id}
            data = {values}
            onClose={handleDetailsClose}
            open={openDetails}    
        />     
          </Card> 
          </Grid>
        </Grid>
        
  );
};

Post.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default Post;