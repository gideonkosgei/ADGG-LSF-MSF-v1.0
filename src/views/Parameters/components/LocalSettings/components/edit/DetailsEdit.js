import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Switch,Typography,Box,Tooltip } from '@material-ui/core';
import {updateParametersLocalSettings,getParametersLocalSettingsOrgOne}   from '../../../../../../utils/API';
import {endpoint_parameter_local_settings_org_update,endpoint_parameter_local_settings_org_one} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {ParameterMetaData}  from '../Modal';

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
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const local_setting_id  = localStorage.getItem('paramater_local_setting_id'); 
   
  useEffect(() => {
    let mounted_params = true;
    (async  (endpoint,id) => {             
      await  getParametersLocalSettingsOrgOne(endpoint,id)
      .then(response => {       
        if (mounted_params) {           
          const data = response.payload[0];          
          setValues(data);                                
        }
      });
    })(endpoint_parameter_local_settings_org_one,local_setting_id);
    return () => { 
      mounted_params = false;          
    };
  },[local_setting_id]);
  if (!values) {
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
    (async  (endpoint,id,values,user_id,local_setting_id) => {     
      await  updateParametersLocalSettings(endpoint,id,values,user_id,local_setting_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_parameter_local_settings_org_update,values,user_id,local_setting_id);    
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
      
        <CardHeader title= { readOnly ? `Local Settings - View System Parameter #${local_setting_id}`:`Local Settings - Edit System Parameter  #${local_setting_id}` } />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
            <Card> 
            <form id ='event' onSubmit={handleSubmit}>
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
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label="Parameter name"
                    name="name"                
                    onChange={handleChange}
                    variant="outlined" 
                    required 
                    value = {values.name}                    
                />
              </Grid>
              
              <Grid
                    item
                    md={6}
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
                    required
                    label="Parameter Description"
                    name="description"  
                    multiline      
                    rowsMax = {4}                            
                    onChange={handleChange}
                    variant="outlined"
                    value = {values.description} 
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
                    label="Parameter Key"
                    name="key"                
                    onChange={handleChange}
                    variant="outlined"  
                    required  
                    value = {values.key}                  
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
                    label="Parameter Value"
                    name="value"                
                    onChange={handleChange}
                    variant="outlined"  
                    required  
                    value = {values.value}                  
                />
              </Grid>                
             
              <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <Box> 
                    <Typography variant="h6"> { values.is_active? "Deactivate" : "Activate"} </Typography> 
          </Box> 
          <Box> 
              <Switch   
              inputProps={{
                readOnly: Boolean(readOnly),
                disabled: Boolean(readOnly)                
              }}
                name = "is_active"          
                className={classes.toggle} 
                color="secondary"
                edge="start"
                onChange={handleChange}
                checked = {(values.is_active)?true:false}
              />             
         </Box>
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
        <ParameterMetaData
                Details={values}
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