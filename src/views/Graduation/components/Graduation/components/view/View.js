import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,Divider,colors,Link,Typography,LinearProgress} from '@material-ui/core';
import {getGraduation}   from '../../../../../../utils/API';
import {endpoint_graduation_list} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Page } from 'components';

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
  }
}));

const Edit = props => { 
  const classes = useStyles();   
  const [values, setValues] = useState([]);
  const [ {organization_id}  ] = useContext(authContext);
  const graduation_status =  parseInt(props.match.params.status);
  const form_title = graduation_status ? '(UN-PROCESSED)' : '(PROCESSED)';
  const [isLoading, setIsLoading] = useState(true);

   /*
    determined if processed/unprocessed records will be displayed
    0 : unprocessed
    1 : processed
  */

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,org_id,is_active) => {     
        await  getGraduation(endpoint,org_id,is_active)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload); 
            setIsLoading(false);                    
          }
        });
      })(endpoint_graduation_list,organization_id,graduation_status); 
      
    return () => {
      mounted = false;           
    };
  }, [organization_id,graduation_status]); 

  if (!values) {
    return null;
  }   

    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "animal_id",label: "Animal ID",options: {filter: false,sort: true,display:true}},
    { name: "tag_id",label: "Tag ID",options: {filter: false,sort: true,display:true}}, 
    { name: "name",label: "Animal Name",options: {filter: false,sort: true,display:true}},   
    { name: "graduate_from",label: "Graduate FROM",options: {filter:true,sort: true,display:true}}, 
    { name: "graduate_to",label: "Graduate TO",options: {filter: true,sort: false,display:true}}, 
    { name: "action",label: "Status",options: {filter: true,sort: false,display:true}},  
    { name: "created_at",label: "Graduation Date",options: {filter: false,sort: false,display:true}}, 
    { name: "uuid",label: "UUID",options: {filter: false,sort: false,display:false}},
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/graduation/edit/${tableMeta.rowData[0]}`}              
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
   }   
  };
 
  return (
    <Page
    className={classes.root}
    title="Graduation Queue"
  >
    <Typography
      component="h1"
      gutterBottom
      variant="h3"
    >
      {`GRADUATION QUEUE ${form_title}`}     
    </Typography>
    { isLoading  &&
      <LinearProgress/>
    }  
    <Divider /> 
    <br/>     
    <Grid container spacing={1} justify="center">            
      <Grid item  xs={1} >  
        <Sidebar/>
      </Grid> 
      <Grid item xs={11}> 
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
