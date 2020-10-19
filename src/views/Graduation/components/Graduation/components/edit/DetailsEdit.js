import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Typography,Box,Switch,Tooltip} from '@material-ui/core';
import {getLookups,putStraw,getStraws}   from '../../../../../../utils/API';
import {endpoint_lookup,endpoint_straw_edit,endpoint_straw} from '../../../../../../configs/endpoints';
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
  const [specifications, setSpecification] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [breedCompositions, setBreedCompositions] = useState([]); 
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false);   
  const straw_id  = localStorage.getItem('straw_id'); 
  

  useEffect(() => {
    let mounted_lookup = true;
    let mounted = true;
    const option  =  1;
    const is_active = 1;


    (async  (endpoint,org_id,option,is_active) => {     
      await  getStraws(endpoint,org_id,option,is_active)
      .then(response => {                        
        if (mounted) {            
          setValues(response.payload[0]);                 
        }
      });
    })(endpoint_straw,straw_id,option,is_active); 

    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            
            let lookup_specification = [];
            let lookup_breed = [];
            let lookup_breed_composition = [];

            for (let i = 0; i< data.length; i++){
              //specifications
              if(data[i].list_type_id === 85){                
                lookup_specification.push(data[i]);
              } 
              //main breeds
              if(data[i].list_type_id === 8){                
                lookup_breed.push(data[i]);
              }
              //breed Composition
              if(data[i].list_type_id === 14){                
                lookup_breed_composition.push(data[i]);
              }          
            }                    
            setSpecification(lookup_specification);
            setBreedCompositions(lookup_breed_composition);
            setBreeds(lookup_breed);
            
                        
          }
        });
      })(endpoint_lookup,'85,8,14'); 

      
        
    return () => {
      mounted_lookup = false;   
      mounted = false;      
    };    
  }, [straw_id]);  

  if (!breeds || !breedCompositions || !specifications || !values) {
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
      await  putStraw(endpoint,values,user_id,id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_straw_edit,values,user_id,straw_id);    
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
        <CardHeader title= { readOnly ? `AI STRAW #${straw_id}`:`EDIT AI STRAW #${straw_id}` } />
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
                    label="Semen Source"
                    name="semen_source"                
                    onChange={handleChange}
                    variant="outlined" 
                    required 
                    value = {values.semen_source}                    
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
                    label="Farm Name/ID"
                    name="farm_name"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.farm_name}                                        
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
                    required
                    margin = 'dense'
                    label="Straw ID"
                    name="straw_id"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.straw_id}                                            
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
                    label="Semen Bar Code"
                    name="barcode"                
                    onChange={handleChange}
                    variant="outlined"    
                    value = {values.barcode}                                      
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
                    required                
                    margin = 'dense'
                    label="Batch Number"
                    name="batch_number"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.batch_number}                                        
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
                    label="Bull ID / Tag ID"
                    name="bull_tag_id"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.bull_tag_id}                                       
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
                    label="Bull Name"
                    name="bull_name"                
                    onChange={handleChange}
                    variant="outlined"  
                    value = {values.bull_name}                                       
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
                    label="Breed of Bull"
                    name="breed_id"
                    onChange={handleChange}                    
                    default = "" 
                    value = {values.breed_id}                                
                    select
                    // eslint-disable-next-line react/jsx-sort-props
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {breeds.map(breed => (
                          <option                    
                            value={breed.id}
                          >
                            {breed.value}
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
                    label="Bull Breed Composition"
                    name="breed_composition_id"
                    onChange={handleChange}                   
                    default = ""                              
                    select 
                    value = {values.breed_composition_id}                     
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {breedCompositions.map(comp => (
                          <option                    
                            value={comp.id}
                          >
                            {comp.value}
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
                    label="Ejaculation Number"
                    name="ejaculation_number"                
                    onChange={handleChange}
                    variant="outlined"   
                    value = {values.ejaculation_number}                                       
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
                  label="Production Date"
                  type="date"
                  name="production_date"
                  defaultValue = {new Date()}
                  onChange={handleChange}
                  variant="outlined" 
                  required   
                  value = {values.production_date}
                />
            </Grid>  

            <Grid
                    item
                    md={4}
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
                    label="Specification"
                    name="specification_id"
                    onChange={handleChange}  
                    value = {values.specification_id}                 
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {specifications.map(spec => (
                          <option                    
                            value={spec.id}
                          >
                            {spec.value}
                          </option>
                        ))
                    }           
                  </TextField>
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
                    label="Additional Info"
                    name="additional_info"  
                    multiline      
                    rowsMax = {4}
                    rows={3}                                               
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.additional_info}   
                />
              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <Box> 
                    <Typography variant="h6"> { values.is_active? "Active(on)" : "Active(off)"} </Typography> 
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