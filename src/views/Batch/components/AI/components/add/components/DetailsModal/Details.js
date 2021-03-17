import React, {useState,useEffect,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Modal,Card,Box,Typography,Switch, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,getCountries,getServiceProviders,getStraws,getAgents,getBatchValidationErrors,getParametersLimitAll,aiBatchModifyRevalidate}  from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_countries,endpoint_service_provider,endpoint_agent,endpoint_straw,endpoint_batch_errors,endpoint_parameter_limit_all,endpoint_aiRevalidate} from '../../../../../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';
import authContext from '../../../../../../../../contexts/AuthContext';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '70%',
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
  const { open, onClose, className,record_id,straw_record_id,data, ...rest } = props;
  const classes = useStyles();
  const [readOnly, setReadOnly] = useState(true);
  const [values, setValues] = useState({});
  const [errors, setErrors] =  useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]); 
  const [ { organization_id,user_id }  ] = useContext(authContext); 
  const [output, setOutput] = useState({status:null, message:""}); 
  const batch_type = 5; // weight batch
  const [body_scores, setBodyScores] = useState([]);
  const [straws, setStraws] = useState([]);  
  const [bull_breeds, setBullBreeds] = useState([]);
  const [semen_types, setSemenTypes] = useState([]);
  const [breed_compositions, setBreedCompositions] = useState([]);
  const [ai_types, setAiTypes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [semen_sources, setSemenSources] = useState([]); 
  const [countries, setCountries] = useState([]);

  const [strawSemenBatch, setStrawSemenBatch] =  useState(null);  
  const [strawSemenType, setStrawSemenType] =  useState(null);
  const [strawSemenSource, setStrawSemenSource] =  useState(null);
  const [strawBullBreed, setStrawBullBreed] =  useState(null);
  const [strawBullBreedComposition, setStrawBullBreedComposition] =  useState(null);
  const [strawBullOriginCountry, setStrawBullOriginCountry] =  useState(null);

  const option_straw  =  0;
  const sp_option  =  0;
  const is_active = 1;   
  const option  =  0;
 

  useEffect(() => {     
    let mounted = true;
    let mounted_limit_parameters = true;
    let mounted_lookup = true; 
    let mounted_agents = true;
    let mounted_straw = true;
    let mounted_countries = true;
    let mounted_sp = true;

    setOutput({status:null, message:''});

    let records = [];
    for (let i =0; i<data.length;i++){
      if(data[i].record_id===record_id){
        records.push(data[i]);
      }
    }
 
    if (typeof records[0] != 'undefined'){ 
      setValues(records[0]); 
    }


      (async  (endpoint,id,type) => {     
        await  getBatchValidationErrors(endpoint,id,type)
        .then(response => {                        
          if (mounted) {                       
            setErrors(response.payload);
          }
        });
      })(endpoint_batch_errors,record_id,batch_type);  

      (async  (endpoint) => {     
        await  getCountries(endpoint)
        .then(response => {                        
          if (mounted_countries) {            
            setCountries(response.payload);                 
          }
        });
      })(endpoint_countries); 

      (async  (endpoint) => {             
        await  getParametersLimitAll(endpoint)
        .then(response => {       
          if (mounted_limit_parameters) { 
            const data = response.payload;                       
            setBodyLimitParameters(data);                         
          }
        });
      })(endpoint_parameter_limit_all);
     

      (async  (endpoint,org_id,option) => {     
        await  getServiceProviders(endpoint,org_id,option)
        .then(response => {                        
          if (mounted_sp) {            
            setSemenSources(response.payload);                 
          }
        });
      })(endpoint_service_provider,organization_id,sp_option); 

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

     
      (async  (endpoint,org_id,option,is_active) => {     
        await  getStraws(endpoint,org_id,option,is_active)
        .then(response => {                        
          if (mounted_straw) {            
            setStraws(response.payload);  

            for (let i =0 ; i<response.payload.length; i++){        
              if(response.payload[i].id=== parseInt(straw_record_id)){
                setStrawSemenBatch(response.payload[i].batch_number);
                setStrawSemenType(response.payload[i].specification_id);
                setStrawSemenSource(response.payload[i].semen_source_id);
                setStrawBullBreed(response.payload[i].breed_id);
                setStrawBullBreedComposition(response.payload[i].breed_composition_id);
                setStrawBullOriginCountry(response.payload[i].origin_country);
              }
           }

          }
        });
      })(endpoint_straw,organization_id,option_straw,is_active); 

    (async  (endpoint,org_id,option) => {     
      await  getAgents(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_agents) {            
          setAgents(response.payload);                 
        }
      });
    })(endpoint_agent,organization_id,option);
    
   
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];                        
            let lookup_body_scores = [];
            let lookup_breed_compositions = [];          
            let lookup_semen_types = [];
            let lookup_ai_types = [];
            let lookup_breed = [];         

            for (let i = 0; i< data.length; i++){              
              // body condition scores
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              } 

              //breed compositions
              if(data[i].list_type_id === 14){                
                lookup_breed_compositions.push(data[i]);
              }  


              //semen types
              if(data[i].list_type_id === 20001){                
                lookup_semen_types.push(data[i]);
              } 

              //ai Types
              if(data[i].list_type_id === 72){                
                lookup_ai_types.push(data[i]);
              } 
              
              //bull breeds
              if(data[i].list_type_id === 8){                
                lookup_breed.push(data[i]);
              }  
            }  

            setBodyScores(lookup_body_scores);
            setBreedCompositions(lookup_breed_compositions);         
            setBullBreeds(lookup_breed);
            setSemenTypes(lookup_semen_types);
            setAiTypes(lookup_ai_types);
          }
        });
      })(endpoint_lookup,'8,14,71,72,20001');
      
   
    return () => {
      mounted = false;
      mounted_limit_parameters = false;
      mounted_lookup = false;         
      mounted_agents = false;   
      mounted_straw = false; 
      mounted_countries = false; 
      mounted_sp = false;           
    };
  }, [record_id,organization_id,straw_record_id,data]);

  if (!errors || !limitParameters ||!breed_compositions || !body_scores || !semen_sources ||!bull_breeds || !semen_types || !ai_types || !agents || !straws || !countries) {
    return null;
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

    if (event.target.name ==='straw_id_id'){
      for (let i =0 ; i<straws.length; i++){        
        if(straws[i].id=== parseInt(event.target.value)){
          setStrawSemenBatch(straws[i].batch_number);
          setStrawSemenType(straws[i].specification_id);
          setStrawSemenSource(straws[i].semen_source_id);
          setStrawBullBreed(straws[i].breed_id);
          setStrawBullBreedComposition(straws[i].breed_composition_id);
          setStrawBullOriginCountry(straws[i].origin_country);
        }
     }
   }
  };


  const handleSubmit = event => {    
    event.preventDefault();
    (async  (endpoint,values,record_id,user_id,batch_type) => {     
      await  aiBatchModifyRevalidate(endpoint,values,record_id,user_id,batch_type)
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
    })(endpoint_aiRevalidate,values,record_id,user_id,batch_type);    
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
          <CardHeader title= "INSEMINATION RECORD"/>
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
                      margin = 'dense'
                      label="Animal ID"                      
                      name="animal_id" 
                      required 
                      value = {values.animal_id}  
                      variant="outlined" 
                      onChange={handleChange}
                     
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
                      margin = 'dense'
                      label="Tag ID"
                      name = "tag_id"
                      value = {values.tag_id}  
                      variant="outlined" 
                      onChange={handleChange}
                     
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
                      margin = 'dense'
                      label="Animal Name"
                      name = "animal_name"
                      value = {values.animal_name}  
                      variant="outlined" 
                      onChange={handleChange}
                     
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
                      label="Service Date"
                      required
                      value = {values.service_date}  
                      variant="outlined" 
                      name = "service_date"
                      type = "date"
                      onChange={handleChange}
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
                       label="AI Type"
                       name="ai_type_id"
                       required
                       variant="outlined" 
                       value = {values.ai_type_id}  
                       onChange={handleChange}
                       default = ""                              
                       select                   
                       SelectProps={{ native: true }}      
                    >
                      <option value=""></option>
                      {ai_types.map(ai_type => (
                            <option                    
                              value={ai_type.id}
                            >
                              {ai_type.value}
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
                      shrink: true                     
                    }}                    

                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly) 
                    }} 
                    //required
                    margin = 'dense'
                    label="Straw ID"  
                    required
                    variant="outlined"  
                    value = {values.straw_id_id} 
                    name = "straw_id_id"  
                    default = ""  
                    onChange={handleChange}                            
                    select                    
                    SelectProps={{ native: true }}                                             
                  >
                    <option value=""></option>
                    {straws.map(straw => (
                          <option                    
                            value={straw.id}
                          >
                            {straw.straw_id}
                          </option>
                        ))
                    }           
                  </TextField>
                </Grid>
                {isNaN(values.straw_id_id)  || values.straw_id_id === ''  ? null : 
                <>
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="Semen Batch"                     
                    variant="outlined" 
                    name = "batch_number"
                    value = {strawSemenBatch}   
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
                       onChange={handleChange}                
                       margin = 'dense'
                       label="Semen Type"
                       variant="outlined"
                       value = {strawSemenType}  
                       name  = "specification"                     
                       select                     
                       SelectProps={{ native: true }}                    
                       
                     >
                       <option value=""></option>
                       {semen_types.map(semen_type => (
                             <option                    
                               value={semen_type.id}
                             >
                               {semen_type.value}
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="Semen Source"                                    
                    value = {strawSemenSource}                                        
                    variant="outlined"
                    name ="semen_source" default = ""                              
                    select                   
                    SelectProps={{ native: true }}                   
                   
                  >
                    <option value=""></option>
                    {semen_sources.map(semen_source => (
                          <option                    
                            value={semen_source.id}
                          >
                            {semen_source.acronym}
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="Bull Breed"                                    
                    value = {strawBullBreed}                                        
                    variant="outlined"
                    name = "breed"default = ""                              
                    select                    
                    SelectProps={{ native: true }}  
                  >
                    <option value=""></option>
                    {bull_breeds.map(bull_breed => (
                          <option                    
                            value={bull_breed.id}
                          >
                            {bull_breed.value}
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="Breed Composition"                                    
                    value = {strawBullBreedComposition}                                        
                    variant="outlined"
                    name = "breed_composition"//required
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {breed_compositions.map(breed_composition => (
                          <option                    
                            value={breed_composition.id}
                          >
                            {breed_composition.value}
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
                    onChange={handleChange}
                    margin = 'dense'
                    label=" Bull Country Origin"                                    
                    value = {strawBullOriginCountry}                                        
                    variant="outlined"
                    name = "origin_country"select                    
                    SelectProps={{ native: true }}  
                   
                  >
                    <option value=""></option>
                    {countries.map(country => (
                          <option                    
                            value={country.id}
                          >
                            {country.name}
                          </option>
                        ))
                    }           
                  </TextField>
                  </Grid> 

                  </>
                  }
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
                    onChange={handleChange}
                    margin = 'dense'
                    name = "body_score"
                    label="Body Condition"                                    
                    value = {values.body_score}                                        
                    variant="outlined"
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}  
                  >
                    <option value=""></option>
                    {body_scores.map(body_score => (
                          <option                    
                            value={body_score.id}
                          >
                            {body_score.id}
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    onChange={handleChange}
                    margin = 'dense'
                    label="AI Cost"                                    
                    value = {values.cost}                                        
                    variant="outlined"
                    name = "cost"
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="AI Tech" 
                    required                                   
                    value = {values.ai_tech}                                        
                    variant="outlined"
                    name = "ai_tech"
                    select
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {agents.map(agent => (
                          <option                    
                            value={agent.id}
                          >
                            {agent.name}
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
                    onChange={handleChange}
                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}

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
                    onChange={handleChange}
                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label = 'Created Date'                                                      
                    value = {values.created_date}                                        
                    variant="outlined"
                    name = "created_date"
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
                    onChange={handleChange}
                    margin = 'dense'
                    label="Time Created"                                     
                    value = {values.created_time}                                        
                    variant="outlined"
                    name = "created_time"
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
