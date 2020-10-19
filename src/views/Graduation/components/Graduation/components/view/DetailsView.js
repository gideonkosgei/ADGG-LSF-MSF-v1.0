import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link} from '@material-ui/core';
import {getGraduation}   from '../../../../../../utils/API';
import {endpoint_graduation_list} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
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
  const {className, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [ {organization_id}  ] = useContext(authContext); 
  const graduation_status = sessionStorage.getItem('graduation_status');  
  const form_title = (parseInt(graduation_status) === 0) ? '(UN-PROCESSED)' : '(PROCESSED)'

 

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,org_id,is_active) => {     
        await  getGraduation(endpoint,org_id,is_active)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);                 
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title= {`GRADUATION QUEUE ${form_title}`} />
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
                          title = {`GRADUATION QUEUE ${form_title}`}
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