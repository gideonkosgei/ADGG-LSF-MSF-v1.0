import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postExit}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_exit_add} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
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
  const [exitTypes, setExitTypes] = useState([]);  
  
  const animal_id  = localStorage.getItem('animal_id');

  useEffect(() => {   
    let mounted_lookup = true;
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 

            const data = response.payload[0];                        
            let lookup_exit_types = [];                    

            for (let i = 0; i< data.length; i++){
              // exit types
              if(data[i].list_type_id === 82){                
                lookup_exit_types.push(data[i]);
              }  
            }  
            setExitTypes(lookup_exit_types);           
          }
        });
      })(endpoint_lookup,'82');
      
    return () => {
      mounted_lookup = false;     
    };
  }, []);   


  if (!exitTypes) {
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
      await  postExit(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_exit_add,animal_id,values,user_id);    
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
      
        <CardHeader title="New Exit/Disposal Details" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">  
          <Grid item xs={12}>
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
                      label = "Exit / Disposal Date"
                      type = "date"
                      name = "exit_date"                      
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
                    label="Exit / Disposal Reason"
                    name="disposal_reason"
                    onChange={handleChange}
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {exitTypes.map(exitType => (
                          <option                    
                            value={exitType.id}
                          >
                            {exitType.value}
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
                    label="Other Exit Reason"
                    name="disposal_reason_other"                
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
                    label="Disposal Amount"
                    type = 'number'
                    name="disposal_amount"                
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
                    //required
                    margin = 'dense'
                    label="New Farmer Name"
                    name="new_farmer_name"                                   
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
                    //required
                    margin = 'dense'
                    label="New Farmer Phone No"
                    name="new_farmer_phone_no"                                   
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
                    //required
                    margin = 'dense'
                    label="New Breeder Name"
                    name="new_breeder_name"                                   
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
                    //required
                    margin = 'dense'
                    label="New Breeder Phone No"
                    name="new_breeder_phone_no"                                   
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
                    //required
                    margin = 'dense'
                    label="New Country"
                    name="new_country"                                   
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
                    //required
                    margin = 'dense'
                    label="New Region"
                    name="new_region"                                   
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
                    //required
                    margin = 'dense'
                    label="New District"
                    name="new_district"                                   
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
                    label="New Village"
                    name="new_village"                
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