import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card,Avatar, Grid,Typography} from '@material-ui/core';
import { Page, Alert } from 'components';
import gradients from 'utils/gradients';
import ErrorIcon from '@material-ui/icons/ErrorOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  card: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center'
  },
  avatarBlue: {
    backgroundImage: gradients.red,
    marginLeft: theme.spacing(2)
  },
  alert: {
    marginBottom: theme.spacing(1)
  }  
}));

// variant = 'default', 'info', 'success', 'warning', 'error'


const EventValidation = props => {
  const {validations, className, ...rest } = props;
  const classes = useStyles();  

  return (
    <Page>     
      <Alert
        className={classes.alert}
        variant = 'error'
        message="System Validation Warnings!"         
      />        
      <br/>
      <div
        {...rest}
        className={clsx(classes.root, className)}
      > 
        <Grid container spacing={1} >
       
          { validations.map(validation => (
          
            <>
              <Grid item  xs={1} >  
                <Avatar className={classes.avatarBlue}>
                  <ErrorIcon />
                </Avatar>
              </Grid>

              <Grid item  xs={11} > 
                <Card className={classes.card}>
                  <Typography variant="body1">         
                      {validation.details}
                  </Typography>          
                </Card> 
              </Grid> 

              <br/>
            </>            
            ))
          }
        </Grid>
      </div>
      <br/> 
    </Page>     
  );
};

EventValidation.displayName = 'EventValidation';
EventValidation.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

EventValidation.defaultProps = {
  open: false,
  onClose: () => {}
};
export default EventValidation;
