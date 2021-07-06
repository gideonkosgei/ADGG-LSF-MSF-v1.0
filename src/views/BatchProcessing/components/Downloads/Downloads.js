import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Typography, Grid,colors} from '@material-ui/core';
import {Link} from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  placeholder: {
    height: 240,
    backgroundColor: colors.blueGrey[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insertDriveFileIcon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    fontSize: theme.spacing(6)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  actions: {
    justifyContent: 'center'
  },

  menu: {
    width: 250,
    maxWidth: '100%'
  }
}));

const Downloads = props => {
  const {className, ...rest } = props;  
  const classes = useStyles(); 

 
 

  useEffect(() => {     
    return () => {            
    };
  }, []);
 
  const data = [
    [1,"Data Template", "Milking Data Template", "Milking Data Template", "templates/template-milking.csv"],
    [2,"Data Template", "Weight & growth Data Template", "Weight & growth Data Template", "templates/template-weight-and-growth.csv"],
    [3,"Data Template", "Calving Data Template", "Calving Data Template", "templates/template-calving.csv"],
    [4,"Data Template", "Pregnancy Diagnosis Data Template", "Pregnancy Diagnosis Data Template", "templates/template-pregnancy-diagnosis.csv"],
    [5,"Data Template", "Exit & Disposal Data Template", "Exit & Disposal Data Template", "templates/template-exit-and-disposal.csv"],
    [6,"Data Template", "Insemination Data Template", "Insemination Data Template", "templates/template-insemination.csv"],
    [7,"Data Template", "Synchronization Data Template", "Synchronization Data Template", "templates/template-synchronization.csv"],
    [8,"Data Template", "Pedigree Data Template", "Animal Registration Data Template", "templates/template-animal-registration.csv"] 
   ];

  const columns = [
    { name: "#",label: "#",options: {filter: false,sort: false,display:true}}, 
    { name: "event_date",label: "FILE TYPE",options: {filter: false,sort: true,display:true}},
    { name: "Event_ID",label: "FILE NAME",options: {filter: false,sort: false,display:true}}, 
    { name: "event_date",label: "FILE DESCRIPTION",options: {filter: false,sort: true,display:true}}, 
    { name: "file",label: "file",options: {filter: false,sort: false,display:false}},  
    { name: "DOWNLOAD LINK",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          
          <Link                         
              to = {`${tableMeta.rowData[4]}`}  
              target="_blank" download              
          >
            <GetAppIcon />
          </Link>          
        );
      }
    }
  }    
  ];   
const options = {       
  filter: true,
  rowsPerPage: 20,       
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
      title="Downloads"
    >
       <Typography
        component="h1"
        gutterBottom
        variant="h4"
      >
        BATCH DATA TEMPLATES
       
      </Typography>
     
      <Typography variant="h6">Important Notes</Typography>
      <Typography variant="body2">
        1. Click the download icon to download a data Template.<br/>
        2. The data template is format specific. Therefore, do not rename or re-arrange columns. <br/>
        3. Do not remove the column header.<br/>
        4. Do not merge cells or apply styling, use as is.<br/>
      </Typography>
      <br/>
     
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent> 
        <Grid container spacing={1} justify="center"> 
          <Grid item xs={12}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <MuiThemeProvider>                
                  <MUIDataTable
                    title = ""
                    data={data}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </div>
            </PerfectScrollbar>
          </Grid>        
        </Grid>
      </CardContent> 
    </Card>
  </Page>
  );
};

Downloads.propTypes = {
  className: PropTypes.string  
};
export default Downloads;