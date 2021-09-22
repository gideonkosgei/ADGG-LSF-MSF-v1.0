import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,Fab, Typography, Grid,Divider,CircularProgress, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postWeight,getParametersLimitAll}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_weight_add,endpoint_parameter_limit_all} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import moment from 'moment';
import { Page } from 'components';
import {Header} from '../index';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  inner: {
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
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
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
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);
  const [limitParameters, setBodyLimitParameters] = useState([]);  
  const animal_id  = localStorage.getItem('animal_id');
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const  dob = sessionStorage.getItem('animal_dob'); 
  const is_calf = parseInt(sessionStorage.getItem('animal_type')) === 3 || parseInt(sessionStorage.getItem('animal_type')) === 4 ? true : false;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {   
    let mounted_lookup = true;
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
      mounted_limit_parameters = false;   
    };
  }, []); 

  if (!body_scores || !limitParameters) {
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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async  (endpoint,id,values,user_id) => {     
      await  postWeight(endpoint,id,values,user_id)
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
    })(endpoint_weight_add,animal_id,values,user_id);    
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
        {`NEW WEIGHT & GROWTH RECORD : ${animal_tag}`}
      </Typography>
      <br/>           
      <Header />
      <br/>
      
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
                        max: moment(new Date()).format('YYYY-MM-DD'),  
                        min : dob   
                      }}                     
                      required
                      
                      label="Weight Date"
                      type="date"
                      name="weight_date"                      
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
                        min: (body_length_limits_status)? body_length_limits_min_value : "any",
                        max: (body_length_limits_status)? body_length_limits_max_value : "any",
                        step: "any"               
                      }}                  
                      label="Body Length (cm)"
                      name="body_length"                                   
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
                        min: (heart_girth_limits_status)? heart_girth_limits_min_value : "any",
                        max: (heart_girth_limits_status)? heart_girth_limits_max_value : "any",
                        step: "any"
                      }}
                      label="Heart Girth (cm)"
                      name="heart_girth"                
                      onChange={handleChange}
                      variant="outlined"  
                      type="number" 
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
                        min: (weight_limits_status)? weight_limits_min_value : "any",
                        max: (weight_limits_status)? weight_limits_max_value : "any",
                        step: "any"               
                      }}                    
                      label="Weight (kg)"
                      name="weight"                
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
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
export default Edit;
