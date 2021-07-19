import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Fab,CircularProgress, CardContent,Typography, Grid, TextField,colors,Button,CardActions} from '@material-ui/core';
import {getLookups,postFarm,getCountries,getAdminUnits}   from '../../../../utils/API';
import {endpoint_lookup,endpoint_farm_add,endpoint_countries,endpoint_admin_units} from '../../../../configs/endpoints';
import authContext from '../../../../contexts/AuthContext';
import {Header} from '../Header';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
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

const Add = props => {    
  const [ {organization_id,user_id,country_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [villages, setVillages] = useState([]);  
  const [farm_types, setFarmTypes] = useState([]);

 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const [units, setUnits] = useState({
    unit1: 'Regions',
    unit2: 'District',
    unit3: 'Ward',
    unit4: 'Village'
  });

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
    let mounted_countries = true;
    let mounted_lookup = true;

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

    (async  (endpoint,id) => {     
      await  getLookups(endpoint,id)
      .then(response => {       
        if (mounted_lookup) { 

          const data = response.payload[0];
          let lookup_farm_types = [];

          for (let i = 0; i< data.length; i++){ 
            //Farm Types
            if(data[i].list_type_id === 2){                
              lookup_farm_types.push(data[i]);
            }
          }  
          setFarmTypes(lookup_farm_types);
        }
      });
    })(endpoint_lookup,'2');


    return () => {   
      mounted_countries = false;       
      mounted_lookup = false;       
    };    
  }, [organization_id,country_id]);  

  if (!countries || !farm_types) {
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
    (async  (endpoint,values,user_id,org_id) => {     
      await  postFarm(endpoint,values,user_id,org_id)
      .then((response) => { 
                
        setOutput({status:null, message:''});      
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);          
          if (parseInt(response.status) === 1){               
            setOutput({status:parseInt(response.status), message:response.message}) 
          } else {
            setOutput({status:parseInt(response.status), message:response.message})
          } 
        }, 500);                      
    }).catch((error) => {
      setOutput({status:0, message:error.message})
      setSuccess(false);
      setLoading(false);
    });

    })(endpoint_farm_add,values,user_id,organization_id);    
  };
 


  return (
    <Page
      className={classes.root}
      title="farm register"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        FARM REGISTRATION
      </Typography>
      <br/> 
      <Header/>
      <br/>
       <Grid container spacing={1} justify="center">            
           
          <Grid item xs={12}>
            <Card> 
            <form id ='event' onSubmit={handleSubmit} >
              <CardContent> 
              {output.status === 0 ?
              <>
              <Alert severity="error" >{output.message}</Alert>             
              </>
              :output.status === 1 ?
              <>
              <Alert severity="success" >{output.message}</Alert>           
              </>
              :null
              }          
              <br/>        
                    
              <Grid
                container
                spacing={4}
              >               
             
              <Grid
                item
                md={2}
                xs={12}
              >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    label="Farm Type"
                    name="farm_type"                
                    onChange={handleChange}
                    variant="outlined" select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {farm_types.map(farm_type => (
                          <option                    
                            value={farm_type.id}
                          >
                            {farm_type.value} 
                          </option>
                        ))
                    }           
                  </TextField>
              </Grid>
              <Grid
                    item
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    label="Farm Code"
                    name="farm_code"                
                    onChange={handleChange}
                    variant="outlined" 
                                                            
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
                    required
                    label="Farm Name"
                    name="farm_name"                
                    onChange={handleChange}
                    variant="outlined" 
                                                            
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
                    
                    label="Farmer Name"
                    name="farmer_name"                
                    onChange={handleChange}
                    variant="outlined" 
                                                            
                />
              </Grid>
              
              <Grid
                    item
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Country"
                    name="country"  
                    required              
                    onChange={handleChange}
                    variant="outlined" select                    
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
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label={units.unit1}
                    name="region"                
                    onChange={handleChange}
                    variant="outlined" select                    
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
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}                   
                    
                    label={units.unit2}
                    name="district"                
                    onChange={handleChange}
                    variant="outlined" select                    
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
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}  
                    label={units.unit3}
                    name="ward"                
                    onChange={handleChange}
                    variant="outlined"  select                    
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
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}           
                    
                    label={units.unit4}
                    name="village"                
                    onChange={handleChange}
                    variant="outlined" select                    
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
                    md={2}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    label="Phone Number"
                    name="phone"                
                    onChange={handleChange}
                    variant="outlined" 
                                                            
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
                    type = "email"                    
                    label="Email"
                    name="email"                
                    onChange={handleChange}
                    variant="outlined" 
                                                            
                />
              </Grid>
              
            
              </Grid>
          
          
          
          </CardContent>          
          <CardActions>          
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
        </CardActions> 
        </form> 
        
        </Card>
    </Grid>
  </Grid>
        
    
     
   </Page>
  );
};

Add.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Add;
