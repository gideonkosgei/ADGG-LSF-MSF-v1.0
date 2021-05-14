import React,{useContext,useEffect,useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Hidden } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import authContext from '../../../../contexts/AuthContext';
import greetingText from '../../../../utils/greetingText';
import {genericFunctionFourParameters}   from '../../../../utils/API';
import {endpoint_get_avatar} from '../../../../configs/endpoints';

const useStyles = makeStyles(theme => ({
  root: {},
  summaryButton: {
    backgroundColor: theme.palette.white
  },
  barChartIcon: {
    marginRight: theme.spacing(1)
  },
  image: {
    Media: {
      height: '100%',
      width: '100%'
    }
  }
}));

const Header = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [ {username,organization_id} ] = useContext(authContext);
  const [values, setValues] = useState({ });
  const type = 0;

  useEffect(() => { 
    let mounted = true;
    (async  (endpoint,desc,id,type) => {     
      await  genericFunctionFourParameters(endpoint,desc,id,type)
      .then(response => {                        
        if (mounted) { 
          if (response.payload[0].length !== 0 ) {   
            setValues(response.payload[0][0]); 
          }  
        }
      });
    })(endpoint_get_avatar,'get avatar',organization_id,type); 

    return () => {
      mounted = false;      
    };    
  }, [organization_id,type]);
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="center"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          
          <Typography
            component="h1"
            gutterBottom
            variant="h3"
          >
            {`${greetingText()} ${username}`}
          
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
          >
            Here’s what’s happening on your farm today
          </Typography>
          <Button
            className={classes.summaryButton}
            edge="start"
            variant="contained"
          >
            <BarChartIcon className={classes.barChartIcon} />
            View summary
          </Button>
        </Grid>
        <Hidden smDown>
          {
            typeof values.filename === 'undefined'? null :
          <Grid
            item
            md={6}
          >
            <img
              width ='225'
              height ='225'
              alt=""
              className={classes.image}
              src= {`/images/uploads/${values.filename}`}
            />
          </Grid>
        }
        </Hidden>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
