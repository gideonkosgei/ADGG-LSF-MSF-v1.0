import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Button,Card, CardActions, CardContent, CardHeader, Divider,List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_top_cows} from '../../../../configs/endpoints';
import {getTopCows}   from '../../../../utils/API';

import { GenericMoreButton } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.white
  },
  actions: {
    justifyContent: 'flex-end'
  },
  arrowForwardIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const TopCows = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [topCows, setTopCows] = useState([]);
  const [ { organization_id }  ] = useContext(authContext);
  const start_date = '2020-01-01';
  const end_date = '2020-12-30';
  
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,org_id,start_date,end_date)=>{     
      await  getTopCows(endpoint,org_id,start_date,end_date)
       .then(response => {              
         if (mounted) {
          setTopCows(response.payload);  
          console.log(response.payload);                
         }
       });
     })(endpoint_top_cows,organization_id,start_date,end_date);
    return () => {
      mounted = false;
    };
  }, [organization_id]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="TOP COWS"
      />
      <Divider />
      <CardContent className={classes.content}>
        <List disablePadding>
          {topCows.slice(0,10).map((topCow, i) => (
            <ListItem
              divider={i < topCow.length - 1}
              key={topCow.id}
            >              
              <ListItemText primary={`${topCow.name} (${topCow.tag_id})`} />
              <Typography variant="subtitle2">{`${topCow.total_milk} ltrs`}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          component={RouterLink}
          size="small"
          to="#"
          variant="text"
        >
          See all
          <ArrowForwardIcon className={classes.arrowForwardIcon} />
        </Button>
      </CardActions>
    </Card>
  );
};

TopCows.propTypes = {
  className: PropTypes.string
};

export default TopCows;
