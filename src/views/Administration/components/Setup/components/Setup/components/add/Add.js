import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Fab,CircularProgress, CardContent,Typography, Grid, TextField,colors,Button,CardActions} from '@material-ui/core';
import {postOrg,getCountries}   from '../../../../../../../../utils/API';
import {endpoint_org_add,endpoint_countries} from '../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../contexts/AuthContext';
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
  

 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
 

  const timer = React.useRef();  
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  
  
  useEffect(() => {     
    let mounted_countries = true;
    (async  (endpoint) => {     
      await  getCountries(endpoint)
      .then(response => {                        
        if (mounted_countries) {            
          setCountries(response.payload);                   
        }
      });
    })(endpoint_countries);

   

    return () => {   
      mounted_countries = false;
    };    
  }, [organization_id,country_id]);  

  if (!countries) {
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
    (async  (endpoint,values,user_id) => {     
      await  postOrg(endpoint,values,user_id)
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

    })(endpoint_org_add,values,user_id);    
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
        ORGANIZATION REGISTRATION
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
                    md={4}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    label="Organization Name"
                    name="org_name"                
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
