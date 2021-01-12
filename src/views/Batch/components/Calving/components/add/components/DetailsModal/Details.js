import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Modal,Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '60%',
    maxHeight: '80%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  details: {
    color: 'green'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

  const Details = props => {
  const { open, onClose, className,record_id,data, ...rest } = props;

  const classes = useStyles(); 
  
  let records = [];
  for (let i =0; i<data.length;i++){
    if(data[i].record_id===record_id){
      records.push(data[i]);
    }
  }
  
  let values = records[0];  
  let created_by = "";
  let created_date = "";
  let created_time = "";
  let tag_id = "";
  let dam_id = "";
  let animal_name = ""; 
  
  let calf_birth_type = ""; 
  let calf_body_condition = ""; 
  let calf_color = ""; 
  let calf_deformaties = ""; 
  let calf_gender = ""; 
  let calf_heart_girth = ""; 
  let calf_name = ""; 
  let calf_tag_id = ""; 
  let calf_weight = ""; 
  let calving_date = ""; 
  let calving_method = ""; 
  let calving_type = ""; 
  let ease_of_calving = ""; 
  let use_of_calf = ""; 
 
  if (typeof values != 'undefined'){ 
     dam_id = values.dam_id;
     created_by = values.created_by;
     created_date = values.created_date;
     created_time = values.created_time;
     tag_id = values.tag_id;
     animal_name = values.animal_name; 

    
    calf_birth_type = values.calf_birth_type; 
    calf_body_condition = values.calf_body_condition; 
    calf_color = values.calf_color; 
    calf_deformaties = values.calf_deformaties; 
    calf_gender = values.calf_gender; 
    calf_heart_girth = values.calf_heart_girth; 
    calf_name = values.calf_name; 
    calf_tag_id = values.calf_tag_id; 
    calf_weight = values.calf_weight; 
    calving_date = values.calving_date; 
    calving_method = values.calving_method; 
    calving_type = values.calving_type; 
    ease_of_calving = values.ease_of_calving; 
    use_of_calf = values.use_of_calf; 
  }

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >      
          <CardContent> 
          <CardHeader title= "CALVING RECORD"/>
           <Divider />
          <div className={classes.inner}>
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
                        disabled: true ,                        
                             
                      }}                      
                      margin = 'dense'
                      label="Dam ID" 
                      value = {dam_id}  
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
                        readOnly: true,
                        disabled: true ,                        
                             
                      }}                      
                      margin = 'dense'
                      label="Dam Tag ID"
                      value = {tag_id}  
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
                        readOnly: true,
                        disabled: true ,                        
                             
                      }}                      
                      margin = 'dense'
                      label="Dam Name"
                      value = {animal_name}  
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
                        readOnly: true,
                        disabled: true ,                        
                             
                      }}                      
                      margin = 'dense'
                      label="Calving Date" 
                      value = {calving_date}  
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
                      readOnly: true,
                      disabled: true   
                    }} 
                    //required
                    margin = 'dense'
                    label="Calving Method" 
                    variant="outlined"  
                    value = {calving_method}                        
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
                      readOnly: true,
                      disabled: true                      
                    }}
                    //required
                    margin = 'dense'
                    label="Calving Type"
                    variant="outlined"                                      
                    value = {calving_type}   
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
                         readOnly: true,
                         disabled: true                                    
                       }}                      
                       margin = 'dense'
                       label="Birth Type"                      
                       variant="outlined"                                       
                       value = {calf_birth_type}     
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Ease Of Calving"                                   
                    value = {ease_of_calving}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Tag ID"                                   
                    value = {calf_tag_id}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Name"                                   
                    value = {calf_name}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Sex"                                   
                    value = {calf_gender}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Color"                                   
                    value = {calf_color}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Body Score"                                   
                    value = {calf_body_condition}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Deformaties"                                   
                    value = {calf_deformaties}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Weight"                                   
                    value = {calf_weight}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Calf Heart Girth"                                   
                    value = {calf_heart_girth}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Use Of Calf"                                   
                    value = {use_of_calf}                                        
                    variant="outlined"
                    multiline
                    row = {1}
                    rowsMax = {2}
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Created By"
                    name="created_by"                   
                    value = {created_by}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label = 'Created Date'                                                      
                    value = {created_date}                                        
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
                      readOnly: true,
                      disabled: true                
                    }}

                    margin = 'dense'
                    label="Time Created"                                     
                    value = {created_time}                                        
                    variant="outlined"
                  />
                   
                </Grid>
               
               
              </Grid>
         
         

            
         


          
         </div>       
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
             className={classes.saveButton}
              onClick={onClose}
              variant="contained"
            >
              Close
            </Button>           
          </CardActions>        
      </Card>
    </Modal>
  );
};

Details.displayName = 'Details';

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

Details.defaultProps = {
  open: false,
  onClose: () => {}
};

export default Details;
