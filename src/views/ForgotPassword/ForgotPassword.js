import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardMedia,Typography, Divider, Avatar} from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import gradients from 'utils/gradients';
import { Page } from 'components';
import { ForgotPasswordForm } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 2)
  },
  card: {
    width: theme.breakpoints.values.md,
    maxWidth: '100%',
    overflow: 'unset',
    display: 'flex',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%'
    }
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4)
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  icon: {
    backgroundImage: gradients.orange,
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
    fontSize: 32
  },
  back: {    
    height: 25,
    width: 25    
  },
  ForgotPasswordForm: {
    marginTop: theme.spacing(3)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  person: {
    marginTop: theme.spacing(2),
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const ForgotPassword = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Forgot Password"
    >
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <LockOpenIcon className={classes.icon} />
          <Typography
            gutterBottom
            variant="h3"
          >
            Request Password Reset
          </Typography>
          <Typography variant="subtitle2">
            Enter Email Address For Request Validation
          </Typography>
          <ForgotPasswordForm className={classes.ForgotPasswordForm} />
          <Divider className={classes.divider} />
          
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<ArrowBackIosIcon />}
              component={RouterLink}
               to="/auth/login"
            >
              Back To Login
            </Button>
        
        </CardContent>
        <CardMedia
          className={classes.media}
          image="/images/auth.jpg"
          title="Cover"
        >
          <div className={classes.person}>
            <Avatar
              alt="Person"
              className={classes.avatar}
              src="/images/adgg_avatar.png"          
            />
            <div>
              <Typography
                color="inherit"
                variant="body1"
              >
                ADGG v1.0
              </Typography>
              <Typography
                color="inherit"
                variant="body2"
              >
                More Productive & Profitable Dairy Cows
              </Typography>
            </div>
          </div>
         
        </CardMedia>
      </Card>
    </Page>
  );
};
export default ForgotPassword;
