import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postCalving}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_calving_add} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';

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
  const [colors, setColors] = useState([]);
  const [deformaties, setDeformaties] = useState([]);
  const [genders, setGenders] = useState([]); 


  const [birth_types, setBirthTypes] = useState([]);
  const [calving_methods, setCalvingMethods] = useState([]);
  const [calving_types, setCalvingTypes] = useState([]);

  const [calving_ease, setCalvingEase] = useState([]);
  const [calving_status, setCalvingStatus] = useState([]);
  const [uses_of_calf, setCalfUses] = useState([]); 
  
  
  const animal_id  = localStorage.getItem('animal_id');

  useEffect(() => {   
    let mounted_lookup = true;
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];
            let lookup_colors = [];
            let lookup_deformaties = [];
            let lookup_genders = [];
            let lookup_birth_types = [];
            let lookup_calving_methods = [];
            let lookup_calving_type = [];
            let lookup_ease_of_calving = [];
            let lookup_calving_status = [];
            let lookup_use_of_calf = [];
            let lookup_body_scores = [];          


            for (let i = 0; i< data.length; i++){ 
              //birth Types
              if(data[i].list_type_id === 20){                
                lookup_birth_types.push(data[i]);
              } 
              //calving Methods
              if(data[i].list_type_id === 15){                
                lookup_calving_methods.push(data[i]);
              } 
              //Birth Types
              if(data[i].list_type_id === 16){                
                lookup_calving_type.push(data[i]);
              } 

              //Ease of Calving
              if(data[i].list_type_id === 19){                
                lookup_ease_of_calving.push(data[i]);
              } 
              //Calving Status
              if(data[i].list_type_id === 22){                
                lookup_calving_status.push(data[i]);
              } 
              //Use of calf
              if(data[i].list_type_id === 21){                
                lookup_use_of_calf.push(data[i]);
              }     
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              }   
               //colors
               if(data[i].list_type_id === 83){                
                lookup_colors.push(data[i]);
              }  

              //deformaties
              if(data[i].list_type_id === 11){                
                lookup_deformaties.push(data[i]);
              } 

              //genders
              if(data[i].list_type_id === 3){                
                lookup_genders.push(data[i]);
              }    
            
            }  

            setBodyScores(lookup_body_scores);
            setColors(lookup_colors);
            setDeformaties(lookup_deformaties);
            setGenders(lookup_genders);           
            setBirthTypes(lookup_birth_types);
            setCalvingMethods(lookup_calving_methods);
            setCalvingTypes(lookup_calving_type); 
            setCalvingEase(lookup_ease_of_calving); 
            setCalvingStatus(lookup_calving_status); 
            setCalfUses(lookup_use_of_calf);         
            
            
          }
        });
      })(endpoint_lookup,'20,15,16,19,22,21,71,83,11,3');
      
    return () => {
      mounted_lookup = false;     
    };
  }, []);  
    
    
  if (!colors  || !deformaties ||!genders || !birth_types|| !calving_methods|| !calving_types || !calving_ease || !calving_status || !uses_of_calf || !body_scores) {
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
      await  postCalving(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_calving_add,animal_id,values,user_id);    
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
      
        <CardHeader title="New Calving Details" />
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
                      required
                      margin = 'dense'
                      label = "Calving Date"
                      type = "date"
                      name = "calving_date"                      
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
                    label="Calf Tag ID"
                    name="calf_tag_id"                
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
                    margin = 'dense'
                    required
                    label="Lactation Number"
                    name="lactation_number"                
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
                    margin = 'dense'
                    label="Calf Name"
                    name="calf_name"                
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
                    margin = 'dense'
                    label="Calving Birth Type"
                    name="calving_birth_type"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {birth_types.map(birth_type => (
                          <option                    
                            value={birth_type.id}
                          >
                            {birth_type.value}
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
                    label="Calving Method"
                    name="calving_method"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {calving_methods.map(calving_method => (
                          <option                    
                            value={calving_method.id}
                          >
                            {calving_method.value}
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
                    label="Calving Type"
                    name="types_calving"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {calving_types.map(calving_type => (
                          <option                    
                            value={calving_type.id}
                          >
                            {calving_type.value}
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
                    label="Calving Type Other"
                    name="calving_type_other"                
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
                      margin = 'dense'
                      label="Ease Of Calving"
                      name="ease_of_calving"
                      onChange={handleChange}  
                      required                                              
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {calving_ease.map(ease => (
                            <option                    
                              value={ease.id}
                            >
                              {ease.value}
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
                    label="Ease Of Calving Other"
                    name="ease_of_calving_other"                
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
                      margin = 'dense'
                      label="Calving Status"
                      name="calving_status"
                      onChange={handleChange}                                                
                      select
                      required
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {calving_status.map(status => (
                            <option                    
                              value={status.id}
                            >
                              {status.value}
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
                      margin = 'dense'
                      label="Use Of Calf"
                      name="use_of_calf"
                      required
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {uses_of_calf.map(use => (
                            <option                    
                              value={use.id}
                            >
                              {use.value}
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
                    label="Other Use of Calf"
                    name="use_of_calf_other"                
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
                      margin = 'dense'
                      label="Calf Body Condition"
                      name="calf_body_condition_score"
                      onChange={handleChange}    
                      required                                            
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
                              {body_score.value}
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
                      label="Calf Color"
                      name="calf_color"
                      onChange={handleChange}                     
                      default = ""                              
                      select
                      required
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {colors.map(color => (
                            <option                    
                              value={color.id}
                            >
                              {color.value}
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
                      margin = 'dense'
                      label="Calf Deformities"
                      name="calf_deformities"
                      required
                      onChange={handleChange}                                                
                      select
                      // eslint-disable-next-line react/jsx-sort-props
                      SelectProps={{ native: true }}                    
                      variant="outlined"
                    >
                      <option value=""></option>
                      {deformaties.map(deformaty => (
                            <option                    
                              value={deformaty.id}
                            >
                              {deformaty.value}
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
                    label="Other Calf Deformaties"
                    name="other_calf_deformities"                
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
                    margin = 'dense'
                    label="Calf Gender"
                    name="calf_gender"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {genders.map(gender => (
                          <option                    
                            value={gender.id}
                          >
                            {gender.value}
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
                    label="Calf Weight(kg)"
                    name="Calf_weight"                
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
                    margin = 'dense'
                    label="Calf Heart Girth(cm)"
                    name="calf_heart_girth"                
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
                    margin = 'dense'
                    label="Field Agent"
                    name="field_agent_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    
                />
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