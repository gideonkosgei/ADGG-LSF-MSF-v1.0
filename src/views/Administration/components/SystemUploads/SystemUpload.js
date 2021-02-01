import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import {Header, ProjectCover} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  aboutAuthor: {
    marginTop: theme.spacing(3)
  },
  aboutProject: {
    marginTop: theme.spacing(3)
  },
  projectCover: {
    marginTop: theme.spacing(3)
  },
  projectDetails: {
    marginTop: theme.spacing(3)
  },
  preferences: {
    marginTop: theme.spacing(3)
  },
  actions: {
    marginTop: theme.spacing(3)
  }
}));

const SystemUpload = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Project Create"
    >
      <Header />       
      <ProjectCover className={classes.projectCover} />
    </Page>
  );
};

export default SystemUpload;
