import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Fab,CircularProgress, CardContent, LinearProgress, Grid, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,CreateOrEditHoofHealthRecord,getHoofHealth,getAgents}   from '../../../../../../../../utils/API';
import {endpoint_lookup,endpoint_hoof_health_edit,endpoint_hoof_health_get,endpoint_agent} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventMetaData}  from '../../../../../Modal';
import moment from 'moment';
import { Page } from 'components';
import {default as Header} from '../../../../../Header/index';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

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
  const classes = useStyles();
  sessionStorage.setItem('hoof_health_record_id', parseInt(props.match.params.id));   
  const [ {user_id,organization_id} ] = useContext(authContext);
  const [values, setValues] = useState({ });  
  const [digital_dermatitis_options, setDigitalDermatitis] = useState([]);
  const [hoof_health_options, setHoofHealth] = useState([]);
  const [agents, setAgents] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);  
  const record_id  = sessionStorage.getItem('hoof_health_record_id'); 
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name'); 
  const option  =  0;
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState({status:null, message:""}); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_hoof_records = true;  
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
          let lookup_digital_dermatitis = [];  
          let lookup_hoof_health = []; 

          for (let i = 0; i< data.length; i++){ 
             //Digital Dermatitis
             if(data[i].list_type_id === 95){                
              lookup_digital_dermatitis.push(data[i]);
            } 

            //Hoof Health
            if(data[i].list_type_id === 96){                
              lookup_hoof_health.push(data[i]);
            }                         
          } 
          setDigitalDermatitis(lookup_digital_dermatitis);
          setHoofHealth(lookup_hoof_health); 
        }
      });
    })(endpoint_lookup,'95,96');      

      (async  (endpoint,id,option) => {     
        await  getHoofHealth(endpoint,id,option)
        .then(response => {                        
          if (mounted_hoof_records) {            
            setValues(response.payload[0]); 
            setIsLoading(false);                   
          }
        });
      })(endpoint_hoof_health_get,record_id,2);
      

      
    return () => {
      mounted_lookup = false;  
      mounted_hoof_records = false;   
      mounted_agents = false;  
    };
  }, [record_id,organization_id]);  

  if (!values || !agents ||!digital_dermatitis_options || !hoof_health_options) {
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
      await  CreateOrEditHoofHealthRecord(endpoint,id,values,user_id)
      .then((response) => {        
        setOutput({status:null, message:''});      
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);          
          if (parseInt(response.status) === 1){               
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
    })(endpoint_hoof_health_edit,record_id,values,user_id);    
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
      title="Hoof Health"
    >
      <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
       { readOnly ? `HOOF HEALTH - ${animal_name}(${animal_tag})` :`EDIT HOOF HEALTH - ${animal_name}(${animal_tag})`}
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
                        readOnly: true,
                        disabled: true,
                        max: moment(new Date()).format('YYYY-MM-DD')               
                      }}               
                      
                      required
                      label="Examination Date"
                      type="date"
                      name="exam_date"   
                      value = {values.exam_date}                   
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
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                                   
                    }}

                    
                    label="Digital dermatitis"
                    name="digital_dermatitis"
                    value = {values.digital_dermatitis}        
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {
                      digital_dermatitis_options.map(x => (
                        <option                    
                          value={x.id}
                        >
                          {x.value}
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
                      
                      label="Interdigital Hyperplasia"
                      name="interdigital_hyperplasia"                       
                      value = {values.interdigital_hyperplasia}
                      onChange={handleChange}                     
                      default = ""                              
                      select                      
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {hoof_health_options.map(x => (
                            <option                    
                              value={x.id}
                            >
                              {x.value}
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
                    
                    label="Interdigital Phlegmon"
                    name="interdigital_phlegmon"
                    value = {values.interdigital_phlegmon}
                    onChange={handleChange}                                                
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
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
                    
                    label="Scissor claws"
                    name="scissor_claws"
                    value = {values.scissor_claws}
                    onChange={handleChange}                   
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
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
                    
                    label="Horizontal horn fissure"
                    name="horizontal_horn_fissure"
                    value = {values.horizontal_horn_fissure}
                    onChange={handleChange}                    
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
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
                    
                    label="Vertical horn fissure"
                    name="vertical_horn_fissure"
                    value = {values.vertical_horn_fissure}
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
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
                    
                    label="Swelling of coronet and/or bulb"
                    name="swelling_of_coronet"
                    value = {values.swelling_of_coronet}
                    onChange={handleChange}                   
                    default = ""                              
                    select                   
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
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
                    
                    label="Heel horn erosion"
                    name="heel_horn_erosion"
                    value = {values.heel_horn_erosion}
                    onChange={handleChange}                    
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {hoof_health_options.map(x => (
                          <option                    
                            value={x.id}
                          >
                            {x.value}
                          </option>
                        ))
                    }           
                  </TextField>
                  </Grid> 

                

                  <Grid
                  item
                  md={6}
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
                    
                    label="Other hoof problems"
                    name="other_hoof_problems"  
                    value = {values.other_hoof_problems}                                 
                    onChange={handleChange}                    
                    variant="outlined"   
                    multiline 
                    rowsMax = {5}
                    rows={1}                                               
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
                    
                    label="Examinar"
                    name="field_agent_id"  
                    value = {values.field_agent_id}                
                    onChange={handleChange}
                    default = ""                              
                    select                   
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
          <CardActions>          
         
            {readOnly ? null :                        
              <>    
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
              </>
                     
            }                             
         
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

        <EventMetaData
          Details={values}
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
