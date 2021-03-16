import React, {useState,useEffect,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Modal,Card, CardContent,Box,Switch,Typography, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,getBatchValidationErrors,getParametersLimitAll,weightBatchModifyRevalidate}  from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_batch_errors,endpoint_parameter_limit_all,endpoint_weightRevalidate} from '../../../../../../../../configs/endpoints';
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
  const [ { organization_id,user_id }  ] = useContext(authContext); 
  const [output, setOutput] = useState({status:null, message:""}); 
  const batch_type = 2; // weight batch
  const [body_scores, setBodyScores] = useState([]);

  useEffect(() => {     
    let mounted = true;
    let mounted_limit_parameters = true;
    let mounted_lookup = true;
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
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            let lookup_body_scores = [];
            for (let i = 0; i< data.length; i++){              
              //Body Score
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              } 
            }             
            setBodyScores(lookup_body_scores);
          }
        });
      })(endpoint_lookup,'71');

     

    return () => {
      mounted = false;
      mounted_limit_parameters = false;
      mounted_lookup = false;  
                  
    };
  }, [record_id,organization_id]);

  if (!errors || !limitParameters ||!body_scores) {
    return null;
  } 

  console.log(body_scores);

  // validate weight
  let mature_weight_limits = limitParameters.filter(obj=>obj.category==='mature_weight_limits');
  let mature_weight_limits_status = false;
  let mature_weight_limits_min_value = 0;
  let mature_weight_limits_max_value = 0;
  if(mature_weight_limits.length > 0){
    mature_weight_limits_status = mature_weight_limits[0].is_active_id;  
    mature_weight_limits_min_value = mature_weight_limits[0].min_value;
    mature_weight_limits_max_value = mature_weight_limits[0].max_value;    
  }

  //validate heart Girth
  let mature_heart_girth_limits = limitParameters.filter(obj=>obj.category==='mature_heart_girth_limits');
  let mature_heart_girth_limits_status = false;
  let mature_heart_girth_limits_min_value = 0;
  let mature_heart_girth_limits_max_value = 0;
  if(mature_heart_girth_limits.length > 0){
    mature_heart_girth_limits_status = mature_heart_girth_limits[0].is_active_id;  
    mature_heart_girth_limits_min_value = mature_heart_girth_limits[0].min_value;
    mature_heart_girth_limits_max_value = mature_heart_girth_limits[0].max_value;    
  }

  //validate body length
  let mature_body_length_limits = limitParameters.filter(obj=>obj.category==='mature_body_length');
  let mature_body_length_limits_status = false;
  let mature_body_length_limits_min_value = 0;
  let mature_body_length_limits_max_value = 0;
  if(mature_body_length_limits.length > 0){
    mature_body_length_limits_status = mature_body_length_limits[0].is_active_id;  
    mature_body_length_limits_min_value = mature_body_length_limits[0].min_value;
    mature_body_length_limits_max_value = mature_body_length_limits[0].max_value;    
  }


  
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
      await  weightBatchModifyRevalidate(endpoint,values,record_id,user_id,batch_type)
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
    })(endpoint_weightRevalidate,values,record_id,user_id,batch_type);    
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
          <CardHeader title= "Weight & Growth Record"/>
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
             
            <PerfectScrollbar>
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
                      required
                      onChange = {handleChange}                     
                      margin = 'dense'
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
                        disabled: true ,                        
                             
                      }}
                      onChange = {handleChange}                      
                      margin = 'dense'
                      label="Tag ID"
                      name = 'tag_id'
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
                        disabled: true ,                        
                             
                      }}   
                      onChange = {handleChange}                   
                      margin = 'dense'
                      label="Animal Name"
                      name = "animal_name"
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
                      type = "date"
                      required
                      onChange = {handleChange}                     
                      margin = 'dense'
                      label="Weight Date"                      
                      name="weight_date"  
                      value = {values.weight_date}  
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),
                      min: (mature_body_length_limits_status)? mature_body_length_limits_min_value : "any",
                      max: (mature_body_length_limits_status)? mature_body_length_limits_max_value : "any",
                      step: "any"  
                    }} 
                    onChange = {handleChange}
                    //required
                    margin = 'dense'
                    label="Body Length (cm)"
                    name="body_length"
                    type="number"                    
                    variant="outlined"                     
                    value = {parseInt(values.body_length)===0 ? '':values.body_length}                                                 
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
                      min: (mature_heart_girth_limits_status)? mature_heart_girth_limits_min_value : "any",
                      max: (mature_heart_girth_limits_status)? mature_heart_girth_limits_max_value : "any",
                      step: "any" 
                    }}
                    onChange = {handleChange}
                    //required
                    margin = 'dense'
                    label="Heart Girth (cm)"
                    name="heart_girth"  
                    variant="outlined"  
                    type="number"                  
                    value = {parseInt(values.heart_girth)===0 ? '':values.heart_girth}   
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
                        min: (mature_weight_limits_status)? mature_weight_limits_min_value : "any",
                        max: (mature_weight_limits_status)? mature_weight_limits_max_value : "any",
                        step: "any" 
                      }} 
                       onChange = {handleChange}                    
                       margin = 'dense'
                       label="Weight (kg)"
                       name="body_weight"
                       variant="outlined"  
                       type="number"
                       value = {parseInt(values.body_weight)===0 ? '':values.body_weight}       
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
                    onChange = {handleChange}
                    margin = 'dense'
                    label="Body Score"
                    name="body_score"
                    value = {values.body_score}                 
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {body_scores.map(score => (
                          <option                    
                            value={score.id}
                          >
                            {score.id}
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

                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}

                    onChange = {handleChange}

                    margin = 'dense'
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
                    onChange = {handleChange}
                    margin = 'dense'
                    name = "created_date"
                    label = 'Created Date'                                                      
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
                    onChange = {handleChange}

                    margin = 'dense'
                    name = "created_time"
                    label="Time Created"                                     
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
        </PerfectScrollbar>
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
