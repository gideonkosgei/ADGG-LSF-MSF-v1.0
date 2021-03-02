import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  removeBotton: {
    width: '100%'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}));



const ProfileDetails = props => {
  const { profile, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Avatar
          className={classes.avatar}
          src={profile.profile_image}
        />
        <Typography
          className={classes.name}
          gutterBottom
          variant="h3"
        >
          {profile.name}
        </Typography>       
        
      </CardContent>
      <CardActions>
        <Button        
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<PhotoCameraIcon />}
        >
          Change profile picture
        </Button>
      </CardActions>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;
