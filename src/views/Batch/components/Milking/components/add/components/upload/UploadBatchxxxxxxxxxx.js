import React,{useState,useEffect,useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles,createStyles } from '@material-ui/styles';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';
import {Card, CardContent,CardHeader,Grid,Divider, TextField,colors,Button,CardActions,Switch,Typography,Box } from '@material-ui/core';
import {postLimitingParameter}   from '../../../../../../utils/API';
import {endpoint_parameter_limit_add} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import {DropzoneArea} from 'material-ui-dropzone'



const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  name: {
    marginTop: theme.spacing(1)
  },
  avatar: {
    height: 100,
    width: 100
  },
  removeBotton: {
    width: '100%'
  }
}));



const UploadBatch = props => {
  const {className, ...rest } = props;
  const classes = useStyles();
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [values, setValues] = useState({ });
  const [ {user_id} ] = useContext(authContext);  

  const handleChange = event => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
          
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    (async  (endpoint,id,values,user_id) => {     
      await  postLimitingParameter(endpoint,id,values,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_parameter_limit_add,values,user_id);    
  };
  
  
  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  

  


  return (

    <Grid container spacing={1} justify="center"> 
    <Grid item xs={11}>
      <Card> 
      <form id ='event' onSubmit={handleSubmit} >      
        <CardContent>

        <Grid
          container
          spacing={4}
        > 
          <Grid
              item
              md={6}
              xs={12}
            >
              <DropzoneArea 
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                previewGridProps={{container: { spacing: 2, direction: 'row' }}}
                previewChipProps={{classes: { root: classes.previewChip } }}
                previewText="."  
                acceptedFiles = {['.csv','.xls','.xlxs']}   
                filesLimit = {1}                  
              />  
          </Grid>       
        </Grid>
    </CardContent>
    <Divider />
    <CardActions>          
    <Button
      className={classes.saveButton}
      type="submit"
      variant="contained"
    >
      Save Details
    </Button>
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
    </Grid>
    </Grid>
  

    

 );
};

UploadBatch.propTypes = {
  className: PropTypes.string  
};

export default UploadBatch;
