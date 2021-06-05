import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Grid,Divider,colors,Link,Typography,Card,CardContent,LinearProgress} from '@material-ui/core';
import { Page } from 'components';
import {genericFunctionFourParameters}   from '../../../../../../../../utils/API';
import {endpoint_orgs} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
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

const Edit = props => {  
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [ {user_id}  ] = useContext(authContext);
  const option  =  2;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,desc,option,id) => {     
        await  genericFunctionFourParameters(endpoint,desc,option,id)
        .then(response => {                        
          if (mounted) {   
            setIsLoading(false);          
            setValues(response.payload);  
            console.log(response);               
          }
        });
      })(endpoint_orgs,'get all orgs',option,user_id); 
      
    return () => {
      mounted = false;
           
    };
  }, [user_id]); 

  if (!values) {
    return null;
  } 
    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "org_name",label: "ORGANIZATION NAME",options: {filter: false,sort: true,display:true}},
    { name: "country",label: "COUNTRY",options: {filter: false,sort: true,display:true}},
    { name: "created_at",label: "DATE CREATED",options: {filter: true,sort: false,display:true}},
    { name: "created_by",label: "CREATED BY",options: {filter: false,sort: true,display:true}}, 
        
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/administration/org/edit/${tableMeta.rowData[0]}`}              
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
    <Page
      className={classes.root}
      title="orgs-setup"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        SETUP -  ORGANIZATIONS   
      </Typography>
      <br/>
      { isLoading  &&
        <LinearProgress/>
      }  
      <Divider />         
      <Grid container spacing={1} >  
        <Grid item xs={9}> 
          <Card>
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
