import React, { useState,useEffect,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,colors,Link ,Typography} from '@material-ui/core';
import {genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_user_list} from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';
import CustomToolbar from "../CustomToolbar";
import authContext from '../../../../../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },  
  content: {
    marginTop: theme.spacing(3)
  },
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
  const [ {organization_id} ] = useContext(authContext);
  

  useEffect(() => {     
    let mounted = true;

      (async  (endpoint,desc,option,org) => {     
        await  genericFunctionFourParameters(endpoint,desc,option,org)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_user_list,'Org user list',1,organization_id);

    return () => {
      mounted = false;           
    };
  }, [organization_id]); 

  if (!values) {
    return null;
  } 
 
    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "name",label: "Name",options: {filter: false,sort: true,display:true}},    
    { name: "phone",label: "Phone",options: {filter:true,sort: true,display:true}},
    { name: "email",label: "Email Address",options: {filter: true,sort: false,display:true}}, 
    { name: "country",label: "Country",options: {filter: true,sort: false,display:true}},   
    { name: "role",label: "Role",options: {filter: false,sort: false,display:true}}, 
    { name: "default_org",label: "Default Org",options: {filter: false,sort: false,display:true}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/administration/org/edit/${tableMeta.rowData[0]}/${tableMeta.rowData[1]}`}              
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
    <Page className={classes.root} >
      <Typography
      component="h1"
      variant="h3"
      spacing={3}
      >
        Farm User Accounts
      </Typography>
    
          <Grid  {...rest}
              className={clsx(classes.root, className)}
              container              
              > 
            <Grid item xs={12}>
              <Card > 
                <CardContent>                 
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = "FARM USERS"
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
    </Page>
  );
};

DetailsView.propTypes = {
  className: PropTypes.string  
};

export default DetailsView;