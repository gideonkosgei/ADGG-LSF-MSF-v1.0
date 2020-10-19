import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Typography,Box,Switch,Tooltip} from '@material-ui/core';
import {putGraduationRecord,getGraduationRecord}   from '../../../../../../utils/API';
import {endpoint_graduation_record_edit,endpoint_graduation_record} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {MetaData}  from '../Modal';
  
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
  const record_id  = sessionStorage.getItem('record_id'); 
  const disable_form  = true;


  

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,record_id) => {     
      await  getGraduationRecord(endpoint,record_id)
      .then(response => {                        
        if (mounted) {            
          setValues(response.payload[0]);                 
        }
      });
    })(endpoint_graduation_record,record_id); 
    
    return () => {    
      mounted = false;      
    };    
  }, [record_id]);  

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
    (async  (endpoint,values,user_id,id) => {     
      await  putGraduationRecord(endpoint,values,user_id,id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_graduation_record_edit,values,user_id,record_id);    
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
        <CardHeader title= {`GRADUATION PROCESSING #${record_id}`} />
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
                      readOnly: Boolean(disable_form),
                      disabled: Boolean(disable_form)                
                    }}
                    margin = 'dense'
                    label="Animal ID"
                    name="animal_id"                
                    onChange={handleChange}
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
                      readOnly: Boolean(disable_form),
                      disabled: Boolean(disable_form)                
                    }}
                    margin = 'dense'
                    label="Tag ID"
                    name="tag_id"                
                    onChange={handleChange}
                    variant="outlined"                    
                    value = {values.tag_id}                    
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
                      readOnly: Boolean(disable_form),
                      disabled: Boolean(disable_form)                
                    }}
                    margin = 'dense'
                    label="Animal Name"
                    name="name"                
                    onChange={handleChange}
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
                      readOnly: Boolean(disable_form),
                      disabled: Boolean(disable_form)                
                    }}                   
                    margin = 'dense'
                    label="Graduate From"
                    name="graduate_from"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.graduate_from}                                            
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
                      readOnly: Boolean(disable_form),
                      disabled: Boolean(disable_form)                
                    }}                  
                    margin = 'dense'
                    label="Graduate TO"
                    name="graduate_to"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.graduate_to}                                            
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
                    readOnly: Boolean(disable_form),
                    disabled: Boolean(disable_form)                
                  }}
                  margin = 'dense'
                  label="Graduation Date"
                  type="date"
                  name="graduation_date"
                  defaultValue = {new Date()}
                  onChange={handleChange}
                  variant="outlined"                   
                  value = {values.created_at}
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
                  default = ""  
                  required                 
                  margin = 'dense'
                  label="Action"                 
                  name="action"                  
                  onChange={handleChange}              
                  select                 
                  SelectProps={{ native: true }}                    
                  variant="outlined"                   
                  
                >
                  <option value=""></option>
                  <option value="1">Graduate</option>
                  <option value="2">Do Not Graduate</option>
                </TextField>
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
        <MetaData
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