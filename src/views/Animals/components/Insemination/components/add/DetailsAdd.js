import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postInsemination,getAgents,getStraws,getCountries,getServiceProviders}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_insemination_add,endpoint_agent,endpoint_straw,endpoint_countries,endpoint_service_provider} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import moment from 'moment';

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
  const [agents, setAgents] = useState([]);
  const option  =  0;
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const [straws, setStraws] = useState([]);
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

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_agents = true;
    let mounted_straw = true;
    let mounted_countries = true;
    let mounted_sp = true;

    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_sp) {            
          setSemenSources(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,sp_option); 

    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                 
        }
      });
    })(endpoint_countries); 

      (async  (endpoint,org_id,option,is_active) => {     
        await  getStraws(endpoint,org_id,option,is_active)
        .then(response => {                        
          if (mounted_straw) {            
            setStraws(response.payload);                 
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
              if(data[i].list_type_id === 201){                
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
      })(endpoint_lookup,'8,14,71,72,201');
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false;   
      mounted_straw = false; 
      mounted_countries = false; 
      mounted_sp = false;         
    };
  }, [organization_id]);   


  if (!breed_compositions || !body_scores || !semen_sources ||!bull_breeds || !semen_types || !ai_types || !agents || !straws || !countries ) {
    return null;
  }


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });

    if (event.target.name ==='straw_id'){
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
      await  postInsemination(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_insemination_add,animal_id,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
       <CardHeader  title= {`NEW INSEMINATION RECORD - ${animal_name}(${animal_tag})`} /> 
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
                        max: moment(new Date()).format('YYYY-MM-DD')                 
                      }}                    
                      
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
                    margin = 'dense'
                    required
                    label="Straw ID"
                    name="straw_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    default = ""                              
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
              {
               isNaN(values.straw_id)  || values.straw_id === ''  ? null : 
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
                    label="Semen Batch"
                    name="semen_batch"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {strawSemenBatch}
                    
                />
              </Grid>
             }
             {
             isNaN(values.straw_id) || values.straw_id ===''   ? null : 
                
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

                      margin = 'dense'
                      label="Straw Semen Type"
                      name="straw_semen_type"
                      onChange={handleChange} 
                      value = {strawSemenType}                                               
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
                  {
                    isNaN(values.straw_id)  || values.straw_id === ''  ? null : 
                  
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
                      label="Semen Source"
                      name="source_of_semen"
                      onChange={handleChange}                     
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                      value = {strawSemenSource}
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
                  {
                  isNaN(values.straw_id)  || values.straw_id === ''  ? null : 
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
                    label="Bull Breed"
                    name="breed_of_bull"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {strawBullBreed}
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
                  {
                    isNaN(values.straw_id)  || values.straw_id === ''  ? null : 
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
                    label="Bull Breed Composition"
                    name="breed_composition"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {strawBullBreedComposition}
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
                   {
                     isNaN(values.straw_id)  || values.straw_id === ''  ? null : 
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
                    label="Bull Origin Country"
                    name="origin_country_bull"                
                    onChange={handleChange}
                    variant="outlined"  
                    select                    
                    SelectProps={{ native: true }}  
                    value = {strawBullOriginCountry}
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
                    margin = 'dense'
                    required
                    label="AI Tech"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined" 
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
            
              </Grid>
          </CardContent>
          <Divider />
          <CardActions>          
          <Button
            className={classes.saveButton}
            type="submit"
            variant="contained"
          >
            Save Details
          </Button>
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