import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Stepper,Step,StepLabel,Typography} from '@material-ui/core';
import {getBatchMilkingValidation}   from '../../../../../../utils/API';
import {endpoint_batch_milk_validation_view} from '../../../../../../configs/endpoints';
import {Sidebar} from '../../../sidebar/index';
import {Upload,Validate} from './components';


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



function getStepContent(step,records) {
  switch (step) {
    case 0:
      return <Upload/>;      
    case 1:
      return <Validate UploadedRecords={records}/>;
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
};

const AddDetails = props => {
  const {className,batch_uuid, ...rest } = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  
  var batch_upload_uuid = localStorage.getItem("batch_upload_uuid"); 

  useEffect(() => {     
    let mounted = true;
      (async  (endpoint,batch_uuid) => {     
        await  getBatchMilkingValidation(endpoint,batch_uuid)
        .then(response => {                             
          if (mounted) { 
            if(response.payload.length>0){                       
              setValues(response.payload); 
              setActiveStep(response.payload[0].step_id); 
            }              
          }
        });
      })(endpoint_batch_milk_validation_view,batch_upload_uuid);       
    return () => {
      mounted = false;           
    };
  }, [batch_upload_uuid]); 

  if (!values) {
    return null;
  } 



  
  /*const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);    
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }; */
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
                          {getStepContent(activeStep,values)}                         
                       
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

AddDetails.propTypes = {
  className: PropTypes.string 
};

export default AddDetails;