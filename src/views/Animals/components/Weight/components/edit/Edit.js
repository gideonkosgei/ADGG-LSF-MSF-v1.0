import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, LinearProgress, Grid,Tooltip, TextField,colors,Button,CardActions,Box,Switch ,Typography } from '@material-ui/core';
import {getLookups,updateWeight,getWeightByEventId,getParametersLimitAll}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_weight_update,endpoint_weight_specific,endpoint_parameter_limit_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventWeightMetaData}  from '../../../Modal';
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
  localStorage.setItem('event_id', parseInt(props.match.params.id));  
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id} ] = useContext(authContext);  
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);  
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const [limitParameters, setBodyLimitParameters] = useState([]);   
  const event_id  = localStorage.getItem('event_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');  
  const is_calf = parseInt(sessionStorage.getItem('animal_type')) === 3 || parseInt(sessionStorage.getItem('animal_type')) === 4 ? true : false;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_weight = true;
    let mounted_limit_parameters = true; 

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

      (async  (endpoint,id) => {             
        await  getWeightByEventId(endpoint,id)
        .then(response => {       
          if (mounted_weight) { 
            const data = response.payload[0][0];                       
            setValues(data); 
            setIsLoading(false);                        
          }
        });
      })(endpoint_weight_specific,event_id);

      // get limit parameters for input validation
      (async  (endpoint) => {             
        await  getParametersLimitAll(endpoint)
        .then(response => {       
          if (mounted_limit_parameters) { 
            const data = response.payload;                       
            setBodyLimitParameters(data);                         
          }
        });
      })(endpoint_parameter_limit_all);

    return () => {
      mounted_lookup = false;  
      mounted_weight = false;  
      mounted_limit_parameters = false; 
    };
  }, [event_id]); 

  if (!body_scores || !values || !limitParameters) {
    return null;
  } 
  
  // validate weight
  let categ_weight = is_calf ? 'calf_weight_limits' :'mature_weight_limits'
  let weight_limits = limitParameters.filter(obj=>obj.category=== categ_weight);
  let weight_limits_status = false;
  let weight_limits_min_value = 0;
  let weight_limits_max_value = 0;
  if(weight_limits.length > 0){
    weight_limits_status = weight_limits[0].is_active_id;  
    weight_limits_min_value = weight_limits[0].min_value;
    weight_limits_max_value = weight_limits[0].max_value;    
  }

  //validate heart Girth  
  let categ_girth = is_calf ? 'calf_heart_girth_limits' :'mature_heart_girth_limits';
  let heart_girth_limits = limitParameters.filter(obj=>obj.category === categ_girth);
  let heart_girth_limits_status = false;
  let heart_girth_limits_min_value = 0;
  let heart_girth_limits_max_value = 0;
  if(heart_girth_limits.length > 0){
    heart_girth_limits_status = heart_girth_limits[0].is_active_id;  
    heart_girth_limits_min_value = heart_girth_limits[0].min_value;
    heart_girth_limits_max_value = heart_girth_limits[0].max_value;    
  }

  //validate body length
  let categ_length = is_calf ? 'calf_body_length':'mature_body_length';
  let body_length_limits = limitParameters.filter(obj=>obj.category===categ_length);
  let body_length_limits_status = false;
  let body_length_limits_min_value = 0;
  let body_length_limits_max_value = 0;
  if(body_length_limits.length > 0){
    body_length_limits_status = body_length_limits[0].is_active_id;  
    body_length_limits_min_value = body_length_limits[0].min_value;
    body_length_limits_max_value = body_length_limits[0].max_value;    
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
      await  updateWeight(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);             
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_weight_update,event_id,values,user_id);    
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
      title="Weight & Growth"
    >  
    <Typography
      component="h1"
      gutterBottom
      variant="h3"
      >
      { readOnly ? `WEIGHT & GROWTH  - ${animal_name}(${animal_tag})`:`EDIT WEIGHT & GROWTH -${animal_name}(${animal_tag})` }
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
                        disabled: Boolean(readOnly) ,                         
                        max: moment(new Date()).format('YYYY-MM-DD')     
                      }}
                      required
                     
                      label="Weight Date"
                      type="date"
                      name="event_date"  
                      value = {values.event_date}                    
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
                      shrink: true                     
                    }}                    

                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly),                      
                      min: (body_length_limits_status)? body_length_limits_min_value : "any",
                      max: (body_length_limits_status)? body_length_limits_max_value : "any",
                      step: "any"               
                    }} 
                    //required
                   
                    label="Body Length (cm)"
                    name="body_length"                                   
                    onChange={handleChange}
                    type="number"                    
                    variant="outlined"  
                    value = {values.body_length}                                                
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
                      min: (heart_girth_limits_status)? heart_girth_limits_min_value : "any",
                      max: (heart_girth_limits_status)? heart_girth_limits_max_value : "any",
                      step: "any"
                    }}

                    //required
                   
                    label="Heart Girth (cm)"
                    name="heart_girth"                
                    onChange={handleChange}
                    variant="outlined"  
                    type="number"                  
                    value = {values.heart_girth}   
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
                         min: (weight_limits_status)? weight_limits_min_value : "any",
                         max: (weight_limits_status)? weight_limits_max_value : "any",
                         step: "any"   
                         // console.log(typeof weight_limits_max_value);
                                  //console.log(typeof weight_limits_min_value);            
                       }}
                       //required
                      
                       label="Weight (kg)"
                       name="weight"                
                       onChange={handleChange}
                       variant="outlined"  
                       type="number"                  
                       value = {values.weight}     
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

                   
                    label="Body Score"
                    name="body_score"
                    onChange={handleChange}
                    value = {values.body_score} 
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
               
              </Grid>
          </CardContent>         
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
        <EventWeightMetaData
                weightDetails={values}
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
