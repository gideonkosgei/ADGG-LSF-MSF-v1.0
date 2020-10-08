import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {getOrgAccess,putOrgAccessSwitch}   from '../../../../utils/API';
import {endpoint_orgs_access,endpoint_orgs_access_switch} from '../../../../configs/endpoints';
import authContext from '../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../components/ErrorSnackbar';

import { makeStyles } from '@material-ui/styles';
import {Card, CardHeader,Typography, CardContent, CardActions, Grid, Button, Divider, TextField, colors, Box} from '@material-ui/core';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
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
    (async  (endpoint,org,user) => {     
      await  putOrgAccessSwitch(endpoint,org,user)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Switch Organization" />
      <Divider />
      <form  onSubmit={handleSubmit}>
      <CardContent>
        
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
                    label="Organization"
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
      <Divider />
      <CardActions>
      <Box flexGrow={1}>
            {(orgs.length<1) ? null :                        
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"                                               
              >
                Save Changes
              </Button>              
            }  
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
    </Card>
    </Page>
  );
};

SwitchOrg.propTypes = {
  className: PropTypes.string
};

export default SwitchOrg;
