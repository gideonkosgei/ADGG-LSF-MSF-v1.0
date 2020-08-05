import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Box,Switch ,Typography,Tooltip } from '@material-ui/core';
import {getLookups,updateMilking,getMilkingByEventId}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_milking_update,endpoint_milking_specific} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventMilkingMetaData}  from '../../../Modal';

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
  const [sample_types, setSampleTypes] = useState([]);  
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const event_id  = localStorage.getItem('milking_event_id');  
 

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_milking = true;
    
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];
            let lookup_sample_types = [];
            for (let i = 0; i< data.length; i++){ 
              //Sample Types
              if(data[i].list_type_id === 70){                
                lookup_sample_types.push(data[i]);
              }             
            } 
            setSampleTypes(lookup_sample_types);            
          }
        });
      })(endpoint_lookup,'70');

      (async  (endpoint,id) => {             
        await  getMilkingByEventId(endpoint,id)
        .then(response => {       
          if (mounted_milking) { 
            const data = response.payload[0][0];                       
            setValues(data);                         
          }
        });
      })(endpoint_milking_specific,event_id);
      
    return () => {
      mounted_lookup = false; 
      mounted_milking = false;   
    };
  }, [event_id]);  
    
    
  if (!sample_types) {
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
      await  updateMilking(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_milking_update,event_id,values,user_id);    
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
      
        <CardHeader title= { readOnly ? `View Milk Record  #${localStorage.getItem('animal_id')}`:`Edit Milk Record  #${localStorage.getItem('animal_id')}` } />
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
                      label = "Milk Date"
                      type = "date"
                      name = "milk_date"                      
                      onChange = {handleChange}
                      variant = "outlined"
                      value = {values.milk_date}
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
                    label="Lactation ID"
                    name="lactation_id"              
                    onChange={handleChange}
                    variant="outlined" 
                    required     
                    value = {values.lactation_id}               
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
                    label="Lactation Number"
                    name="lactation_number"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"
                    value = {values.lactation_number} 
                    
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
                    label="Test Day No"
                    name="testday_no"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"
                    value = {values.testday_no}                       
                    
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
                    label="Days in Milk"
                    name="days_in_milk"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"  
                    value = {values.days_in_milk}                     
                    
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
                    label="Milk AM (ltrs)"
                    name="milk_am_litres"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"
                    value = {values.milk_am_litres}                       
                    
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
                    label="Milk mid-day (ltrs)"
                    name="milk_mid_day"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number" 
                    value = {values.milk_mid_day}                      
                    
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
                    label="Milk PM (ltrs)"
                    name="milk_pm_litres"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number"  
                    value = {values.milk_pm_litres}                     
                    
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
                    label="Milk Sample Type"
                    name="milk_sample_type"
                    onChange={handleChange}                   
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.milk_sample_type}
                  >
                    <option value=""></option>
                    {sample_types.map(sample_type => (
                          <option                    
                            value={sample_type.id}
                          >
                            {sample_type.value}
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
                    label="Milking Notes"
                    name="milking_notes"                
                    onChange={handleChange}
                    variant="outlined" 
                    rowsMax={4} 
                    multiline   
                    value = {values.milking_notes}                                           
                    
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
                    label="Milk Quality"
                    name="milk_quality"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.milk_quality}                                         
                    
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
                    label="Milk Weight(kg)"
                    name="milk_Weight"                
                    onChange={handleChange}
                    variant="outlined"  
                    type = "number"  
                    value = {values.milk_Weight}                                     
                    
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
                    label="Milk Butter Fat"
                    name="milk_butter_fat"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number" 
                    value = {values.milk_butter_fat}                                         
                    
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
                    label="Milk Lactose"
                    name="milk_lactose"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number" 
                    value = {values.milk_lactose}                                         
                    
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
                    label="Milk Protein"
                    name="milk_protein"                
                    onChange={handleChange}
                    variant="outlined"
                    type = "number" 
                    value = {values.milk_protein}                                          
                    
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
                    label="Milk Urea"
                    name="milk_urea"                
                    onChange={handleChange}
                    variant="outlined"   
                    type = "number"  
                    value = {values.milk_urea}                                      
                    
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
                    label="Milk Somatic Cell Count"
                    name="milk_somatic_cell_count"                
                    onChange={handleChange}
                    variant="outlined" 
                    type = "number"  
                    value = {values.milk_somatic_cell_count}                                        
                    
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
        <EventMilkingMetaData
                milkDetails={values}
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