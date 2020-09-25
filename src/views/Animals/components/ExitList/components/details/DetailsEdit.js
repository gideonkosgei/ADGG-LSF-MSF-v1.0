import React, { useState,useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,Tooltip ,TextField,colors,Button,CardActions,Box} from '@material-ui/core';
import {getLookups,getExitByEventId}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_exit_specific} from '../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {EventExitMetaData}  from '../../../Modal';


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
  const classes = useStyles();
  const [values, setValues] = useState({ });
  const [exitTypes, setExitTypes] = useState([]);    
  const [openMetadata, setMetadata] = useState(false);   
  const event_id  = localStorage.getItem('exit_event_id');  
  
 const readOnly = true;

  useEffect(() => {   
    let mounted_lookup = true;
    let mounted_exit = true;    
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

      (async  (endpoint,id) => {             
        await  getExitByEventId(endpoint,id)
        .then(response => {       
          if (mounted_exit) { 
            const data = response.payload[0][0];                       
            setValues(data);                         
          }
        });
      })(endpoint_exit_specific,event_id);
      

      
    return () => {
      mounted_lookup = false; 
      mounted_exit = false;    
    };
  }, [event_id]);   


  if (!exitTypes || !values) {
    return null;
  }
 
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
        <CardHeader title = {`Exit / Disposal Record Details  #${values.animal_id}`} />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
            <Card> 
            <form  >
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
                      label = "Exit / Disposal Date"
                      type = "date"
                      name = "exit_date"
                      variant = "outlined"
                      value = {values.exit_date}
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
                    label="Animal ID"
                    name="animal_id"  
                    variant="outlined" 
                    value = {values.animal_id} 
                    
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
                    label="Tag ID"
                    name="tag_id"  
                    variant="outlined" 
                    value = {values.tag_id} 
                    
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
                    label="Animal Name"
                    name="name"  
                    variant="outlined" 
                    value = {values.name} 
                    
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
                    label="Exit / Disposal Reason"
                    name="disposal_reason"
                    
                    required
                    default = ""                              
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                    value = {values.disposal_reason}
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    margin = 'dense'
                    label="Other Exit Reason"
                    name="disposal_reason_other"                
                    
                    variant="outlined" 
                    value = {values.disposal_reason_other} 
                    
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
                    label="Disposal Amount"
                    type = 'number'
                    name="disposal_amount"                
                    
                    variant="outlined"  
                    value = {values.disposal_amount}
                    
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
                    //required
                    margin = 'dense'
                    label="New Farmer Name"
                    name="new_farmer_name"                                 
                                       
                    variant="outlined"
                    value = {values.new_farmer_name}                                                 
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
                    //required
                    margin = 'dense'
                    label="New Farmer Phone No"
                    name="new_farmer_phone_no"                                   
                                       
                    variant="outlined"  
                    value = {values.new_farmer_phone_no}                                               
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
                    //required
                    margin = 'dense'
                    label="New Breeder Name"
                    name="new_breeder_name"                                   
                                       
                    variant="outlined"  
                    value = {values.new_breeder_name}                                               
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
                    //required
                    margin = 'dense'
                    label="New Breeder Phone No"
                    name="new_breeder_phone_no"                                   
                                       
                    variant="outlined" 
                    value = {values.new_breeder_phone_no}                                                
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
                    //required
                    margin = 'dense'
                    label="New Country"
                    name="new_country"                                   
                                       
                    variant="outlined" 
                    value = {values.new_country}                                                
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
                    //required
                    margin = 'dense'
                    label="New Region"
                    name="new_region"                                   
                                       
                    variant="outlined" 
                    value = {values.new_region}                                                
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
                    //required
                    margin = 'dense'
                    label="New District"
                    name="new_district"                                   
                                       
                    variant="outlined" 
                    value = {values.new_district}                                                
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
                    label="New Village"
                    name="new_village"                
                    
                    variant="outlined"  
                    value = {values.new_village}
                   
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
                    
                    variant="outlined" 
                    value = {values.field_agent_id} 
                    
                />
              </Grid>
            
              </Grid>
          </CardContent>
          <Divider />
          <CardActions>         
          
          <Box>
            <Tooltip  title="view Metadata">
              <Button onClick={handleMetadataOpen}>
                <OpenInNewIcon className={classes.buttonIcon} />                
              </Button>
            </Tooltip>               
          </Box>  
          
        </CardActions> 
        </form>         
         <EventExitMetaData
                exitDetails={values}
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