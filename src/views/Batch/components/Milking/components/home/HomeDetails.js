import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider, TextField,colors} from '@material-ui/core';

import {Sidebar} from '../../../sidebar/index';

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

const HomeDetails = props => {
  const {className, ...rest } = props; 
  const classes = useStyles(); 
  localStorage.removeItem('batch_upload_uuid');
  
   
  useEffect(() => {    
  },[]);
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
        <CardHeader title= "Batch processes - Milk Records Upload" />
        <Divider />
        <CardContent> 
          <Grid container spacing={1} justify="center">            
          <Grid item  xs={1} >  
            <Sidebar/>
         </Grid> 
          <Grid item xs={11}>
            <Card> 
          
              <CardContent>        
              <Grid
                container
                spacing={4}
              >               
              <Grid
                    item
                    md={3}
                    xs={12}
                  >
                  <TextField
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      readOnly: true,
                      disabled: true                
                    }}
                    margin = 'dense'
                    label="Category"
                    name="category"
                    variant="outlined" 
                    required                                     
                />
              </Grid>             
             
         
              </Grid>
          </CardContent> 
          </Card>
          </Grid>
          </Grid>
        </CardContent>               
        
    </Card>
  );
};

HomeDetails.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default HomeDetails;