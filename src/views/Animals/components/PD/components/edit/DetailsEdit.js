import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,postPd,getPdByEventId}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_pd_add,endpoint_pd_specific} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventHealthMetaData}  from '../../../Modal';


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
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);
  const [pd_methods, setPdMethods] = useState([]);
  const [pd_stages, setPdStages] = useState([]);
  const [pd_results, setPdResults] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const animal_id  = localStorage.getItem('animal_id');
  const event_id  = localStorage.getItem('pd_event_id'); 


  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_pd = true;  
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
            console.log(data);                    
            setValues(data);                         
          }
        });
      })(endpoint_pd_specific,event_id);
      

      
    return () => {
      mounted_lookup = false;  
      mounted_pd = false;    
    };
  }, [event_id]);  

  if (!body_scores || !pd_methods || !pd_stages ||!pd_results ||!values) {
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
      await  postPd(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_pd_add,animal_id,values,user_id);    
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
      
        <CardHeader title= { readOnly ? `View PD Event Record  #${localStorage.getItem('animal_id')}`:`Edit PD Event Record  #${localStorage.getItem('animal_id')}` } />
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
                      required
                      margin = 'dense'
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
                      required
                      margin = 'dense'
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
                        disabled: Boolean(readOnly)                
                      }}
                      required
                      margin = 'dense'
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
                    margin = 'dense'
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
                      margin = 'dense'
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
                    margin = 'dense'
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
                            {score.value}
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
                    margin = 'dense'
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
                    margin = 'dense'
                    label="Field Agent"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.field_agent_id}
                    
                />
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
        <EventHealthMetaData
                healthDetails={values}
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