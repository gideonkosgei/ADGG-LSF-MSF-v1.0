import React, {useState,useEffect,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Modal,Card,Box,Switch,Typography,CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getBatchValidationErrors,getParametersLimitAll,getParametersLocalSettingsOrgAll,milkBatchModifyRevalidate}  from '../../../../../../../../utils/API';
import {endpoint_batch_errors,endpoint_parameter_limit_all,endpoint_parameter_local_settings_org_all,endpoint_milkRevalidate} from '../../../../../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';
import authContext from '../../../../../../../../contexts/AuthContext';
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '60%',
    maxHeight: '80%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  details: {
    color: 'green'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

  const Details = props => {
  const { open, onClose, className,record_id,data, ...rest } = props;
  const classes = useStyles(); 
  const [readOnly, setReadOnly] = useState(true);
  const [values, setValues] = useState({});
  const [errors, setErrors] =  useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]);
  const [localSettings, setLocalSettings] = useState([]);
  const [ { organization_id,user_id }  ] = useContext(authContext); 
  const [output, setOutput] = useState({status:null, message:""}); 
  const batch_type = 1; // milking batch


  useEffect(() => {     
    let mounted = true;
    let mounted_limit_parameters = true;
    let mounted_settings = true;
      (async  (endpoint,id,type) => {     
        await  getBatchValidationErrors(endpoint,id,type)
        .then(response => {                        
          if (mounted) {                       
            setErrors(response.payload);
          }
        });
      })(endpoint_batch_errors,record_id,batch_type);  

      (async  (endpoint) => {             
        await  getParametersLimitAll(endpoint)
        .then(response => {       
          if (mounted_limit_parameters) { 
            const data = response.payload;                       
            setBodyLimitParameters(data);                         
          }
        });
      })(endpoint_parameter_limit_all);

      (async  (endpoint,id) => {     
        await  getParametersLocalSettingsOrgAll(endpoint,id)
        .then(response => {                        
          if (mounted_settings) {            
            setLocalSettings(response.payload);                 
          }
        });
      })(endpoint_parameter_local_settings_org_all,organization_id); 

    return () => {
      mounted = false;
      mounted_limit_parameters = false;  
      mounted_settings = false;             
    };
  }, [record_id,organization_id]);

  if (!errors || !limitParameters || !localSettings) {
    return null;
  } 

