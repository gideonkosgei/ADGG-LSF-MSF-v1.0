import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card,Checkbox,List,ListItem,ListItemIcon,ListItemText, CardContent, CardHeader, Grid,Divider,colors,Button,CardActions,Box} from '@material-ui/core';
import {getOrgAccess,putOrgAccess}   from '../../../../../../utils/API';
import {endpoint_orgs_access,endpoint_orgs_access_update} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
 
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
  const [ {user_id} ] = useContext(authContext);
  const classes = useStyles(); 
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  
  const user_record_id  = localStorage.getItem('user_record_id');
  const user_name_org  = localStorage.getItem('user_name_org');  

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


  useEffect(() => {    
    let mounted_orgs = true;   
    
      (async  (endpoint,user_id) => {     
        await  getOrgAccess(endpoint,user_id)
        .then(response => {       
          if (mounted_orgs) { 
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
      })(endpoint_orgs_access,user_record_id);
 
    return () => {      
      mounted_orgs = false;      
    };    
  }, [user_record_id]);  

  if ( !left || !right ) {
    return null;
  }

  const handleSubmit = event => {
    event.preventDefault();    
    (async  (endpoint,values,record_id,user_id) => {     
      await  putOrgAccess(endpoint,values,record_id,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true);         
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_orgs_access_update,right,user_record_id,user_id);  
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
        <CardHeader title= { `Organization Access - ${user_name_org}`} />
        <Divider />
        <form  onSubmit={handleSubmit} >
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
      <Grid item>{customList('HAS ACCESS', right)}</Grid>
       </Grid>
       </CardContent> 
       <CardActions>
          <Box flexGrow={2}>                                  
              <Button
                className={classes.saveButton}
                type="submit"
                variant="contained"
                hidden = "true"                               
              >
                Save Changes
              </Button>                
          </Box> 
        </CardActions>
       </form> 
       <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
        />
        <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
        />
    </Card>
  );
};

DetailsEdit.propTypes = {
  className: PropTypes.string  
};
export default DetailsEdit;