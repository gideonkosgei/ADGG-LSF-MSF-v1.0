import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader,Typography,Grid} from '@material-ui/core';
import {endpoint_parity} from '../../../../../../configs/endpoints';
import {getParity}   from '../../../../../../utils/API';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
  },
  item: {
    padding: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  overline: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.white
  },
  actions: {
    justifyContent: 'flex-end'
  },
  
}));

const Parity = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const animal_id  = localStorage.getItem('animal_id');
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,animal_id)=>{     
      await  getParity(endpoint,animal_id)
       .then(response => {              
         if (mounted) {
          setValues(response.payload[0]);                           
         }
       });
     })(endpoint_parity,animal_id);
    return () => {
      mounted = false;
    };
  }, [animal_id]);

  if (!values) {
    return null;
  }
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader        
        title="PARITY"
      />
     
      <CardContent className={classes.content}>
      <Grid
        alignItems="center"
        container
        justify="space-between"
      >
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        > 
        <Typography variant="h2">
          {values.parity}
        </Typography>                         
        </Grid>
        </Grid>
      </CardContent>      
    </Card>    
  );
};
Parity.propTypes = {
  className: PropTypes.string
};
export default Parity;
