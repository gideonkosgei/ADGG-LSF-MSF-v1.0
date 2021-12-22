import React,{useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import authContext from '../../contexts/AuthContext';
import { Page } from 'components';
import {
  Header,
  Statistics,
  Todos 
} from './components';

const useStyles = makeStyles(theme => ({
  root: {   
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  statistics: {
    marginTop: theme.spacing(3)
  },
  notifications: {
    marginTop: theme.spacing(6)
  },
  projects: {
    marginTop: theme.spacing(6)
  },
  todos: {
    marginTop: theme.spacing(6)
  }
}));

const Overview = () => {
  const classes = useStyles();
  const [ { organization_id }  ] = useContext(authContext); 
  const level = 0;
  /*
  level 0 -> summary at org level
  level 1 -> summary at herd level
  */

  return (
    <Page
      className={classes.root}
      title="Overview"
    >
      <Header />
      <Statistics className={classes.statistics} org = {parseInt(organization_id)} level = {level} herd = {null} /> 
      <br/> <br/>
      <Todos/>
    </Page>
  );
};
export default Overview;
