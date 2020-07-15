import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions } from '@material-ui/core';
import {getLookups,postWeight}   from '../../../../../../../utils/API';
import {endpoint_lookup,endpoint_weight_add} from '../../../../../../../configs/endpoints';
import authContext from '../../../../../../../contexts/AuthContext';
import {Sidebar} from '../../index';
import {default as ChartBodyWeightOverTime} from './ChartBodyWeightOverTime';
import {default as ChartBodyLengthOverTime} from './ChartBodyLengthOverTime';
import {default as ChartHeartGirthOverTime} from './ChartHeartGirthOverTime';


import SuccessSnackbar from '../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../components/ErrorSnackbar';

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

const ChartDetails = props => {
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [body_scores, setBodyScores] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  
 

  useEffect(() => {   
    let mounted_lookup = true;
    (async  (endpoint,id) => {     
        await  getLookups(endpoint,id)
        .then(response => {       
          if (mounted_lookup) { 
            const data = response.payload[0];            
            let lookup_body_scores = [];
            for (let i = 0; i< data.length; i++){              
              //Body Score
              if(data[i].list_type_id === 71){                
                lookup_body_scores.push(data[i]);
              } 
            }             
            setBodyScores(lookup_body_scores);
          }
        });
      })(endpoint_lookup,'71');

    return () => {
      mounted_lookup = false;     
    };
  }, []); 

  if (!body_scores) {
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
    (async  (endpoint,id) => {     
      await  postWeight(endpoint,animal_id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_weight_add,animal_id,values,user_id);    
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
        <CardHeader title="Weight & Growth Performance Charts" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
                    

            <Grid container spacing={1} justify="center">
              <Grid item  xs={12} >  
                <ChartBodyWeightOverTime/>
              </Grid>
              <Grid item  xs={12} >  
                <ChartBodyLengthOverTime/>
              </Grid>
              <Grid item  xs={12} >  
                <ChartHeartGirthOverTime/>
              </Grid>  
            </Grid> 

         </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};


ChartDetails.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default ChartDetails;