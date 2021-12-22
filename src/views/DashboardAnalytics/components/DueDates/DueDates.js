import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, LinearProgress,CardHeader, Divider } from '@material-ui/core';
import {endpoint_due_date} from '../../../../configs/endpoints';
import {getDueDateTable}   from '../../../../utils/API';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../../../theme';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../contexts/AuthContext';
import { Page } from 'components';

import { GenericMoreButton } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
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

const DueDates = props => {
  const { className,option, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [ {organization_id}  ] = useContext(authContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,org,option)=>{     
      await  getDueDateTable(endpoint,org,option)
       .then(response => {              
         if (mounted) {
          setValues(response.payload);  
          setLoading(false);                          
         }
       });
     })(endpoint_due_date,organization_id,option);
    return () => {
      mounted = false;
    };
  }, [organization_id,option]);

  if (!values) {
    return null;
  }

  const columns = [
    { name: "animal_id",label: "Animal ID",options: {filter: false,sort: true,display:false}},  
    { name: "tag_id",label: "Tag ID",options: {filter: false,sort: true,display:true}},  
    { name: "animal_name",label: "Name",options: {filter: false,sort: true,display:true}},
    { name: "service_date",label: "Service Date",options: {filter: false,sort: true,display:true}},
    { name: "pd_date",label: "PD Date",options: {filter: false,sort: true,display:true}},   
    { name: "estimated_due_date",label: "Calving Date",options: {filter: false,sort: true,display:true}}           
  ];  
  //["standard","vertical","verticalAlways","simple"].

  const options = {  
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'standard',                
    rowHover: true, 
    search: true,
    filter: false,  
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
        action={<GenericMoreButton />}
        title="CALVING ACTION LIST"
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
DueDates.propTypes = {
  className: PropTypes.string
};
export default DueDates;
