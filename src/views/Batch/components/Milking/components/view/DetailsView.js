import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Stepper,Step,StepLabel,Button,Typography} from '@material-ui/core';
import {getParametersLimitAll}   from '../../../../../../utils/API';
import {endpoint_parameter_limit_all} from '../../../../../../configs/endpoints';
import {Sidebar} from '../index';
import { default as UploadBatch } from '../UploadBatch';


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

function getSteps() {
  return ['Upload Batch', 'Validate Batch', 'Post Batch'];
}



function getStepContent(step) {
  switch (step) {
    case 0:
      return <UploadBatch/>;
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}


const DetailsView = props => {
  const {className, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();  

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint) => {     
        await  getParametersLimitAll(endpoint)
        .then(response => {                        
          if (mounted) {            
            setValues(response.payload);                 
          }
        });
      })(endpoint_parameter_limit_all); 
      
    return () => {
      mounted = false;
           
    };
  }, []); 

  if (!values) {
    return null;
  } 
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);    
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }; 
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title="Batch Processes - Milking" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
          </Grid> 
          <Grid item xs={11}>
              <Card> 
                <CardContent>                 
                  
                    <div className={classes.inner}>
                      <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                          const stepProps = {};
                          const labelProps = {}; 
                          return (
                            <Step key={label} {...stepProps}>
                              <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                      <div>
                        {activeStep === steps.length ? (
                          <div>
                            <Typography className={classes.instructions}>
                              All steps completed - you&apos;re finished
                            </Typography>            
                          </div>
                        ) : (
                      <div>
                          {getStepContent(activeStep)}                         
                       
                      </div>
                      )}
                    </div>
                  </div>
                 
                </CardContent>
              </Card> 
          </Grid>
        </Grid>
        </CardContent> 
    </Card>
  );
};

DetailsView.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsView;