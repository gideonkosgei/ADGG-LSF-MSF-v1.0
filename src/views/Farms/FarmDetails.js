import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Divider, colors } from '@material-ui/core';
import { Page } from 'components';
import { Header, Summary} from './components';
import {endpoint_farm_details} from '../../configs/endpoints';
import {getFarmDetails}   from '../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {
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

const FarmDetails = props => {  
  const classes = useStyles();
  const [farmDetails, setFarmDetails] = useState();
  const farm_id = 1;
  useEffect(() => {
    let mounted = true;
    (async  (endpoint,id) => {
      await  getFarmDetails(endpoint,id)
      .then(response => {      
        if (mounted) {          
          setFarmDetails(response.payload[0]);
        }
      });
    })(endpoint_farm_details,farm_id);  

    return () => {
      mounted = false;
    };
  }, []);

  if (!farmDetails) {
    return null;
  }
 return (
    <Page
      className={classes.root}
      title="Farm Details"
    >
      <Header farmDetails = {farmDetails}/>        
      <Divider className={classes.divider} />
      <div className={classes.content}>
        <Summary  farmDetails = {farmDetails}/>
      </div>
    </Page>
  );
};

export default FarmDetails;
