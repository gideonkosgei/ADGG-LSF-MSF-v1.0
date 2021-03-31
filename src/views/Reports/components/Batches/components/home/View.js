import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {colors,Grid,Card,CardContent,TextField,Typography} from '@material-ui/core';
import { Page } from 'components';
import {genericFunctionTwoParameters,genericFunctionSevenParameters,getBatchValidation}   from '../../../../../../utils/API';
import {endpoint_batch_types,endpoint_batch_stages,endpoint_batch_status,endpoint_batch_report_all,endpoint_batch_validation_view} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';


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
  const [rowData, setTableRowData] = useState([]);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [reportValues, setReportValues] = useState([]); 
  
  const [ {organization_id,user_id}  ] = useContext(authContext); 
  let batch_type = null;
  let batch_stage = null;
  let batch_status = null;

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

    setShowReportDetails(false);
    
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

    batch_type = null;
    batch_stage = null;
    batch_status = null;

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
    { name: "last_updated",label: "LAST UPDATED",options: {filter: false,sort: true,display:true}}            
  ];


  const columns_report = 
  parseInt(values.batch_type) === 1 ?  
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "ANIMAL ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "milk_date",label: "MILK DATE",options: {filter: true,sort: true, display:true}},
    { name: "amount_morning",label: "MORNING(ltrs)",options: {filter: true,sort: true, display:true}},
    { name: "amount_noon",label: "NOON(ltrs)",options: {filter: true,sort: true, display:true}},
    { name: "amount_afternoon",label: "AFTERNOON(ltrs)",options: {filter: true,sort: true, display:true}},
    { name: "record_status",label: "STATUS",options: {filter: true,sort: true, display:true}}   
  ] : parseInt(values.batch_type) === 2 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "weight_date",label: "Weight Date",options: {filter: true,sort: true, display:true}},
    { name: "body_length",label: "Body Length",options: {filter: true,sort: true, display:true}},
    { name: "heart_girth",label: "Heart Girth",options: {filter: true,sort: true, display:true}},
    { name: "body_weight",label: "Body Weight",options: {filter: true,sort: true, display:true}},
    { name: "body_score",label: "Body Score",options: {filter: true,sort: true, display:true}},
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}},       
  ] : parseInt(values.batch_type) === 3 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "exam_date",label: "Exam Date",options: {filter: true,sort: true, display:true}},
    { name: "pd_method",label: "PD Method",options: {filter: true,sort: true, display:true}},
    { name: "pd_result",label: "PD Results",options: {filter: true,sort: true, display:true}},
    { name: "pd_stage",label: "PD Stage",options: {filter: true,sort: true, display:true}},
    { name: "pd_cost",label: "Cost",options: {filter: true,sort: true, display:true}},
    { name: "body_condition",label: "B. Score",options: {filter: true,sort: true, display:true}},
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}
  ]:  parseInt(values.batch_type) === 4 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "exit_date",label: "Exit Date",options: {filter: true,sort: true, display:true}},
    { name: "disposal_reason",label: "Exit Reason",options: {filter: true,sort: true, display:true}},
    { name: "disposal_amount",label: "Disposal Amount",options: {filter: true,sort: true, display:true}},
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}, 
  ]: parseInt(values.batch_type) === 5 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "straw_id_id",label: "straw_id_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "service_date",label: "Service Date",options: {filter: true,sort: true, display:true}},
    { name: "ai_type",label: "AI TYPE",options: {filter: true,sort: true, display:true}},
    { name: "straw_id",label: "Straw ID",options: {filter: true,sort: true, display:true}},
    { name: "cost",label: "Cost",options: {filter: true,sort: true, display:true}},
    { name: "body_score",label: "Body Score",options: {filter: true,sort: true, display:true}},
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}
  ]: parseInt(values.batch_type) === 6 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "animal_id",label: "Animal ID",options: {filter: true,sort: true, display:true}},
    { name: "tag_id",label: "TAG ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "ANIMAL NAME",options: {filter: true,sort: true, display:true}},
    { name: "sync_date",label: "Sync Date",options: {filter: true,sort: true, display:true}},
    { name: "sync_number",label: "Sync Number",options: {filter: true,sort: true, display:true}},
    { name: "hormone_type",label: "Hormone Type",options: {filter: true,sort: true, display:true}},
    { name: "hormone_source",label: "Source",options: {filter: true,sort: true, display:true}},
    { name: "admin_name",label: "Admin",options: {filter: true,sort: true, display:true}},
    { name: "cost",label: "Cost",options: {filter: true,sort: true, display:true}},    
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}
  ]:  parseInt(values.batch_type) === 7 ?
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "calving_date",label: "Date",options: {filter: true,sort: true, display:true}},
    { name: "dam_id",label: "Dam",options: {filter: true,sort: true, display:true}},
    { name: "calf_tag_id",label: "Calf Tag",options: {filter: true,sort: true, display:true}},
    { name: "calf_name",label: "Calf Name",options: {filter: true,sort: true, display:true}},
    { name: "calf_birth_type",label: "Birth Type",options: {filter: true,sort: true, display:true}},
    { name: "calving_method",label: "Method",options: {filter: true,sort: true, display:true}},
    { name: "calving_type",label: "Calving Type",options: {filter: true,sort: true, display:true}},  
    { name: "ease_of_calving",label: "Ease of Calving",options: {filter: true,sort: true, display:true}},   
    { name: "use_of_calf",label: "Calf Use",options: {filter: true,sort: true, display:true}},       
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}
  ]:
  [      
    { name: "record_id",label: "record_id",options: {filter: false,sort: false,display:false}},
    { name: "uuid",label: "uuid",options: {filter: false,sort: false,display:false}},
    { name: "tag_id",label: "Tag ID",options: {filter: true,sort: true, display:true}},
    { name: "animal_name",label: "Name",options: {filter: true,sort: true, display:true}},
    { name: "dob",label: "DOB",options: {filter: true,sort: true, display:true}},
    { name: "animal_type",label: "Animal Type",options: {filter: true,sort: true, display:true}},
    { name: "main_breed",label: "Breed",options: {filter: true,sort: true, display:true}},
    { name: "color",label: "color",options: {filter: true,sort: true, display:true}},
    { name: "breed_composition",label: "Breed Composition",options: {filter: true,sort: true, display:true}},    
    { name: "record_status",label: "Status",options: {filter: true,sort: true, display:true}}   
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
    onRowClick: (rowData) => {  
      setShowReportDetails(true);
      setTableRowData(rowData);   
      (async  (endpoint,batch_uuid) => {     
        await  getBatchValidation(endpoint,batch_uuid)
        .then(response => { 
          if(response.payload.length>0){                       
            setReportValues(response.payload);            
          }  
        });
      })(endpoint_batch_validation_view,rowData[0]);  
    }   
  };

  const options_report = {       
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

      { showReportDetails ? 
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
            REPORT DETAILS        
          </Typography>
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
            label="BATCH TYPE"                     
            default = ""  
            variant="filled" 
            value = {rowData[1]}
          />
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
            label="BATCH STAGE"           
            variant="filled" 
            value = {rowData[2]}
          />
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
            variant="filled" 
            value = {rowData[3]}
          />
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
            label="RECORD COUNT"
            variant="filled" 
            value = {rowData[4]}
          />
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
            label="CREATED BY"             
            variant="filled" 
            value = {rowData[5]}
          />
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
            label="DATE CREATED"                       
            value = {rowData[6]} 
            variant="filled" 
          />
        </Grid>
      
        <Grid item xs={12}> 
            <Card>
              <CardContent>
                <PerfectScrollbar>    
                  <MuiThemeProvider>                
                    <MUIDataTable
                      title = ""
                      data={reportValues}
                      columns={columns_report}
                      options={options_report}
                    />
                  </MuiThemeProvider>
                </PerfectScrollbar> 
              </CardContent>
            </Card> 
          </Grid>
      </Grid>
      : null
      } 
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
