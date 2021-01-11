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
    width: '70%',
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
  let ai_type = "";
  let animal_id = 0;
  let animal_name = "";
  let barcode = "";
  let batch_number = "";  
  let body_score= "";
  let breed= "";
  let breed_composition= "";
  let bull_name= "";
  let bull_tag_id= "";
  let cost= "";
  let created_by= "";
  let created_date= "";
  let created_time= "";
  let ejaculation_number= "";
  let production_date= "";  
  let semen_source= "";
  let service_date= "";
  let specification= "";
  let straw_id= "";
  let tag_id= "";
  let origin_country= "";  
 
  if (typeof values != 'undefined'){     
    ai_type = values.ai_type;
    animal_id = values.animal_id;
    animal_name = values.animal_name;
    barcode = values.barcode;
    batch_number = values.batch_number;  
    body_score = values.body_score;
    breed = values.breed;
    breed_composition = values.breed_composition;
    bull_name = values.bull_name;
    bull_tag_id = values.bull_tag_id;
    cost = values.cost;
    created_by = values.created_by;
    created_date = values.created_date;
    created_time = values.created_time;
    ejaculation_number = values.ejaculation_number;   
    production_date = values.production_date;   
    semen_source = values.semen_source;
    service_date = values.service_date;
    specification = values.specification;
    straw_id = values.straw_id;
    tag_id = values.tag_id;  
    origin_country = values.origin_country; 
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
          <CardHeader title= "INSEMINATION RECORD"/>
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
                      label="Animal ID"                      
                      name="animal_id"  
                      value = {animal_id}  
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
                      label="Tag ID"
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
                      label="Animal Name"
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
                      label="Service Date"
                      value = {service_date}  
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
                    label="Straw ID"  
                    variant="outlined"  
                    value = {straw_id}                                                
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
                    label="Semen Batch"                     
                    variant="outlined" 
                    value = {batch_number}   
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
                       label="Semen Type"
                       name="weight"
                       variant="outlined" 
                       value = {ai_type}     
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
                       label="Semen Bar Code"
                       
                       variant="outlined"
                                      
                       value = {barcode}     
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
                       label="Semen Specification"
                       variant="outlined"
                       value = {specification}     
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
                       label="Production Date"
                       variant="outlined"
                       value = {production_date}     
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
                       label="Ejaculation Number"
                       variant="outlined"
                       value = {ejaculation_number}     
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
                    label="Semen Source"                                    
                    value = {semen_source}                                        
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
                    label="Bull Breed"                                    
                    value = {breed}                                        
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
                    label="Breed Composition"                                    
                    value = {breed_composition}                                        
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
                    label="Body Composition"                                    
                    value = {body_score}                                        
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
                    label="AI Cost"                                    
                    value = {cost}                                        
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
                    label="AI Cost"                                    
                    value = {cost}                                        
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
                    label=" Bull Name"                                    
                    value = {bull_name}                                        
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
                    label=" Bull Country Origin"                                    
                    value = {origin_country}                                        
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
                    label=" Bull Tag Id"                                    
                    value = {bull_tag_id}                                        
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
