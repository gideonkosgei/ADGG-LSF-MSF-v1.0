import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import {endpoint_pd_action_list} from '../../../../configs/endpoints';
import {getPdActionList}   from '../../../../utils/API';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import authContext from '../../../../contexts/AuthContext';

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

const PdActionList = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [ {organization_id}  ] = useContext(authContext);

  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,org)=>{     
      await  getPdActionList(endpoint,org)
       .then(response => {              
         if (mounted) {
          setValues(response.payload);                           
         }
       });
     })(endpoint_pd_action_list,organization_id);
    return () => {
      mounted = false;
    };
  }, [organization_id]);

  if (!values) {
    return null;
  }

  const columns = [
    { name: "animal_id",label: "Animal ID",options: {filter: false,sort: true,display:false}},  
    { name: "tag_id",label: "Tag ID",options: {filter: false,sort: true,display:true}},  
    { name: "animal_name",label: "Name",options: {filter: false,sort: true,display:true}},
    { name: "insemination_date",label: "Service Date",options: {filter: true,sort: true,display:true}},
    { name: "pd_window",label: "Window",options: {filter: false,sort: true,display:true}},
    { name: "pd_due_date",label: "Due Date",options: {filter: true,sort: true,display:true}},
    { name: "days_remaining",label: "Countdown(Days)",options: {filter: false,sort: true,display:true}}           
  ];
  

  const options = {  
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'stacked',                
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
   }    
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="PREGNANCY DIAGNOSIS ACTION LIST"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <MuiThemeProvider>                
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
  );
};
PdActionList.propTypes = {
  className: PropTypes.string
};
export default PdActionList;
