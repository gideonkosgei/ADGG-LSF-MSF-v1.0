import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link } from '@material-ui/core';
import {getBatchMilkingUnprocessed}   from '../../../../../../utils/API';
import {endpoint_batch_milk_validation_un_processed_view} from '../../../../../../configs/endpoints';
import {Sidebar} from '../../../sidebar';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "./CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import authContext from '../../../../../../contexts/AuthContext'



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
  const {className,step, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);  
  const [ {organization_id} ] = useContext(authContext);
  const [ {user_id} ] = useContext(authContext);



  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,org_id,step,user_id) => {     
        await  getBatchMilkingUnprocessed(endpoint,org_id,step,user_id)
        .then(response => {                        
          if (mounted) {                       
            setValues(response.payload);                 
          }
        });
      })(endpoint_batch_milk_validation_un_processed_view,organization_id,step,user_id); 
      
    return () => {
      mounted = false;
           
    };
  }, [organization_id,step,user_id]); 

  if (!values) {
    return null;
  }


    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: true,display:true}},    
    { name: "batch_type",label: "Batch Type",options: {filter: false,sort: true,display:true}},
    { name: "step",label: "Current Stage",options: {filter: false,sort: true,display:true}},    
    { name: "status",label: "Status",options: {filter: true,sort: true, display:true}}, 
    { name: "created_by",label: "Created By",options: {filter: true,sort: true,display:true}},     
    { name: "created_at",label: "Date Created",options: {filter: true,sort: true,display:true}},
    { name: "created_time",label: "Time Created",options: {filter: true,sort: true,display:true}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/exit/edit/${tableMeta.rowData[0]}`}              
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
        <CardHeader title={ (step ==='2')?`Batch processes - Milking Records Pending Validation` :`Batch processes - Milking Records Pending Posting`} />
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