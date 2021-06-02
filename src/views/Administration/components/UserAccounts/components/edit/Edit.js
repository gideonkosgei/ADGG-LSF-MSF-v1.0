import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {CircularProgress,Card,Fab, CardContent,CardActions,Button, Grid,Divider,Box,Switch,TextField,Typography,LinearProgress } from '@material-ui/core';
import { getTimezones, getCountries,getAdminUnits,createUpdateUserAccount,genericFunctionTwoParameters,genericFunctionThreeParameters}   from '../../../../../../utils/API';
import {endpoint_user_account_info,endpoint_timezones,endpoint_countries,endpoint_admin_units,endpoint_new_user_account,endpoint_auth_roles} from '../../../../../../configs/endpoints';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import authContext from '../../../../../../contexts/AuthContext';
import {default as UnitAccess} from '../../../UnitAccess';
import Alert from '@material-ui/lab/Alert';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },  
  content: {
    marginTop: theme.spacing(3)
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const Edit = props => {
  const classes = useStyles();   
  const [values, setValues] = useState({});
  const [timezones, setTimezones] = useState(null);
  const [countries, setCountries] = useState(null);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [villages, setVillages] = useState([]);
  const [output, setOutput] = useState({status:null, message:""}); 
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id,country_id} ] = useContext(authContext); 
  const [authRoles, setAuthRoles] = useState([]);  
  const [readOnly, setReadOnly] = useState(true);
  const [units, setUnits] = useState({
    unit1: 'Regions',
    unit2: 'District',
    unit3: 'Ward',
    unit4: 'Village'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const record_id = props.match.params.id;
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  async function adminUnits (endpoint,unit,option){ 
    await  getAdminUnits(endpoint,unit,option)
    .then(response => {
      if(option ===1){ 
        if(isNaN(unit)){
          setRegions([]);
        } else {
          setRegions(response.payload[0]); 
        }        
        setDistricts([]);
        setWards([]);
        setVillages([]);
      }
      if(option ===2){  

        if(isNaN(unit)){
          setDistricts([]);
        } else {
          setDistricts(response.payload[0]); 
        } 
          setWards([]);
          setVillages([]);
        }
      if(option ===3){
        if(isNaN(unit)){
          setWards([]);
        } else {
          setWards(response.payload[0]); 
        } 
        setVillages([]);
      }
      if(option ===4){   
        if(isNaN(unit)){
          setVillages([]);
        } else {
          setVillages(response.payload[0]); 
        }   
       
      }
      
    });
  };

  useEffect(() => {     
    let mounted_time = true;
    let mounted_countries = true;
    let mounted_auth_roles = true;
    let mounted_acc_info = true;
    

     (async  (endpoint,desc,id) => {     
      await  genericFunctionThreeParameters(endpoint,desc,id)
      .then(response => {                        
        if (mounted_acc_info) {     
          setIsLoading(false);       
          setValues(response.payload[0][0]);
          adminUnits(endpoint_admin_units,response.payload[0][0].country,1);
          adminUnits(endpoint_admin_units,response.payload[0][0].region,2);
          adminUnits(endpoint_admin_units,response.payload[0][0].district,3);
          adminUnits(endpoint_admin_units,response.payload[0][0].ward,4); 
        }
      });
    })(endpoint_user_account_info,'fetch user account info',record_id);          

      (async  (endpoint,desc) => {     
        await  genericFunctionTwoParameters(endpoint,desc)
        .then(response => {                        
          if (mounted_auth_roles) {            
            setAuthRoles(response.payload);                 
          }
        });
      })(endpoint_auth_roles,'fetch auth roles');      

      (async  (endpoint_timezones) => {     
        await  getTimezones(endpoint_timezones)
        .then(response => {                        
          if (mounted_time) {            
            setTimezones(response.payload);                 
          }
        });
      })(endpoint_timezones);

      (async  (endpoint) => {     
        await  getCountries(endpoint)
        .then(response => {                        
          if (mounted_countries) {            
            setCountries(response.payload); 

            if (country_id && country_id !=='' ){
              let getUnits = response.payload.find(country => country.id === parseInt(country_id));         
              setUnits({
                unit1: getUnits.unit1_name,
                unit2: getUnits.unit2_name,
                unit3: getUnits.unit3_name,
                unit4: getUnits.unit4_name
              }); 
            }
          }
        });
      })(endpoint_countries);

    return () => {
      mounted_time = false;  
      mounted_countries = false;  
      mounted_auth_roles  = false;
      mounted_acc_info = false;
    };
  }, [record_id,country_id]); 

  if (!timezones || !countries || !authRoles || !values) {
    return null;
  }

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value 
    });
    if (event.target.name === 'country'){
      adminUnits(endpoint_admin_units,parseInt(event.target.value),1);

      if (event.target.value !== '') {
        let getUnits = countries.find(country => country.id === parseInt(event.target.value));         
        setUnits({
          unit1: getUnits.unit1_name,
          unit2: getUnits.unit2_name,
          unit3: getUnits.unit3_name,
          unit4: getUnits.unit4_name
        }); 
      } 
      
    }  
    
    if (event.target.name === 'region'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),2);      
    } 

    if (event.target.name === 'district'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),3);      
    } 

    if (event.target.name === 'ward'){     
      adminUnits(endpoint_admin_units,parseInt(event.target.value),4);      
    } 
  };

  const handleSubmit = event => {
    event.preventDefault(); 
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    /**
     * option
     * 0 > create
     * 1 > Edit
     */
   
    (async  (endpoint,option,id,org,values,user_id) => {     
      await  createUpdateUserAccount(endpoint,option,id,org,values,user_id)
      .then((response) => {       
        setOutput({status:null, message:''});
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);          
          if (parseInt(response.payload[0][0].status) === 1){               
            setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message}) 
          } else {
            setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message})
          } 
        }, 500);  



        
        /*if (parseInt(response.payload[0][0].status) === 1){    
          setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message})      
        } else {
          setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message})
        }*/
        
      }).catch((error) => {        
        setOutput({status:0, message:error.message});
        setSuccess(false);
        setLoading(false);
      });
    })(endpoint_new_user_account,1,record_id,organization_id,values,user_id);    
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };  

  
  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
  };

  return (
    <Page className={classes.root} >
      <Typography
      component="h1"
      variant="h3"
      >
         { readOnly ? `USER ACCOUNT - ${values.name}`:`USER ACCOUNT - ${values.name}` }        
      </Typography>
      <br/>           
      { isLoading  &&
        <LinearProgress/>
      } 
      <Grid
      container spacing={1} justify="center"
      >       
      
      <Grid
        item        
        xs={12}
      >
        <Card>   
    
        <form id ='event' onSubmit={handleSubmit}>        
        <Divider />
        <CardContent>
          {output.status === 0 ?
            <>
            <Alert severity="error" >{output.message}</Alert>
            <br/><br/>
            </>
          :output.status === 1 ?
          <>
          <Alert severity="success" >{output.message}</Alert>
          <br/><br/>
          </>
          :null
          }
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
                required              
                label="Full Name"
                name="name"
                value = {values.name} 
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}
              />
            </Grid>
            <Grid
              item
             md={3}
              xs={12}
            >
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value = {values.username} 
                onChange={handleChange} 
                variant="outlined"               
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: true,
                  disabled: true                
                }}
              />
            </Grid>
            <Grid
              item
             md={3}
              xs={12}
            >
              <TextField
                fullWidth
                required
                label="Email"
                name = "email"
                type = 'email' 
                value = {values.email}      
                onChange={handleChange}  
                variant="outlined"               
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: true,
                  disabled: true                
                }}
              />
            </Grid>
            <Grid
              item
             md={3}
              xs={12}
            >
              <TextField
                fullWidth
                label="Phone Number"             
                name="phone"
                value = {values.phone} 
                onChange={handleChange}
                type="text"  
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  readOnly: Boolean(readOnly),
                  disabled: Boolean(readOnly)                
                }}
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
                   
                    label="Country"
                    name="country"  
                    value = {values.country}                                  
                    onChange={handleChange}                   
                    variant="outlined"  
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {countries.map(country => (
                          <option                    
                            value={country.id}
                          >
                            {country.name}
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
                    
                    //required
                   
                    label={units.unit1}
                    name="region"     
                    value = {values.region}                               
                    onChange={handleChange}                   
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {regions.map(region => (
                          <option                    
                            value={region.id}
                          >
                            {region.name}
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
                    //required
                   
                    label={units.unit2}
                    name="district"    
                    value = {values.district}                                  
                    onChange={handleChange}                   
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {districts.map(district => (
                          <option                    
                            value={district.id}
                          >
                            {district.name}
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
                   
                    label={units.unit3}
                    name="ward"   
                    value = {values.ward}              
                    onChange={handleChange}
                    variant="outlined" 
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {wards.map(ward => (
                          <option                    
                            value={ward.id}
                          >
                            {ward.name}
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
                   
                    label={units.unit4}
                    name="village" 
                    value = {values.village} 
                    onChange={handleChange}
                    variant="outlined"
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {villages.map(village => (
                          <option                    
                            value={village.id}
                          >
                            {village.name}
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
                   
                    label="Time Zone"
                    name="timezone"
                    value = {values.timezone}
                    onChange={handleChange}
                    variant="outlined"
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {timezones.map(zone => (
                          <option                    
                            value={zone.id}
                          >
                            {zone.name}
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
                   
                    label="Role"
                    required
                    name="role"   
                    value = {values.role}             
                    onChange={handleChange}
                    variant="outlined"
                    select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {authRoles.map(role => (
                          <option                    
                            value={role.id}
                          >
                            {role.name}
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
                  
                <Box> 
                  <Typography variant="h6">{ values.status? "Deactivate Account" : "Activate Account"} </Typography> 
                </Box> 
                <Box> 
                  <Switch  
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}  
                    name = 'status'         
                    className={classes.toggle}            
                    checked = {(values.status)?true:false}
                    color="secondary"
                    edge="start"               
                    onChange={handleChange}
                  />             
                </Box> 
              </Grid>
          </Grid>
        </CardContent> 
          <Divider />
            <CardActions> 

              {readOnly ? null :        
              <>    
                <div className={classes.wrapper}>
                  <Fab
                    aria-label="save"
                    color="primary"
                    className={buttonClassname}
                  >
                    {success ? <CheckIcon /> : <SaveIcon />}
                  </Fab>
                  {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                </div>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={buttonClassname}
                    disabled={loading}                
                    type="submit"
                  >
                    Save Changes
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </>
              }         
             
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
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />         
    </Card>
        
      </Grid>

      <Grid
        item        
        xs={12}
      >
       <UnitAccess UserDetails = {values}/>
      </Grid>
      
    </Grid>
    </Page>
  );
};

Edit.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
export default Edit;
