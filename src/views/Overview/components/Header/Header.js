import React,{useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Button, Hidden } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import authContext from '../../../../contexts/AuthContext';
import greetingText from '../../../../utils/greetingText';


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
  const [ {username} ] = useContext(authContext); 

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
          <Grid
            item
            md={6}
          >
            <img
              alt="Cover"
              className={classes.image}
              src="/images/kalro.jpg"
            />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
