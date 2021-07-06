import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Tabs, Tab, Divider, colors, Typography } from '@material-ui/core';
import { Page } from 'components';
import { Workflow, Instructions, Downloads } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const Batch = props => {
  const { match, history } = props;
  const classes = useStyles();
  const { tab, uuid, batch_type } = match.params;
  const batchInfo = { uuid: uuid, batch_type: parseInt(batch_type)};
  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'instructions', label: 'Instructions' },
    { value: 'templates', label: 'Data Templates' },
    { value: 'workflow', label: 'Workflow' }
  ];

  if (!tab) {
    return <Redirect to="/batch-processing/instructions" />;
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
        BATCH PROCESSING
      </Typography>
      <br />

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
        {tab === 'instructions' && <Instructions />}
        {tab === 'templates' && <Downloads />}
        {tab === 'workflow' && <Workflow batchInfo={batchInfo} />}
      </div>
    </Page>
  );
};

Batch.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Batch;
