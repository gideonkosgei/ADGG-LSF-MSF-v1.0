import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Link} from '@material-ui/core';
import {getExitList}   from '../../../../../../utils/API';
import {endpoint_exit_list} from '../../../../../../configs/endpoints';
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
      (async  (endpoint,id) => {     
        await  getExitList(endpoint,id)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);                 
          }
        });
      })(endpoint_exit_list,organization_id); 
      
    return () => {
      mounted = false;           
    };
  }, [organization_id]); 

  if (!values) {
    return null;
  }  
  
 
    const columns = [
      { name: "event_id",label: "Event ID",options: {filter: false,sort: false,display:false}},
      { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true,display:true}}, 
      { name: "tag_id",label: "Tag",options: {filter: true,sort: true,display:true}}, 
      { name: "name",label: "Name",options: {filter: true,sort: true,display:true}},     
      { name: "disposal_date",label: "Exit Date",options: {filter: false,sort: true,display:true}},      
      { name: "disposal_reason",label: "Exit Reason",options: {filter: false,sort: true,display:true}},    
      { name: "disposal_reason_other",label: "Other Exit Reason",options: {filter: true,sort: true, display:true}},    
      { name: "disposal_amount",label: "Disposal Amount",options: {filter: true,sort: true,display:true}},    
        
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}             
              to = {`/management/exit-list/details/${tableMeta.rowData[0]}`}              
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
        <CardHeader title="EXIT REPORT" />
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
                          title = "AGGREGATED EXIT RECORDS"
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