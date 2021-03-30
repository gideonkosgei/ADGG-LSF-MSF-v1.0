import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {colors,Grid,Card,CardContent,TextField,Typography,Link } from '@material-ui/core';
import { Page } from 'components';
import {genericFunctionTwoParameters,genericFunctionSevenParameters}   from '../../../../../../utils/API';
import {endpoint_batch_types,endpoint_batch_stages,endpoint_batch_status,endpoint_batch_report_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';


const useStyles = makeStyles(theme => ({
   root: {
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
  },
  muitable: { 
    margin: '3 auto',
  },  
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
}));

const Edit = props => { 
  const classes = useStyles(); 
  const [batchesTypes, setBatchTypes] = useState([]);
  const [batchesStages, setBatchStages] = useState([]);
  const [batchesStatus, setBatchStatus] = useState([]);
  const [values, setValues] = useState({ }); 
  const [reportTitle, setReporTitle] = useState(null);
  const [data, setData] = useState([]);
  const [ {organization_id,user_id}  ] = useContext(authContext); 

  useEffect(() => {   
    let mounted_batch_types = true;
    let mounted_batch_stages = true;  
    let mounted_batch_status = true; 
    

    (async  (endpoint,desc) => {     
      await  genericFunctionTwoParameters(endpoint,desc)
      .then(response => {                        
        if (mounted_batch_types) {            
          setBatchTypes(response.payload);                 
        }
      });
    })(endpoint_batch_types,'Batch Types');     

    (async  (endpoint,desc) => {     
      await  genericFunctionTwoParameters(endpoint,desc)
      .then(response => {                        
        if (mounted_batch_stages) {            
          setBatchStages(response.payload);                 
        }
      });
    })(endpoint_batch_stages,'Batch Stages');

    (async  (endpoint,desc) => {     
      await  genericFunctionTwoParameters(endpoint,desc)
      .then(response => {                        
        if (mounted_batch_status) {            
          setBatchStatus(response.payload); 
        }
      });
    })(endpoint_batch_status,'Batch Status');
  
    return () => {
      mounted_batch_types = false; 
      mounted_batch_stages = false;  
      mounted_batch_status = false;     
    };
  }, []); 

  if (!batchesTypes || !batchesStages || !batchesStatus ) {
    return null;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value
    }); 
    
    if (event.target.name ==='batch_type'){   
      switch(parseInt(event.target.value)) {
        case 1:
          setReporTitle("MILK BATCH REPORT");
          break;
        case 2:
          setReporTitle("WEIGHT BATCH REPORT");
          break;
        case 3:
          setReporTitle("PREGNANCY BATCH REPORT");
          break;
        case 4:
          setReporTitle("EXIT & DISPOSAL BATCH REPORT");
          break;
        case 5:
          setReporTitle("AI BATCH REPORT");
          break;
        case 6:
          setReporTitle("SYNCHRONISATION BATCH REPORT");
          break;
        case 7:
          setReporTitle("CALVING BATCH REPORT");
          break;
        case 8:
          setReporTitle("ANIMAL REGISTRATION BATCH REPORT");
          break;  
        default:
          setReporTitle(null);
      }      
    }

    let batch_type = null;
    let batch_stage = null;
    let batch_status = null;

    if (event.target.name ==='batch_type'){ 
      batch_type = parseInt(event.target.value);
    }

    if (event.target.name ==='batch_stage'){ 
      batch_type =  values.batch_type;
      batch_stage = parseInt(event.target.value);
      batch_status = null;
    }

    if (event.target.name ==='batch_status'){ 
      batch_type =  values.batch_type;
      batch_stage =  values.batch_stage;
      batch_status = parseInt(event.target.value);
    }

    (async  (endpoint,desc,org,type,stage,status,user) => {     
      await  genericFunctionSevenParameters(endpoint,desc,org,type,stage,status,user)
      .then(response => {
          setData(response.payload[0]);   
      });
    })(endpoint_batch_report_all,'Batch Types',organization_id,batch_type,batch_stage,batch_status,user_id); 

  };

  const columns = [
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}}, 
    { name: "batch_type",label: "BATCH TYPE",options: {filter: true,sort: true,display:true}}, 
    { name: "step",label: "BATCH STAGE",options: {filter: true,sort: true,display:true}}, 
    { name: "batch_status",label: "BATCH STATUS",options: {filter: true,sort: true,display:true}},   
    { name: "record_count",label: "RECORD COUNT",options: {filter: false,sort: true,display:true}},
    { name: "created_by",label: "CREATED BY",options: {filter: true,sort: true,display:true}},
    { name: "created_date",label: "DATE CREATED",options: {filter: false,sort: true,display:true}},
    { name: "last_updated",label: "LAST UPDATED",options: {filter: false,sort: true,display:true}},    
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {        
        return (
          <Link
              component={RouterLink}
              to = {`/management/milking/edit/${tableMeta.rowData[0]}`}              
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

console.log(data);
  return (
    <Page
      className={classes.root}
      title="Batch Report"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        BATCH REPORTS        
      </Typography>
      <form>
      <Grid container spacing={1}   className={classes.content}  >  
        <Grid
          item
          md={2}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}           
            margin = 'dense'
            label="BATCH TYPE"
            name="batch_type"           
            default = ""                    
            select           
            SelectProps={{ native: true }}            
            variant="filled" 
            onChange={handleChange}           
          >
            <option value=""></option>
            {batchesTypes.map(types => (
                  <option                    
                    value={types.id}
                  >
                    {types.name}
                  </option>
              ))
            }    
                     
          </TextField>
        </Grid>
        <Grid
          item
          md={3}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}           
            margin = 'dense'
            label="BATCH STAGE"
            name="batch_stage"           
            default = ""                         
            select           
            SelectProps={{ native: true }}            
            variant="filled"  
            onChange={handleChange}            
          >
            <option value=""></option>
            {batchesStages.map(types => (
                  <option                    
                    value={types.id}
                  >
                    {types.name}
                  </option>
              ))
            } 

            
                     
          </TextField>
        </Grid>
        <Grid
          item
          md={2}
          xs={12}
        >
          <TextField
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}           
            margin = 'dense'
            label="BATCH STATUS"
            name="batch_status"           
            default = ""                       
            select           
            SelectProps={{ native: true }}            
            variant="filled"  
            onChange={handleChange}            
          >
            <option value=""></option>
            {batchesStatus.map(types => (
                  <option                    
                    value={types.id}
                  >
                    {types.name}
                  </option>
              ))
            }      
          </TextField>
        </Grid>   
        </Grid>
      </form>
      <Grid container spacing={1}   className={classes.content}  >  
        <Grid
          item     
          xs={12}
        >
          <Typography
            component="h1"
            gutterBottom
            variant="h4"
          >
            {reportTitle}        
          </Typography>
        </Grid>
      </Grid> 
      { 
      !values.batch_type ? null:
        <Grid container  justify="center">  
          <Grid item xs={12}> 
            <Card>
              <CardContent>
                <PerfectScrollbar>    
                  <MuiThemeProvider>                
                    <MUIDataTable
                      title = ""
                      data={data}
                      columns={columns}
                      options={options}
                    />
                  </MuiThemeProvider>
                </PerfectScrollbar> 
              </CardContent>
            </Card> 
          </Grid>
        </Grid> 
      } 
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
