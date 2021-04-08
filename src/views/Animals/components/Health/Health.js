import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Tabs, Tab, Divider, colors,Typography } from '@material-ui/core';
import { Page } from 'components';
import {Injury,ParasiteInfection,HoofHealth,HoofTreatment,Vaccination} from './components';
import {default as Header} from '../Header/index';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
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

const Health = props => {
  const { match, history } = props;
  const classes = useStyles();
  const { tab } = match.params; 
  const animal_tag  = sessionStorage.getItem('animal_tag');
  const animal_name  = sessionStorage.getItem('animal_name');  

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'injury', label: 'Injury'},  
    { value: 'parasite-infection', label: 'Parasite Infection'},
    { value: 'hoof-health', label: 'Hoof Health'}, 
    { value: 'hoof-treatment', label: 'Hoof Treatment'},    
    { value: 'vaccination', label: 'Vaccination'}
  ];
  

  if (!tab) {
    return <Redirect to ="/management/health/injury"/>;
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
       {`HEALTH RECORDS  - ${animal_name}(${animal_tag}) `}
      </Typography>
      <br/>
      <Header />      
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
        {tab === 'injury' && <Injury />}       
        {tab === 'parasite-infection' && <ParasiteInfection />}
        {tab === 'hoof-health' && <HoofHealth />}
        {tab === 'hoof-treatment' && <HoofTreatment />}       
        {tab === 'vaccination' && <Vaccination />}
      </div>
    </Page>
  );
};

Health.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Health;
