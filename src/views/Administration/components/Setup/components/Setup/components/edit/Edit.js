import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Fab,LinearProgress,CircularProgress,Box, CardContent,Typography, Grid, TextField,colors,Button,CardActions,Switch,Tooltip} from '@material-ui/core';
import {putOrg,getCountries,genericFunctionFourParameters}   from '../../../../../../../../utils/API';
import {endpoint_org_update,endpoint_countries,endpoint_orgs} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
import {Header} from '../Header';
import {default as Farms} from '../../../../../../../Farms/components/Farms/components/view'

import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {MetaData,FarmModal}  from '../Modal';

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
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [countries, setCountries] = useState([]);   
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const [farmModalToggle, setFarmModalToggle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const option  =  1;
  const [isLoading, setIsLoading] = useState(true); 

  const timer = React.useRef();
  const org_id  = parseInt(props.match.params.id);
  
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

 
  useEffect(() => {     
    let mounted_countries = true;   
    let mounted = true;  

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
        if (mounted) {   
          setIsLoading(false);               
          setValues(response.payload[0]);        
        }
      });
    })(endpoint_orgs,'get org details',option,org_id); 

   
    
    return () => {   
      mounted_countries = false;
      mounted = false;              
    };    
  }, [org_id]);  

  if (!countries || !values) {
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
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    (async  (endpoint,values,user_id,rec_id) => {     
      await  putOrg(endpoint,values,user_id,rec_id)
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

    })(endpoint_org_update,values,user_id,org_id);    
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
  
  const handleClose = () => {
    setFarmModalToggle(false);
  };

  const handleClickAddFarm = () => {
    setFarmModalToggle(true);   
  };
  

  return (
    <Page
      className={classes.root}
      title="org edit"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
         { readOnly ? `ORGANIZATION - ${values.org_name}`:`EDIT ORGANIZATION  - ${values.org_name}` }
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
                    label="Organization Name"
                    name="org_name"                
                    onChange={handleChange}
                    variant="outlined" 
                    value = {values.org_name}                                        
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
                    value = {values.country}
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

        <FarmModal         
          onClose={handleClose}
          open={farmModalToggle}
          Details={values}
        />
        
        </Card>
    </Grid>    
  </Grid>
  <br/>
  <Grid
    alignItems="flex-end"
    container
    justify="space-between"
    spacing={3}
  >
    <Grid
        item
        md={12}
        xs={12}
      >
      <Typography variant="h6">Important Notes</Typography>
      <Typography variant="body2">
        Farm Units are linked to organization units. <br/>
        An organization unit can have zero(0) or more farm unit(s)<br/>
        A farm unit can only belong to only one(1) organization unit<br/>        
        Linked farm unit(s) for the current selected organization unit are listed on the grid below<br/>
        To Link & Re-link, click the ORG-LINK button below
      </Typography>
    </Grid>
    <Grid item>
      <Button
        variant="outlined"  
        onClick={handleClickAddFarm} 
      >
        ORG-FARM LINKING
      </Button>
    </Grid>

  </Grid>

  <Farms org = {org_id}/>

  </Page>


  );
};

Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
