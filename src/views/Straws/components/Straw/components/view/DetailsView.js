import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link} from '@material-ui/core';
import {getStraws}   from '../../../../../../utils/API';
import {endpoint_straw} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CustomToolbar from "../CustomToolbar";
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
  const option  =  0;
  const is_active = localStorage.getItem('straw_records_view_status');  
  const form_title = (parseInt(is_active) === 0) ? '(Deleted/Archived)' : ''

 

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,org_id,option,is_active) => {     
        await  getStraws(endpoint,org_id,option,is_active)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);                 
          }
        });
      })(endpoint_straw,organization_id,option,is_active); 
      
    return () => {
      mounted = false;
           
    };
  }, [organization_id,is_active]); 

  if (!values) {
    return null;
  }   
 
    const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "straw_id",label: "Straw ID",options: {filter: false,sort: true,display:true}},
    { name: "batch_number",label: "Batch",options: {filter: false,sort: true,display:true}},  
    { name: "barcode",label: "Barcode",options: {filter:true,sort: true,display:true}}, 
    { name: "semen_source",label: "Source",options: {filter: true,sort: false,display:true}},   
    { name: "production_date",label: "Prod Date",options: {filter: false,sort: false,display:true}}, 
    { name: "specification",label: "Specification",options: {filter: false,sort: false,display:true}},
    { name: "bull_tag_id",label: "Bull Tag",options: {filter: false,sort: false,display:true}},
    { name: "breed",label: "Breed",options: {filter: false,sort: false,display:true}},
    { name: "breed_composition",label: "Breed Comp",options: {filter: false,sort: false,display:true}},
    
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/straws/edit/${tableMeta.rowData[0]}`}              
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
        <CardHeader title= {`AI STRAWS ${form_title}`} />
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
                          title = {`AI STRAWS ${form_title}`}
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