import React, { useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import authContext from '../../contexts/AuthContext';
import { Redirect } from 'react-router-dom';
import { Page } from 'components';
import {
  Header,
  FAQ,
  PluginsSupport,
  SourceFiles,
  UserFlows
} from './components';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Presentation = () => {
  const classes = useStyles();
  const [ { isLoggedIn} ] = useContext(authContext);
  //console.log(isLoggedIn);

  return (
    <Page
      className={classes.root}
      title="Presentation"
    >  
      {(isLoggedIn)? "":<Redirect to="/presentation" />}
      <Header />
      <UserFlows />
      <PluginsSupport />
      <SourceFiles />
      <FAQ />
    </Page>
  );
};

export default Presentation;
