import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updateInsemination,getInseminationEventById,getAgents,getStraws,getCountries,getServiceProviders}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_insemination_update,endpoint_insemination_specific,endpoint_agent,endpoint_straw,endpoint_countries,endpoint_service_provider} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventInseminationMetaData}  from '../../../Modal';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const DetailsEdit = props => {
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id} ] = useContext(authContext);
  const classes = useStyles();

  const [values, setValues] = useState({ });
  const [body_scores, setBodyScores] = useState([]);
  const [breed_compositions, setBreedCompositions] = useState([]);
  const [semen_sources, setSemenSources] = useState([]);
  const [bull_breeds, setBullBreeds] = useState([]);
  const [semen_types, setSemenTypes] = useState([]);
  const [ai_types, setAiTypes] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const event_id  = localStorage.getItem('insemination_event_id');   
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');  
  const [agents, setAgents] = useState([]);
  const option_agent = 0;
  const [countries, setCountries] = useState([]);
  const [straws, setStraws] = useState([]);
  const option_straw  =  0;
  const sp_option  =  0;
  const is_active = 1; 

  const [strawSemenBatch, setStrawSemenBatch] =  useState(null);  
  const [strawSemenType, setStrawSemenType] =  useState(null);
  const [strawSemenSource, setStrawSemenSource] =  useState(null);
  const [strawBullBreed, setStrawBullBreed] =  useState(null);
  const [strawBullBreedComposition, setStrawBullBreedComposition] =  useState(null);
  const [strawBullOriginCountry, setStrawBullOriginCountry] =  useState(null);
 
 
 

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_insemination = true;
    let mounted_agents = true;
    let mounted_countries = true;
    let mounted_straw = true;
    let mounted_sp = true;

    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_sp) {            
          setSemenSources(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,sp_option); 

    (async  (endpoint,org_id,option,is_active) => {     
      await  getStraws(endpoint,org_id,option,is_active)
      .then(response => {                        
        if (mounted_straw) {            
          setStraws(response.payload);                 
        }
      });
    })(endpoint_straw,organization_id,option_straw,is_active); 

    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                 
        }
      });
    })(endpoint_countries); 

    (async  (endpoint,org_id,option) => {     
      await  getAgents(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_agents) {            
          setAgents(response.payload);                 
        }
      });
    })(endpoint_agent,organization_id,option_agent); 
    
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

      (async  (endpoint,id) => {             
        await  getInseminationEventById(endpoint,id)
        .then(response => {       
          if (mounted_insemination) { 
            const data = response.payload[0][0];                       
            setValues(data);
            setStrawSemenBatch(data.semen_batch);
            setStrawSemenType(data.straw_semen_type);
            setStrawSemenSource(data.source_of_semen);
            setStrawBullBreed(data.breed_of_bull);
            setStrawBullBreedComposition(data.breed_composition);
            setStrawBullOriginCountry(data.origin_country_bull);
          }
        });
      })(endpoint_insemination_specific,event_id);
      

      
    return () => {
      mounted_lookup = false;
      mounted_insemination = false;  
      mounted_agents = false; 
      mounted_countries = false; 
      mounted_straw = false; 
      mounted_sp = false;
    };
  }, [event_id,organization_id]);   


  if (!values|| !breed_compositions || !straws || !body_scores || !semen_sources ||!bull_breeds || !semen_types || !ai_types || !agents || !countries) {
    return null;
  }


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });

    if (event.target.name ==='straw_record_id'){      
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
    (async  (endpoint,id,values,user_id) => {     
      await  updateInsemination(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_insemination_update,event_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
  };
  const handleMetadataOpen = () => {
    setMetadata(true);
  };

  const handleMetadataClose = () => {
    setMetadata(false);
  };

  


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader  title= { readOnly ? `INSEMINATION - ${animal_name}(${animal_tag})` :`EDIT INSEMINATION RECORD - ${animal_name}(${animal_tag})`} />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
            <Card> 
            <form id ='event' onSubmit={handleSubmit} >
              <CardContent>        
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
                      value = {values.service_date}
                      required
                      margin = 'dense'
                      label = "AI Service Date"
                      type = "date"
                      name = "service_date"                      
                      onChange = {handleChange}
                      variant = "outlined"
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
                    value = {values.ai_type}
                    margin = 'dense'
                    label="AI Type"
                    name="ai_type"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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
                      shrink: true,
                    }}
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    value = {values.straw_record_id}
                    required
                    margin = 'dense'
                    label="Straw ID"
                    name="straw_record_id"                
                    onChange={handleChange}
                    variant="outlined" select                    
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

               { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :    

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
                    value = {strawSemenBatch}
                    margin = 'dense'
                    label="Semen Batch"
                    name="semen_batch"                
                    onChange={handleChange}
                    variant="outlined"  
                    
                />
              </Grid>
              }

               { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :
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
                      value = {strawSemenType}                                   
                      margin = 'dense'
                      label="Straw Semen Type"
                      name="straw_semen_type"
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
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
                  }
                   { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :
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
                      value = {strawSemenSource}
                      margin = 'dense'
                      label="Semen Source"
                      name="source_of_semen"
                      onChange={handleChange}                     
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
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
                  }
                   { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :
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
                    value = {strawBullBreed}
                    margin = 'dense'
                    label="Bull Breed"
                    name="breed_of_bull"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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
                  }
                   { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :
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
                    value = {strawBullBreedComposition}
                    margin = 'dense'
                    label="Bull Breed Composition"
                    name="breed_composition"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
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
                }
                 { isNaN(values.straw_record_id) || values.straw_record_id===''   ? null :
                 
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
                    value = {strawBullOriginCountry}
                    margin = 'dense'
                    label="Bull Origin Country"
                    name="origin_country_bull"                
                    onChange={handleChange}
                    variant="outlined" 
                    select                    
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
                        value = {values.body_condition_score}
                        margin = 'dense'
                        label="Cow Body Condition"
                        name="body_condition_score"
                        onChange={handleChange}
                        //required
                        default = ""                              
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}                    
                        variant="outlined"
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
                    value = {values.cost}
                    //required
                    margin = 'dense'
                    label="AI Cost"
                    name="cost"                                   
                    onChange={handleChange}
                    type="number"
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
                    value = {values.field_agent_id}
                    required
                    margin = 'dense'
                    label="AI Tech"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined" select
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
            
              </Grid>
          </CardContent>
          <Divider />
          <CardActions>          
          <Box flexGrow={1}>
            {readOnly ? null :                        
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden = "true"                               
              >
                Save Changes
              </Button>              
            }                             
          </Box> 
          <Box>
            <Tooltip  title="view Metadata">
              <Button onClick={handleMetadataOpen}>
                <OpenInNewIcon className={classes.buttonIcon} />                
              </Button>
            </Tooltip>               
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
        </CardActions> 
        </form> 
        <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
        />
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />
        <EventInseminationMetaData
                inseminationDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
        /> 
          </Card>
          </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;