/* eslint-disable no-unused-vars */
import React, { useState, useContext, Fragment ,useEffect} from 'react';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField,InputAdornment,IconButton,CircularProgress,Checkbox,Typography} from '@material-ui/core';
import Spinner from '../../../../components/Spinner/Spinner';
import authContext from '../../../../contexts/AuthContext';
import useRouter from 'utils/useRouter';
import { Redirect } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import {Visibility,VisibilityOff,AccountCircle} from '@material-ui/icons';
import {endpoint_user_authentication} from '../../../../configs/endpoints';
import {authenticate}   from '../../../../utils/API';


const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles(theme => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center'
  },
  rememberMeCheckbox: {
    marginLeft: '-14px'
  }
}));


const LoginForm = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const router = useRouter(); 

  const [load, setLoad] = useState(false);

  const [formState, setformState] = useState({
    isValid: false,
    values: {},
    touched: {},    
    errors: {},
    showPassword: false ,
    loading:false  
  }); 

  const [ { isLoggedIn,isLoading, error }, dispatch ] = useContext(authContext);  

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setformState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}             
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setformState(formState => ({
      ...formState,
      values: {
        ...formState.values,
      [event.target.name]: event.target.type === 'checkbox'? event.target.checked : event.target.value
    },
    touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleClickShowPassword = () => {
    setformState({ ...formState, showPassword: !formState.showPassword });
  };

  

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  
  const handleSubmit =  event => {  
    event.preventDefault();    
    //setLoad({load: true});  

    const username = formState.values.email;
    const passport = formState.values.password;
    authenticate(endpoint_user_authentication,username,passport)  
      .then((userData) => {       
        if(userData.status ===200){         
            dispatch({
              type: 'LOGIN',
              payload: {
                userData
              }
            });
        }else {         
            dispatch({
              type: 'LOGIN_ERROR',
              payload: {
                error: "Login failed, please try again!"
              }
            });
        }
       }      
				
      )
			.catch((error) => {        
				dispatch({
					type: 'LOGIN_ERROR',
					payload: {
						error: error.message
					}
				});
			})
			.finally(() => {			
			});
    router.history.push('/');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;    

 
  return (
    <Fragment> 
       {/*console.log(load)*/} 
			{isLoggedIn ? (
				<Redirect to="/overview" />       
			) : (
    <Fragment>        
      	{error && <Alert severity="error" >{error}</Alert>}
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}
    >
      <div className={classes.fields}>
        <TextField
          error={hasError('email')}
          fullWidth
          helperText={hasError('email') ? formState.errors.email[0] : null}
          label="Email address"
          name="email"
          onChange={handleChange}
          value={formState.values.email || ''}
          variant="outlined"

          InputProps={{
            endAdornment: (
              <InputAdornment position="end"  >
                <IconButton  
                  edge="end"
                  variant="outlined"
                  color="inherit"
                >
                     <AccountCircle /> 
                </IconButton>
              </InputAdornment>
            ),
          }}

        />
        <TextField
          error={hasError('password')}
          fullWidth
          helperText={
            hasError('password') ? formState.errors.password[0] : null
          }
          label="Password"
          name="password"
          onChange={handleChange}
          type={formState.showPassword ? 'text' : 'password'}
          value={formState.values.password || ''}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end"  >
                <IconButton              
                  aria-label="Toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  variant="outlined"
                  color="inherit"
                >
                    {formState.showPassword ? <Visibility/> : <VisibilityOff />}  
                </IconButton>
              </InputAdornment>
            ),
          }}
          
        />
      </div>
      <div>
          <div className={classes.rememberMe}>
            <Checkbox
              checked={formState.values.rememberMe || false}
              className={classes.rememberMeCheckbox}
              color="primary"
              name="rememberMe"
              onChange={handleChange}
            />
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Remember me              
            </Typography>
          </div>          
        </div>
      
      <Button
        className={classes.submitButton}
        color="secondary"        
        disabled={!formState.isValid}
        size="large"
        type="submit"
        variant="contained"              
      >    
          {load ? (
                "Loading..."
              ) : (
                "Login"
              )} 
      </Button>
    </form>
    </Fragment>
    )}
		</Fragment>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string
};

export default LoginForm;
