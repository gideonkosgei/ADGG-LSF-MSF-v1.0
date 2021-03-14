import React, { useState,useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {passwordStrength}  from 'check-password-strength'; 
import {Card,CardHeader,InputAdornment,IconButton,  CardContent,  CardActions,  Grid,  Button,  Divider,  TextField,  colors, Typography} from '@material-ui/core';
import { Label } from 'components';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import authContext from '../../../../contexts/AuthContext';
import { changePassword}   from '../../../../utils/API';
import {endpoint_change_password} from '../../../../configs/endpoints';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  list: {
    marginLeft: theme.spacing(3)
  }
}));

const Security = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [formState, setformState] = useState({  
    showPasswordCurrent: false ,
    showPasswordNew: false ,
    showPasswordConfirm: false    
  }); 
  const [ {user_id,email,password} ] = useContext(authContext);
  const [output, setOutput] = useState({status:null, message:""}); 

  //https://www.npmjs.com/package/check-password-strength
 
  

  const [values, setValues] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    hash : password
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleClickShowPasswordCurrent = () => {
    setformState({ ...formState, showPasswordCurrent: !formState.showPasswordCurrent });
  };
  const handleClickShowPasswordNew = () => {
    setformState({ ...formState, showPasswordNew: !formState.showPasswordNew });
  };
  const handleClickShowPasswordConfirm = () => {
    setformState({ ...formState, showPasswordConfirm: !formState.showPasswordConfirm });
  };

  const handleMouseDownPasswordCurrent = (event) => {
    event.preventDefault();
  };
  const handleMouseDownPasswordNew = (event) => {
    event.preventDefault();
  };


  const handleMouseDownPasswordConfirm = (event) => {
    event.preventDefault();
  };

  const valid = values.new_password && values.new_password === values.confirm_password; 
    /*
      password strength IDs
      0 > Too weak
      1 > week
      2 > Medium
      3 > Strong
    */

   const handleSubmit = event => {    
    event.preventDefault();
    (async  (endpoint,values,email,user_id) => {     
      await  changePassword(endpoint,values,email,user_id)
      .then((response) => {        
        setOutput({status:null, message:''});
        if (parseInt(response.status) === 1){           
          //setValues({});  
          setOutput({status:parseInt(response.status), message:response.message})      
          //document.forms["event"].reset();
        } else {
          setOutput({status:parseInt(response.status), message:response.message})
        }
        
      }).catch((error) => {        
        setOutput({status:0, message:error.message})
      });
    })(endpoint_change_password,values,email,user_id);    
  };
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form id ='event' onSubmit={handleSubmit}>
      <CardHeader title="Change password" />
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
            spacing={3}
          >
            
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
            >
              <Typography>              
                A strong password must have:<br/>
                1. Lowercase {passwordStrength(values.new_password).contains.includes("lowercase") ? <Label color = '#7cb342' shape ="rounded"> &#10004; </Label> : ""}<br/>
                2. Uppercase {passwordStrength(values.new_password).contains.includes("uppercase") ? <Label color = '#7cb342' shape ="rounded"> &#10004; </Label> : ""}<br/>
                3. Symbol or special character {passwordStrength(values.new_password).contains.includes("symbol") ? <Label color = '#7cb342' shape ="rounded"> &#10004; </Label> : ""}<br/>
                4. Number {passwordStrength(values.new_password).contains.includes("number") ? <Label color = '#7cb342' shape ="rounded"> &#10004; </Label> : ""}  <br/>
                5. At least 10 characters in length {parseInt(passwordStrength(values.new_password).length) >9 ? <Label color = '#7cb342' shape ="rounded"> &#10004; </Label> : ""}              
              </Typography> 
              <br/>
              <Typography>Password Strength Meter &nbsp;&nbsp;                
              <Label 
                color= 
                  {
                    passwordStrength(values.new_password).id === 0 ? colors.red[500]: 
                    passwordStrength(values.new_password).id === 1 ? colors.red[300]:
                    passwordStrength(values.new_password).id === 2 ? '#ffa726':'#7cb342'                    
                  }
              >
                {passwordStrength(values.new_password).value}
              </Label>
              </Typography>

            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"  >
                      <IconButton              
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPasswordCurrent}
                        onMouseDown={handleMouseDownPasswordCurrent}
                        edge="end"
                        variant="outlined"
                        color="inherit"
                      >
                          {formState.showPasswordCurrent ? <Visibility/> : <VisibilityOff />}  
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              
                required
                fullWidth
                label="Current password"
                name="current_password"
                onChange={handleChange}
                type={formState.showPasswordCurrent ? 'text' : 'password'}                
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end"  >
                      <IconButton              
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPasswordNew}
                        onMouseDown={handleMouseDownPasswordNew}
                        edge="end"
                        variant="outlined"
                        color="inherit"
                      >
                          {formState.showPasswordNew ? <Visibility/> : <VisibilityOff />}  
                      </IconButton>
                    </InputAdornment>
                  ),
                }}              
                required
                fullWidth
                label="New password"
                name="new_password"
                onChange={handleChange}
                type={formState.showPasswordNew ? 'text' : 'password'}              
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
              <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end"  >
                    <IconButton              
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPasswordConfirm}
                      onMouseDown={handleMouseDownPasswordConfirm}
                      edge="end"
                      variant="outlined"
                      color="inherit"
                    >
                        {formState.showPasswordConfirm ? <Visibility/> : <VisibilityOff />}  
                    </IconButton>
                  </InputAdornment>
                ),
              }}
                fullWidth
                required
                label="Confirm new password"
                name="confirm_password"
                onChange={handleChange}
                type={formState.showPasswordConfirm ? 'text' : 'password'}               
                variant="outlined"
              />
            </Grid>
          </Grid>
        
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.saveButton}
          disabled={!valid}
          variant="contained"
          type="submit"
        >
          Save changes
        </Button>
      </CardActions>
      </form>
    </Card>
  );
};

Security.propTypes = {
  className: PropTypes.string
};

export default Security;
