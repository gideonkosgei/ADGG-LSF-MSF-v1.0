import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Typography,LinearProgress, Grid,Divider,colors,Link} from '@material-ui/core';
import {getExitList}   from '../../../../../../utils/API';
import {endpoint_exit_list} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,id) => {     
        await  getExitList(endpoint,id)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload[0]);  
            setIsLoading(false);                  
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
      { name: "disposal_date",label: "Exit Date",options: {filter: false,sort: true,display:true}}, 
      { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true,display:true}}, 
      { name: "tag_id",label: "Tag",options: {filter: true,sort: true,display:true}}, 
      { name: "name",label: "Name",options: {filter: true,sort: true,display:true}},
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
   },
   textLabels: {
    body: {
        noMatch: isLoading ? 'Loading...':'Sorry, there is no matching records to display',
      },
    }
  };

  return (
    <Page
      className={classes.root}
      title="Exit Report"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
       AGGREGATED EXIT RECORDS
      </Typography>
      { isLoading  &&
        <LinearProgress/>
      }  
      <Divider />  
      <br/>   
      <Grid container spacing={1} justify="center">            
         
         <Grid item xs={12}>
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
