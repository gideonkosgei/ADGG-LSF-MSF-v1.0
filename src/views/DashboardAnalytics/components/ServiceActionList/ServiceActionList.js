import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent,LinearProgress,CardHeader, Divider } from '@material-ui/core';
import {endpoint_service_action_list} from '../../../../configs/endpoints';
import {getServiceActionList}   from '../../../../utils/API';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../theme';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../contexts/AuthContext';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.white
  },
  actions: {
    justifyContent: 'flex-end'
  },  
}));

const ServiceActionList = props => {
  const { className,option, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [ {user_id}  ] = useContext(authContext);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,user_id,option)=>{     
      await  getServiceActionList(endpoint,user_id,option)
       .then(response => {              
         if (mounted) {
          setValues(response.payload); 
          setLoading(false);   
         }
       });
     })(endpoint_service_action_list,user_id,option);
    return () => {
      mounted = false;
    };
  }, [user_id,option]);

  if (!values) {
    return null;
  }
  const columns = [
    { name: "animal_id",label: "Animal ID",options: {filter: false,sort: true,display:false}},  
    { name: "tag_id",label: "Tag ID",options: {filter: false,sort: true,display:true}},  
    { name: "animal_name",label: "Name",options: {filter: false,sort: true,display:true}},
    { name: "birthdate",label: "DOB",options: {filter: false,sort: true,display:true}},    
    { name: "last_calving_date",label: "Last Calving",options: {filter: false,sort: true,display:true}},
    { name: "last_insemination_date",label: "Last Insemination",options: {filter: false,sort: true,display:true}}, 
    { name: "last_pd_date",label: "Last PD",options: {filter: false,sort: true,display:true}}, 
    { name: "next_service_date",label: "Next Service",options: {filter: false,sort: true,display:true}},  
    { name: "status",label: "Status",options: {filter: true,sort: true,display:true}},   
    { name: "Trigger",label: "Reason",options: {filter: false,sort: true,display:true}},
    { name: "type",label: "Reason",options: {filter: true,sort: true,display:false}}            
  ];
  

  const options = {  
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'standard',                
    rowHover: true, 
    search: true,
    filter: true,  
    print: true,
    viewColumns: false,    
    setTableProps: () => {
     return {
       padding: "none" ,         
       size: "small",
     };
   },
   textLabels: {
    body: {
        noMatch: loading ? 'Loading...':'Sorry, there is no matching records to display',
      },
    }     
  };

  return (
    <Page> 
    { loading  && <LinearProgress/>   } 
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader      
        title="SERVICE ACTION LIST"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <MuiThemeProvider theme={theme}>                
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
      <Divider /> 
    </Card> 
  </Page>     
  );
};
ServiceActionList.propTypes = {
  className: PropTypes.string
};
export default ServiceActionList;
