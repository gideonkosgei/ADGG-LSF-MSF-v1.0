import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab,CircularProgress, Grid,Divider, TextField,colors,Button,CardActions,Box ,Typography,Switch} from '@material-ui/core';
import {getLookups,postPd,getAgents,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_pd_add,endpoint_agent,endpoint_dp_validations} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import {EventValidation}  from '../../../ValidationMessages';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';

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
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const Edit = props => { 
  const [ {user_id,organization_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);
  const [pd_methods, setPdMethods] = useState([]);
  const [pd_stages, setPdStages] = useState([]);
  const [pd_results, setPdResults] = useState([]);
  const [agents, setAgents] = useState([]);
  const [validations, setValidations] = useState([]); 
  const [override, setOverride] = useState(false);
  const option  =  0;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  }); 
  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_agents = true;
    let mounted_validations = true; 

  /**
   * Check event pd validations
   * Animal should be cow or heifer    
   */
  (async  (endpoint,desc,option,id) => {      
    await  genericFunctionFourParameters(endpoint,desc,option,id)
    .then(response => {       
      if (mounted_validations) {
        setValidations(response.payload);  
      }
    });
  })(endpoint_dp_validations,'event-pd-validation',3,animal_id);

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
      
    return () => {
      mounted_lookup = false;  
      mounted_agents = false; 
      mounted_validations = false;      
    };
  }, [organization_id,animal_id]);  

  if (!body_scores || !pd_methods || !pd_stages ||!pd_results || !agents || !validations) { 
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

    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async  (endpoint,id,values,user_id) => {     
      await  postPd(endpoint,id,values,user_id)
       .then((response) => {  

        setOutput({status:null, message:''});
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          if (parseInt(response.status) === 1){ 
            setValues({});        
            document.forms["event"].reset(); 
            setOutput({status:parseInt(response.status), message:response.message}) 
          } else {
            setOutput({status:parseInt(response.status), message:response.message})
          }         
        }, 500);
        
      }).catch((error) => {        
        setOutput({status:0, message:error.message})  
        setSuccess(false);
        setLoading(false);  
      });      
    })(endpoint_pd_add,animal_id,values,user_id);    
  };  
 

  const handleSwitchChange = event => {
    event.persist();
    setOverride(!override);   
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
       {`NEW PREGNANCY DIAGNOSIS RECORD - ${animal_name}(${animal_tag}) `}
      </Typography>
      <br/>   
      <Header />
      <br/>
      {
        (parseInt(validations.length) === 0 || override) ?
        <>          
          <Grid container spacing={1} justify="center">            
            <Grid item  xs={1} >  
              <Sidebar/>
            </Grid> 
            <Grid item xs={11}>
              <Card> 
              <form id ='event' onSubmit={handleSubmit} >
                <CardContent>  
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
                          max: moment(new Date()).format('YYYY-MM-DD')                 
                        }}
                        required
                        
                        label="Examination Date"
                        type="date"
                        name="exam_date"                      
                        onChange={handleChange}
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
                        
                        label="Examination Time"
                        type="time"
                        name="exam_time"                      
                        onChange={handleChange}
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
                          max: moment(new Date()).format('YYYY-MM-DD')                 
                        }}                      
                        
                        label="Service Date"
                        type="date"
                        name="service_date"                      
                        onChange={handleChange}
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
                      
                      label="PD Method"
                      name="pd_method"
                      onChange={handleChange}
                      required
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
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
                        
                        label="PD Result"
                        name="pd_results"
                        onChange={handleChange}
                        required
                        default = ""                              
                        select
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps={{ native: true }}                    
                        variant="outlined"
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
                      
                      label="PD Stage"
                      name="pd_stage"
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
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
                      
                      label="Body Score"
                      name="body_score"
                      onChange={handleChange}
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
                      //required
                      
                      label="Cost"
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
                      
                      label="PD Admin"
                      name="field_agent_id"                
                      onChange={handleChange}
                      default = ""                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
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
            <div className={classes.wrapper}>
                <Fab
                  aria-label="save"
                  color="primary"
                  className={buttonClassname}
                >
                  {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
              </div>
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={buttonClassname}
                  disabled={loading}                
                  type="submit"
                >
                  Save Changes
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>  
          </CardActions> 
          </form>         
            </Card>
            </Grid>
          </Grid>
        </>              
        : <EventValidation validations = {validations}/>
      } 
      <Grid container spacing={1} justify="center">            
        <Grid item  xs={12} > 
          { parseInt(validations.length) === 0 || override  ? null :
          <>          
          <Box> 
            <Typography variant="h6"> Override Validations </Typography> 
          </Box> 
          <Box> 
            <Switch             
              className={classes.toggle}   
              color="secondary"
              edge="start"               
              onChange={handleSwitchChange}
            />             
         </Box>
        </> 
        }
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
