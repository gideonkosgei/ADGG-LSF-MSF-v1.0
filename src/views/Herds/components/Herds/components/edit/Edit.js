import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Fab,Link,LinearProgress,CircularProgress,Box, CardContent,Typography, Grid, TextField,colors,Button,CardActions,Switch,Tooltip} from '@material-ui/core';
import {putHerd,getCountries,getAdminUnits,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_herd_update,endpoint_countries,endpoint_admin_units,endpoint_farms,endpoint_herd,endpoint_herd_animals} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Header} from '../Header';
import {default as Statistics} from '../../../../../Overview/components/Statistics';
import {default as AnimalCategorySegmentation} from '../../../../../DashboardAnalytics/components/AnimalCategorySegmentation';
import {default as BreedDistribution} from '../../../../../DashboardAnalytics/components/BreedDistribution';

import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {MetaData}  from '../Modal';
import moment from 'moment';
import CustomToolbar from "./CustomToolbar";
import { Link as RouterLink } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';


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

const Edit = props => {    
  const [ {organization_id,user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [villages, setVillages] = useState([]);  
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const option  =  1;
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  
  const timer = React.useRef();
  const herd_id  = parseInt(props.match.params.id);
  
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
    let mounted_farms = true;
    let mounted = true;
    let mounted_animals = true;

    // get all animals that belongs to this herd
    (async  (endpoint,desc,org,herd) => {     
      await  genericFunctionFourParameters(endpoint,desc,org,herd)
      .then(response => {                        
        if (mounted_animals) {   
          setIsLoadingAnimals(false);          
          setAnimals(response.payload[0]);                           
        }
      });
    })(endpoint_herd_animals,'get herd animals',organization_id,herd_id); 


    (async  (endpoint,desc,option,id) => {     
      await  genericFunctionFourParameters(endpoint,desc,option,id)
      .then(response => {                        
        if (mounted) {   
          setIsLoading(false);          
          setValues(response.payload[0][0]); 
          adminUnits(endpoint_admin_units,response.payload[0][0].country,1);
          adminUnits(endpoint_admin_units,response.payload[0][0].region,2);
          adminUnits(endpoint_admin_units,response.payload[0][0].district,3);
          adminUnits(endpoint_admin_units,response.payload[0][0].ward,4);                 
        }
      });
    })(endpoint_herd,'get herd details',option,herd_id); 

    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                 
        }
      });
    })(endpoint_countries);

    (async  (endpoint,desc,option,id) => {     
      await  genericFunctionFourParameters(endpoint,desc,option,id)
      .then(response => {                        
        if (mounted_farms) {            
          setFarms(response.payload[0]);                 
        }
      });
    })(endpoint_farms,'get farms',0,organization_id);

    return () => {   
      mounted_countries = false;  
      mounted_farms = false;  
      mounted = false; 
      mounted_animals = false;            
    };    
  }, [organization_id,herd_id]);  

  if (!countries || !farms || !values) {
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
    (async  (endpoint,values,user_id,rec_id) => {     
      await  putHerd(endpoint,values,user_id,rec_id)
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

    })(endpoint_herd_update,values,user_id,organization_id);    
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

  
  const columns = [
    { name: "animal_id",label: "id",options: {filter: false,sort: false,display:false}}, 
    { name: "registration_date",label: "Reg Date",options: {filter: false,sort: true, display:true,hint:'Registration Date'}} ,
    { name: "animal_id",label: "ID",options: {filter: false,sort: true,display:true}},    
    { name: "tag_id",label: "Tag",options: {filter: false,sort: true,display:true}},
    { name: "animal_name",label: "Name",options: {filter: false,sort: true,display:true}},       
    { name: "org_id",label: "org_id",options: {filter: false,sort: true,display:false}},
    { name: "sex_id",label: "sex_id",options: {filter: false,sort: true,display:false}},
    { name: "sex",label: "Sex",options: {filter: true,sort: true,display:true}},    
    { name: "farm_id",label: "farm_id",options: {filter: false,sort: true,display:false}},    
    { name: "animalType",label: "Type",options: {filter: true,sort: true, display:true}},   
    { name: "dateofBirth",label: "DOB",options: {filter: false,sort: true, display:true}} ,  
    { name: "main_breed",label: "Breed",options: {filter: true,sort: true, display:true}},  
    { name: "breedComposition",label: "Breed Comp",options: {filter: false,sort: false, display:true, hint:'Breed Composition'}},
    
     
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true,    
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Link
              component={RouterLink}
              to = {`/management/details/edit/${tableMeta.rowData[0]}`}
          >
            <OpenInNewIcon/>
          </Link>
          
        );
      }
    }
  }
    
  ];

  const data = animals;  

     const options = {       
       filter: true,
       rowsPerPage: 5,       
       rowsPerPageOptions :[5,10,20,50,100],
       selectableRows: 'none',      
       filterType: 'checkbox',
       responsive: 'stacked',                
       rowHover: true,       
       setTableProps: () => {
        return {
          padding: "none" ,         
          size: "small",
        };
      }, 
      customToolbar: () => {
        return (
          <CustomToolbar />
        );
      }       
     };

  return (
    <Page
      className={classes.root}
      title="herd register"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
         { readOnly ? `HERD - ${values.herd_name}`:`EDIT HERD  - ${values.herd_name}` }
      </Typography>
      <br/>  
      <Header />
      <br/>           
      { isLoading  &&
        <LinearProgress/>
      } 
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
                  inputProps={{
                    readOnly: Boolean(readOnly),
                    disabled: Boolean(readOnly),
                    max: moment(new Date()).format('YYYY-MM-DD')                
                  }}
                  
                  label="Registration Date"
                  type="date"
                  name="reg_date"
                  value = {values.reg_date}   
                  onChange={handleChange}
                  variant="outlined" 
                  required                   
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    
                    label="Herd Name"
                    name="herd_name" 
                    value = {values.herd_name}                
                    onChange={handleChange}
                    variant="outlined" 
                    required                                        
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
                    required
                    label="Farm"
                    name="farm_id" 
                    value = {values.farm_id}                
                    onChange={handleChange}
                    variant="outlined" select                    
                    SelectProps={{ native: true }} 
                  >
                    <option value=""></option>
                    {farms.map(farm => (
                          <option                    
                            value={farm.id}
                          >
                            {`${farm.name} - ${farm.code}`} 
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    label="Country"
                    name="country"   
                    value = {values.country}               
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    label="Region"
                    name="region"   
                    value = {values.region}               
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}                
                    
                    label="District"
                    name="district"  
                    value = {values.district}               
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}
                    label="Ward"
                    name="ward"    
                    value = {values.ward}               
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
                    inputProps={{
                      readOnly: Boolean(readOnly),
                      disabled: Boolean(readOnly)                
                    }}        
                    
                    label="Village"
                    name="village"    
                    value = {values.village}                    
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
            
              </Grid>
          </CardContent>          
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
        <MetaData
          Details={values}
          onClose={handleMetadataClose}
          open={openMetadata}
        /> 
        
        </Card>
    </Grid>
  </Grid>

  <Typography
    component="h2"
    gutterBottom
    variant="h4"
  >
    <br/>
    {`HERD SUMMARY - ${values.herd_name}`}
  </Typography>
  <br/> 
  <Statistics className={classes.statistics} org = {organization_id} level = {1} herd = {herd_id} />
  <br/>
  <Grid
    container
    spacing={3}
  >    
    <Grid
       item
       lg={5}
       xl={4}
       xs={12}
    >
       <AnimalCategorySegmentation org = {organization_id} level = {1} herd = {herd_id} />
    </Grid>
    <Grid
      item
      lg={7}
      xl={4}
      xs={12}
    >
      <BreedDistribution org = {organization_id} level = {1} herd = {herd_id} />
    </Grid> 
  </Grid>
 

  <Typography
    component="h2"
    gutterBottom
    variant="h4"
  >
    <br/>
    {`HERD ANIMALS - ${values.herd_name}`}    
  </Typography>
  <br/> 
  { isLoadingAnimals  &&  <LinearProgress/>   } 
  <Card> 
        <CardContent className={classes.content}>
          <PerfectScrollbar>           
            <MuiThemeProvider>                
              <MUIDataTable
                title=""
                data={data}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>           
          </PerfectScrollbar>
        </CardContent>
      </Card>
        
    
     
   </Page>
  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