// validate milk amount
let milk_amount_limits = limitParameters.filter(obj=>obj.category==='milk_amount_limits');
let milk_amount_limits_status = false;
let milk_amount_limits_min_value = 0;
let milk_amount_limits_max_value = 0;
if(milk_amount_limits.length > 0){
  milk_amount_limits_status = milk_amount_limits[0].is_active_id;  
  milk_amount_limits_min_value = milk_amount_limits[0].min_value;
  milk_amount_limits_max_value = milk_amount_limits[0].max_value;    
}


  //local settings  
  const milk_unit = localSettings.filter(obj=>obj.name==='MILK_UNIT');
  const milk_unit_value = (milk_unit.length > 0)?milk_unit[0].value : "ltrs";   
  
  let records = [];

  for (let i =0; i<data.length;i++){
    if(data[i].record_id===record_id){
      records.push(data[i]);
    }
  }
 
  if (typeof records[0] != 'undefined' && Object.keys(values).length === 0 ){ 
    setValues(records[0]);     
  }

  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
  };

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  const handleSubmit = event => {    
    event.preventDefault();
    (async  (endpoint,values,record_id,user_id,batch_type) => {     
      await  milkBatchModifyRevalidate(endpoint,values,record_id,user_id,batch_type)
      .then((response) => {        
        setOutput({status:null, message:''});
        if (parseInt(response.status) === 1){  
          setOutput({status:parseInt(response.status), message:response.message}) 
        } else {
          setOutput({status:parseInt(response.status), message:response.message})
        }        
      }).catch((error) => {        
        setOutput({status:0, message:error.message})
      });
    })(endpoint_milkRevalidate,values,record_id,user_id,batch_type);    
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >   
      <form id ='event' onSubmit={handleSubmit} >
          <CardContent> 
          <CardHeader title= "MILKING RECORD"/>
           <Divider />
           {output.status === 0 ?
              <>
              <Alert severity="error" >{output.message}</Alert>             
              </>
            :output.status === 1 ?
            <>
            <Alert severity="success" >{output.message}</Alert>           
            </>
            :null
            }
           <div className={classes.inner}>
            <br/>          
            { errors.length> 0 ?
              <Alert severity="error" > 
              {            
                errors.map(error => (
                    <>{error.error_condition} <br/></>                
                  ))              
              }
              </Alert> 
              : null
            }          
          
          <br/> 
          <Grid
                container
                spacing={4}
              > 
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
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly) 
                      }}                      
                      margin = 'dense'
                      onChange = {handleChange}
                      label="Animal ID"                      
                      name="animal_id"  
                      value = {values.animal_id}  
                      variant="outlined" 
                     
                    />
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
                      inputProps={{
                        readOnly: true,
                        disabled: true                       
                             
                      }}                      
                      margin = 'dense'
                      onChange = {handleChange}
                      label="Tag ID"
                      name = "tag_id"
                      value = {values.tag_id}  
                      variant="outlined" 
                     
                    />
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
                      inputProps={{
                        readOnly: true,
                        disabled: true                        
                             
                      }}                      
                      margin = 'dense'
                      onChange = {handleChange}
                      label="Animal Name"
                      name = 'animal_name'
                      value = {values.animal_name}  
                      variant="outlined" 
                     
                    />
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
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)                        
                             
                      }}                      
                      margin = 'dense'
                      type = "date"
                      onChange = {handleChange}
                      label="Milk Date" 
                      name = "milk_date"
                      value = {values.milk_date}  
                      variant="outlined" 
                     
                    />
                  </Grid>
                
                <Grid
                  item
                  md={3}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true                     
                    }}                    

                    inputProps={{
                      readOnly: true,
                      disabled: true  
                    }} 
                    //required
                    margin = 'dense'
                    onChange = {handleChange}
                    label="Lactation ID" 
                    variant="outlined"
                    name = "lactation_id"  
                    value = {values.lactation_id}                        
                  />
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                      
                    }}
                    //required
                    margin = 'dense'
                    onChange = {handleChange}
                    label="Lactation Number"
                    variant="outlined" 
                    name = "lactation_number"                                     
                    value = {values.lactation_number}   
                />
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
   
                       inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly),                        
                        min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                        max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                        step: "any"                                  
                       }}                      
                       margin = 'dense'
                       type = "number"
                       onChange = {handleChange}                      
                       label={`Amount Morning (${milk_unit_value})`}                    
                       variant="outlined"  
                       name = "amount_morning"                                     
                       value = {values.amount_morning}     
                  />
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

                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),
                      min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                      step: "any"              
                    }}

                    margin = 'dense'
                    type = "number"
                    onChange = {handleChange}               
                    label={`Amount Noon (${milk_unit_value})`}        
                    name = "amount_noon"                                   
                    value = {values.amount_noon}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),
                      min: (milk_amount_limits_status)? milk_amount_limits_min_value : "any",
                      max: (milk_amount_limits_status)? milk_amount_limits_max_value : "any",
                      step: "any"              
                    }}
                    type = "number"
                    margin = 'dense'
                    onChange = {handleChange}              
                    label={`Amount Afternoon (${milk_unit_value})`}  
                    name = "amount_afternoon"                                  
                    value = {values.amount_afternoon}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: true,
                      disabled: true               
                    }}

                    margin = 'dense'
                    onChange = {handleChange}
                    label="Days In Milk"
                    name = "days_in_milk"                                   
                    value = {values.days_in_milk}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    onChange = {handleChange}   
                    label="Test Day No" 
                    name = "test_day_no"                                  
                    value = {values.test_day_no}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    onChange = {handleChange}
                    label="Created By"
                    name="created_by"                   
                    value = {values.created_by}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    onChange = {handleChange}
                    label = 'Created Date'  
                    name =  "created_date"                                                   
                    value = {values.created_date}                                        
                    variant="outlined"
                  />
                   
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Time Created"   
                    name = "created_time"                                  
                    value = {values.created_time}                                        
                    variant="outlined"
                  />
                   
                </Grid>
                <Grid
                    item
                    md={3}
                    xs={12}
                  >
                  
                  <Box> 
                    <Typography variant="h6">{ values.remove? "Remove(Yes)" : "Remove(No)"} </Typography> 
                  </Box> 
                  <Box> 
                      <Switch 
                      inputProps={{
                        readOnly: Boolean(readOnly),
                        disabled: Boolean(readOnly)                
                      }}      
                        name = "remove"       
                        className={classes.toggle} 
                        onChange={handleChange}
                        checked = {(values.remove)?true:false}                        
                        color="secondary"
                        edge="start"  
                      />             
                  </Box> 
                    
                </Grid>
              </Grid>
         </div>       
          </CardContent>
          <CardActions className={classes.actions}>
          <Box flexGrow={1}>
            {readOnly ? null :                        
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden = "true"                               
              >
                Validate & Save
              </Button>              
            }                             
            </Box>
            <Box> 
                <Typography variant="h6">{ readOnly? "Enable Form" : "Disable Form"} </Typography> 
            </Box> 
            <Box> 
                <Switch             
                  className={classes.toggle} 
                  checked={values.readOnly}
                  color="secondary"
                  edge="start"               
                  onChange={handleSwitchChange}
                />             
          </Box> 
            <Button
             className={classes.saveButton}
              onClick={onClose}
              variant="contained"
            >
              Close
            </Button>   
                  
          </CardActions>  
          </form>                
      </Card>
     
    </Modal>
  );
};

Details.displayName = 'Details';

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

Details.defaultProps = {
  open: false,
  onClose: () => {}
};

export default Details;
