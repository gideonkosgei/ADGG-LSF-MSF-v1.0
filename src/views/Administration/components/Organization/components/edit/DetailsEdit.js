import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Checkbox,List,ListItem,ListItemIcon,ListItemText, CardContent, CardHeader, Grid,Divider, TextField,colors,Button,CardActions,Typography,Box,Switch,Tooltip} from '@material-ui/core';
import {getOrgAccess,getServiceProviders,putAgents,getAgents}   from '../../../../../../utils/API';
import {endpoint_orgs_access,endpoint_service_provider,endpoint_agent_edit,endpoint_agent} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {Sidebar} from '../index';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {MetaData}  from '../Modal';
 
const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 300,
    height: 250,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const DetailsEdit = props => {
  const {className, ...rest } = props; 
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {organization_id,user_id} ] = useContext(authContext);
  const classes = useStyles();
  const [values, setValues] = useState({ });  
  const [affiliates, setAffiliates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [openMetadata, setMetadata] = useState(false); 
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([4, 5, 6, 7]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  
  const customList = (title, items) => (      
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">      
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={`${value.name}`} primary={` ${value.name}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const agent_id  = localStorage.getItem('agent_id');   

  useEffect(() => {    
    let mounted_countries = true;
    let mounted_affiliates = true;
    let mounted_agents = true;
    
    

    (async  (endpoint,org_id,option) => {     
      await  getServiceProviders(endpoint,org_id,option)
      .then(response => {                        
        if (mounted_affiliates) {            
          setAffiliates(response.payload);                 
        }
      });
    })(endpoint_service_provider,organization_id,0);  
    
    
    
   
    
      (async  (endpoint,user_id) => {     
        await  getOrgAccess(endpoint,user_id)
        .then(response => {       
          if (mounted_countries) { 
            const data = response.payload;
            let orgs_selected = [];
            let orgs_not_selected = [];

          for (let i = 0; i<data.length; i++){
            if (data[i].status === 1){
              orgs_selected.push(data[i]);
            }
          }

          for (let i = 0; i<data.length; i++){
            if (data[i].status === 0){
              orgs_not_selected.push(data[i]);
            }
          }       
            setLeft(orgs_not_selected);   
            setRight(orgs_selected);            
          }
        });
      })(endpoint_orgs_access,user_id);
 
    return () => {      
      mounted_countries = false; 
      mounted_affiliates = false; 
      mounted_agents = false;
    };    
  }, [organization_id,user_id]);  

  if (!affiliates || !countries || !values ) {
    return null;
  }


    const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };
 

  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,values,user_id,id) => {     
      await  putAgents(endpoint,values,user_id,id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_agent_edit,values,user_id,agent_id);    
  };
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };
  const handleSwitchChange = event => {
    event.persist();
    setReadOnly(!readOnly);   
  };

  const handleMetadataOpen = () => {
    setMetadata(true);
  };
  const handleMetadataClose = () => {
    setMetadata(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title= { readOnly ? `Organization Access -  #${agent_id}`:`Organization Access #${agent_id}` } />
        <Divider />
        <CardContent> 

        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <Grid item>{customList('NO ACCESS', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('HAVE ACCESS', right)}</Grid>
       </Grid>
       </CardContent>               
        
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string,
  //profile: PropTypes.object.isRequired
};

export default DetailsEdit;