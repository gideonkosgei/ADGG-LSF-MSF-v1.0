import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, Grid,Divider,LinearProgress, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updatePd,getPdByEventId,getAgents}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_pd_update,endpoint_pd_specific,endpoint_agent} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventPdMetaData}  from '../../../Modal';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  inner: {
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
  }
}));

const Edit = props => { 
  const classes = useStyles();
  localStorage.setItem('pd_event_id', parseInt(props.match.params.id)); 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id} ] = useContext(authContext); 
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);
  const [pd_methods, setPdMethods] = useState([]);
  const [pd_stages, setPdStages] = useState([]);
  const [pd_results, setPdResults] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);  
  const event_id  = localStorage.getItem('pd_event_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');
  const [agents, setAgents] = useState([]);
  const option  =  0;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_pd = true;  
    let mounted_agents = true;

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
            let lookup_pd_methods = [];
            let lookup_pd_results = [];
            let lookup_pd_stages = [];


            for (let i = 0; i< data.length; i++){              
              //Body Score
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              } 

              //PD methods
              if(data[i].list_type_id === 80){                
                lookup_pd_methods.push(data[i]);
              }  
              //PD results
              if(data[i].list_type_id === 78){                
                lookup_pd_results.push(data[i]);
              } 

              //PD stages
              if(data[i].list_type_id === 79){                
                lookup_pd_stages.push(data[i]);
              }               
            }  
                   
            setBodyScores(lookup_body_scores);
            setPdMethods(lookup_pd_methods);
            setPdResults(lookup_pd_results);
            setPdStages(lookup_pd_stages);            
          }
        });
      })(endpoint_lookup,'71,80,78,79');

      (async  (endpoint,id) => {             
        await  getPdByEventId(endpoint,id)
        .then(response => {       
          if (mounted_pd) { 
            const data = response.payload[0][0];                                   
            setValues(data);   
            setIsLoading(false);                       
          }
        });
      })(endpoint_pd_specific,event_id);
      

      
    return () => {
      mounted_lookup = false;  
      mounted_pd = false;   
      mounted_agents = false;  
    };
  }, [event_id,organization_id]);  

  if (!body_scores || !pd_methods || !pd_stages ||!pd_results ||!values || !agents) {
    return null;
  }

    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  
  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,id,values,user_id) => {     
      await  updatePd(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_pd_update,event_id,values,user_id);    
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
    <Page
      className={classes.root}
      title="PD"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       { readOnly ? `PREGNANCY DIAGNOSIS - ${animal_name}(${animal_tag})` :`EDIT PREGNANCY DIAGNOSIS - ${animal_name}(${animal_tag})`} 
      </Typography>
      <br/>         
      <Header />
      <br/>
      { isLoading  &&
        <LinearProgress/>
      } 
      
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
                        disabled: Boolean(readOnly),
                        max: moment(new Date()).format('YYYY-MM-DD')               
                      }}
                      required
                      
                      label="Examination Date"
                      type="date"
                      name="exam_date"                      
                      onChange={handleChange}
                      variant="outlined"
                      value = {values.exam_date}
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
                      
                      label="Examination Time"
                      type="time"
                      name="exam_time"                      
                      onChange={handleChange}
                      variant="outlined"  
                      value = {values.exam_time}                    
                                  
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
                        max: moment(new Date()).format('YYYY-MM-DD')              
                      }}                   
                      
                      label="Service Date"
                      type="date"
                      name="service_date"                      
                      onChange={handleChange}
                      variant="outlined"
                      value = {values.service_date}
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
                    
                    label="PD Method"
                    name="pd_method"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.pd_method}
                  >
                    <option value=""></option>
                    {pd_methods.map(method => (
                          <option                    
                            value={method.id}
                          >
                            {method.value}
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
                      
                      label="PD Result"
                      name="pd_results"
                      onChange={handleChange}
                      required
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                      value = {values.pd_results}
                    >
                      <option value=""></option>
                      {pd_results.map(result => (
                            <option                    
                              value={result.id}
                            >
                              {result.value}
                            </option>
                          ))
                      }           
                    </TextField>
                  </Grid>
                  {  
                   isNaN(values.pd_results) || values.pd_results ==='' || parseInt(values.pd_results) === 2? null :        
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
                    
                    label="PD Stage"
                    name="pd_stage"
                    onChange={handleChange}                                                
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.pd_stage}
                  >
                    <option value=""></option>
                    {pd_stages.map(stage => (
                          <option                    
                            value={stage.id}
                          >
                            {stage.value}
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
                    
                    label="Body Score"
                    name="body_score"
                    onChange={handleChange}
                    //required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.body_score}
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    //required
                    
                    label="Cost"
                    name="cost"                                   
                    onChange={handleChange}
                    type="number"
                    variant="outlined"   
                    value = {values.cost}                                              
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
                    
                    label="PD Admin"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.field_agent_id} default = ""                              
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
        <EventPdMetaData
                pdDetails={values}
                onClose={handleMetadataClose}
                open={openMetadata}
        /> 
          </Card>
          </Grid>
          </Grid>       
    </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
