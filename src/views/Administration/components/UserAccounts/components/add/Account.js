import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid ,Typography} from '@material-ui/core';
import { ProfileDetails } from './components';
import { Page } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },  
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Account = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  useEffect(() => {  
  }, []);

  return (
    <Page className={classes.root} >
      <Typography
      component="h1"
      variant="h3"
      >
        USER ACCOUNTS
      </Typography>
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
      
    >       
      
      <Grid
        item        
        xs={12}
      >
        <ProfileDetails/>
      </Grid>
    </Grid>
    </Page>
  );
};

Account.propTypes = {
  className: PropTypes.string
};
export default Account;
