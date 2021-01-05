import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Grid,colors,CardActions,Box,Button } from '@material-ui/core';
import {getBatchUnprocessed,batchProcessActions}   from '../../../../../../../../utils/API';
import {endpoint_batch_validation_un_processed_view,endpoint_batch_actions} from '../../../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "./CustomToolbar";
import authContext from '../../../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';

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
  const [values, setValues] = useState(UploadedRecords);  
  const [ {organization_id} ] = useContext(authContext);
  const [ {user_id} ] = useContext(authContext);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  
  const uuid= localStorage.getItem('batch_upload_uuid');
  localStorage.removeItem('batch_upload_uuid');

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,type,org_id,step,user_id) => {     
        await  getBatchUnprocessed(endpoint,type,org_id,step,user_id)
        .then(response => {                        
          if (mounted) {                       
            setValues(response.payload);
          }
        });
      })(endpoint_batch_validation_un_processed_view,2,organization_id,step,user_id); 
      
    return () => {
      mounted = false;
           
    };
  }, [organization_id,step,user_id]); 

  if (!values) {
    return null;
  }   

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
    const columns = [
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal",options: {filter: true,sort: true, display:true}},
    { name: "weight_date",label: "Weight Date",options: {filter: true,sort: true, display:true}},
    { name: "body_length",label: "Body Length",options: {filter: true,sort: true, display:true}},
    { name: "heart_girth",label: "Heart Girth",options: {filter: true,sort: true, display:true}},
    { name: "body_weight",label: "Body Weight",options: {filter: true,sort: true, display:true}},
    { name: "body_score",label: "Body Score",options: {filter: true,sort: true, display:true}}, 
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}},        
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true  
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