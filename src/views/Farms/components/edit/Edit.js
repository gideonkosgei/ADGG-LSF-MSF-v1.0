import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Tabs, Tab, Divider, colors,Typography } from '@material-ui/core';
import { Page } from 'components';
import {Details,Weather,Map} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  tabs: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Edit = props => {
  const { match, history } = props;
  const classes = useStyles();
  const { tab,id,farm_name } = match.params; 

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  //http://lsf.adgg.ilri.org/management/farms/edit/505721

  const tabs = [
    { value: 'details', label: 'Farm Details'},  
    { value: 'map', label: 'Map Details'},
    { value: 'weather', label: 'Weather Details'}
  ];  

  if (!tab) {
    return <Redirect to ="/management/farms/edit/details"/>;
  }

 if (!tabs.find(t => t.value === tab)) {
    return <Redirect to="/errors/error-404" />;
  }

  return (
    <Page
      className={classes.root}     
    >
      <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
       {`FARM : ${farm_name}`}
      </Typography>
      <br/>
      <Tabs
        className={classes.tabs}
        onChange={handleTabsChange}
        scrollButtons="auto"
        value={tab}
        variant="scrollable"
      >
        {tabs.map(tab => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider className={classes.divider} />
      <div className={classes.content}>
        {tab === 'details' && <Details farm_id = {id}/>}       
        {tab === 'map' && <Map farm_id = {id}/>}
        {tab === 'weather' && <Weather farm_id = {id} />}
      </div>
    </Page>
  );
};


Edit.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Edit;
