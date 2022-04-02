import React, { useState,useEffect,useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,LinearProgress,Divider, Grid,colors,Link ,Typography} from '@material-ui/core';
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
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
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
  const [values, setValues] = useState([]);
  const [ {user_id} ] = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {     
    let mounted = true;

      (async  (endpoint,desc,option,user) => {     
        await  genericFunctionFourParameters(endpoint,desc,option,user)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);   
            setIsLoading(false);                
          }
        });
      })(endpoint_user_list,'Org user list',1,user_id);

    return () => {
      mounted = false;           
    };
  }, [user_id]); 

  if (!values) {
    return null;
  } 
 
    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: true,display:false}},   
    { name: "name",label: "Name",options: {filter: false,sort: true,display:true}},
    { name: "username",label: "User Name",options: {filter: false,sort: true,display:true}},
    { name: "country",label: "Country",options: {filter: true,sort: true,display:true}},
    { name: "default_org",label: "Org",options: {filter: true,filterType:'multiselect',sort: true,display:true}},
    { name: "email",label: "Email Address",options: {filter: false,sort: true,display:true}},
    { name: "phone",label: "Phone",options: {filter:false,sort: true,display:true}},        
    { name: "role",label: "Role",options: {filter: true,sort: true,display:true}}, 
    { name: "status",label: "Status",options: {filter: true,sort: true,display:true}},        
    { name: "created_at",label: "Date Created",options: {filter: true,sort: true,display:true,filterType:'multiselect'}}, 
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}             
              to = {`/administration/org/user-accounts/edit/${tableMeta.rowData[0]}`}               
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
    rowsPerPage: 10,       
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
    
    <Page
      className={classes.root}
      title="user accounts"
    >
       <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
       USER ACCOUNTS
      </Typography>
      { isLoading  &&
        <LinearProgress/>
      }  
      <Divider />  
      <br/>   
        <Grid container spacing={1} justify="center">  
            <Grid item xs={12}>
              <Card > 
                <CardContent>                 
                  <PerfectScrollbar>                  
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = ""
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
