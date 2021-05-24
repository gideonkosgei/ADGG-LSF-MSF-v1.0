import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent,CardActions,Button, CardHeader, Grid,Divider,Box,Switch,TextField,colors,Typography } from '@material-ui/core';
import { getTimezones, getCountries,getAdminUnits,createUpdateUserAccount,genericFunctionTwoParameters,genericFunctionThreeParameters}   from '../../../../../../../../utils/API';
import {endpoint_user_account_info,endpoint_timezones,endpoint_countries,endpoint_admin_units,endpoint_new_user_account,endpoint_auth_roles} from '../../../../../../../../configs/endpoints';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import authContext from '../../../../../../../../contexts/AuthContext';
import Alert from '@material-ui/lab/Alert';

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

const ProfileDetails = props => {
  const { className,record_id, ...rest } = props; 
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
    /**
     * option
     * 0 > create
     * 1 > Edit
     */
   
    (async  (endpoint,option,id,org,values,user_id) => {     
      await  createUpdateUserAccount(endpoint,option,id,org,values,user_id)
      .then((response) => { 
        setOutput({status:null, message:''})
        if (parseInt(response.payload[0][0].status) === 1){    
          setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message})      
        } else {
          setOutput({status:parseInt(response.payload[0][0].status), message:response.payload[0][0].message})
        }
        
      }).catch((error) => {        
        setOutput({status:0, message:error.message})
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

  console.log(values);
 
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form id ='event' onSubmit={handleSubmit}>
        <CardHeader title= { readOnly ? `VIEW USER ACCOUNT PROFILE  #${record_id}`:`EDIT USER ACCOUNT PROFILE #${record_id}`}/>
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
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;