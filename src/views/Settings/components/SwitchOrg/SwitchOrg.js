import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {getOrgAccess,putOrgAccessSwitch}   from '../../../../utils/API';
import {endpoint_orgs_access,endpoint_orgs_access_switch} from '../../../../configs/endpoints';
import authContext from '../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../components/ErrorSnackbar';

import { makeStyles } from '@material-ui/styles';
import {Card,Typography,Fab,CircularProgress,LinearProgress, CardContent, CardActions, Grid, Button, TextField, colors} from '@material-ui/core';
import { Page } from 'components';
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
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

const SwitchOrg = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [ {user_id,organization} ] = useContext(authContext);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();
  
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {    
    let mounted = true; 
    
      (async  (endpoint,user_id) => {     
        await  getOrgAccess(endpoint,user_id)
        .then(response => {       
          if (mounted) { 
            const data = response.payload;
            let orgs_accessible = [];        

          for (let i = 0; i<data.length; i++){
            if (data[i].status === 1){
              orgs_accessible.push(data[i]);
            }
          }               
          setOrgs(orgs_accessible);
          }
          setIsLoading(false);
        });
      })(endpoint_orgs_access,user_id);
 
    return () => {      
      mounted = false;      
    };    
  }, [user_id]);  

  if ( !orgs) {
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
    (async  (endpoint,org,user) => {     
      await  putOrgAccessSwitch(endpoint,org,user)
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

    })(endpoint_orgs_access_switch,values.org,user_id);    
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };
    


  return (
    <Page
      className={classes.root}
      title="Switch Org"
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        SWITCH ORGANIZATION / FARM
      </Typography>
      <br/> 
      { isLoading  &&
        <LinearProgress/>
      } 
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
     
      <form  onSubmit={handleSubmit}>
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
            spacing={3}
          >

            <Grid
              item
              md={12}
              xs={12}
            >
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Current Context <b> {`${organization}`} </b>
                <br/>
                <b>NB:</b> Changes Take Effect On The Next Login!    
                <br/>            
                {(orgs.length<1) ? "User not allowed to switch organization/farms. Contact Admin!" : 
                null
                }
              </Typography>
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
                    margin = 'dense'
                    label="Organization/farm"
                    name="org"
                    onChange={handleChange}                   
                    default = ""                              
                    select                    
                    SelectProps={{ native: true }}                    
                    variant="outlined"
                  >
                    <option value=""></option>
                    {orgs.map(org => (
                          <option                    
                            value={org.id}
                          >
                            {org.name}
                          </option>
                        ))
                    }           
                  </TextField>
                
            </Grid>
             </Grid>
      </CardContent>
    
      <CardActions>
     
            {(orgs.length<1) ? null :                        
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
    </Card>
    </Page>
  );
};

SwitchOrg.propTypes = {
  className: PropTypes.string
};

export default SwitchOrg;
