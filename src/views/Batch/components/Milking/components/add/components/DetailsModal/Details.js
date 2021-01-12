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
  let animal_id = "";
  let animal_name = ""; 

  let amount_afternoon = ""; 
  let amount_morning = ""; 
  let amount_noon = ""; 
  let days_in_milk = ""; 
  let lactation_id = ""; 
  let lactation_number = ""; 
  let milk_date = ""; 
  let test_day_no = ""; 
 
  if (typeof values != 'undefined'){ 
     animal_id = values.animal_id;
     created_by = values.created_by;
     created_date = values.created_date;
     created_time = values.created_time;
     tag_id = values.tag_id;
     animal_name = values.animal_name; 

     amount_afternoon = values.amount_afternoon; 
     amount_morning = values.amount_morning; 
     amount_noon = values.amount_noon; 
     days_in_milk = values.days_in_milk; 
     lactation_id = values.lactation_id; 
     lactation_number = values.lactation_number; 
     milk_date = values.milk_date; 
     test_day_no = values.test_day_no; 
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
          <CardHeader title= "SYNCHRONIZATION RECORD"/>
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
                      label="Milk Date" 
                      value = {milk_date}  
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
                    label="Lactation ID" 
                    variant="outlined"  
                    value = {lactation_id}                        
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
                    label="Lactation Number"
                    variant="outlined"                                      
                    value = {lactation_number}   
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
                       label="Amount Morning"                      
                       variant="outlined"                                       
                       value = {amount_morning}     
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
                    label="Amount Noon"                                   
                    value = {amount_noon}                                        
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
                    label="Amount Afternoon"                                   
                    value = {amount_afternoon}                                        
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
                    label="Days In Milk"                                   
                    value = {days_in_milk}                                        
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
                    label="Test Day No"                                   
                    value = {test_day_no}                                        
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
