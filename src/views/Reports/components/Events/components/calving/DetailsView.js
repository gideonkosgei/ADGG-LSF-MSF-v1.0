import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link} from '@material-ui/core';
import {getCalving}   from '../../../../../../utils/API';
import {endpoint_calving} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
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

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id,option) => {     
        await  getCalving(endpoint,id,option)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_calving,organization_id,1); 
      
    return () => {
      mounted = false;           
    };
  }, [organization_id]); 

  if (!values) {
    return null;
  }  
  
 
    const columns = [    
    { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},  
    { name: "calving_date",label: "Calving Date",options: {filter: false,sort: true,display:true}}, 
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true,display:true}}, 
    { name: "tag_id",label: "Tag",options: {filter: true,sort: true,display:true}}, 
    { name: "animal_name",label: "Name",options: {filter: true,sort: true,display:true}}, 
    { name: "calving_date",label: "Calving Date",options: {filter: false,sort: true,display:true}}, 
    { name: "calf_tag_id",label: "C.Tag ID",options: {filter: false,sort: true,display:true}}, 
    { name: "calf_name",label: "C.Name",options: {filter: false,sort: true,display:true}},   
    { name: "calving_birth_type",label: "Birth Type",options: {filter: false,sort: true,display:true}},
    { name: "calf_body_condition_score_id",label: "C.Body Score",options: {filter: false,sort: true,display:true}},    
    { name: "calf_sex",label: "C.Gender",options: {filter: true,sort: true, display:true}},
    { name: "calf_color",label: "C.Color",options: {filter: false,sort: true,display:true}},
    { name: "calf_weight",label: "C.Weight",options: {filter: true,sort: true,display:true}},    
    { name: "calf_heart_girth",label: "Calf H. Girth",options: {filter: true,sort: true,display:true}},     
    { name: "calf_deformities",label: "Deformaties",options: {filter: true,sort: true,display:true}},

    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}             
              to = {`/management/calving/edit/${tableMeta.rowData[0]}`}              
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
        <CardHeader title="CALVING REPORT" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
         
          <Grid item xs={12}>
              <Card> 
                <CardContent>                 
                  <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = "AGGREGATED CALVING RECORDS"
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