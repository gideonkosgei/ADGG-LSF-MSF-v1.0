import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,Tooltip, TextField,colors,Button,CardActions,Box,Switch ,Typography } from '@material-ui/core';
import {getLookups,updateWeight,getWeightByEventId,getParametersLimitAll}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_weight_update,endpoint_weight_specific,endpoint_parameter_limit_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventWeightMetaData}  from '../../../Modal';

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
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const [limitParameters, setBodyLimitParameters] = useState([]);   
  const event_id  = localStorage.getItem('event_id');



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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >     
    
        <CardHeader title= { readOnly ? `View Weight & Growth Details  #${localStorage.getItem('animal_id')}`:`Edit Weight & Growth Details  #${localStorage.getItem('animal_id')}` }/>
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
                      label="Weight Date"
                      type="date"
                      name="weight_date"  
                      value = {values.weight_date}                    
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
                      min: 0,
                      max: 1000,
                      step: "any"               
                    }}                   

                    //required
                    margin = 'dense'
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
                      min: (mature_heart_girth_limits_status)? mature_heart_girth_limits_min_value : "any",
                      max: (mature_heart_girth_limits_status)? mature_heart_girth_limits_max_value : "any",
                      step: "any"
                    }}
                    //required
                    margin = 'dense'
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
                         min: (mature_weight_limits_status)? mature_weight_limits_min_value : "any",
                         max: (mature_weight_limits_status)? mature_weight_limits_max_value : "any",
                         step: "any"               
                       }}
                       //required
                       margin = 'dense'
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

                    margin = 'dense'
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
        <EventWeightMetaData
                weightDetails={values}
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
  className: PropTypes.string 
  //profile: PropTypes.object.isRequired
};
export default DetailsEdit;