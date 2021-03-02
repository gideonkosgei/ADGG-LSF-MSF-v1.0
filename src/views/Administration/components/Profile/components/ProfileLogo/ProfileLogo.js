import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardActions,CardHeader, Avatar, Typography, Button,Box,Divider,Switch} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    textAlgin: 'center'
  },
  imageDetails: {
    display: 'flex',
    //alignItems: 'center',
    flexDirection: 'column',
    //textAlgin: 'center'
  },
  name: {
    marginTop: theme.spacing(1)
  },
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  avatar: {
    height: 100,
    width: 100
  },
  removeBotton: {
    width: '100%'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}));



const ProfileLogo = props => {
  const { profile, className, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState({ });
  const [fileProps, setFileProps] = useState({ name: null, type: null, size: null });
  const [changeLogo, setChangeLogo] = useState(false);

  const handleChange = event => {
    event.persist();    
    if (typeof event.target.files[0] !== 'undefined')
    {
      setValues({
        ...values,
        [event.target.name]:event.target.type === 'file' ? event.target.files[0]:event.target.value              
      });      
      setFileProps({ name:event.target.files[0].name, type:event.target.files[0].type, size:event.target.files[0].size})
    }    
};


  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('myImage',event.target.files[0]);   
    /*(async  (endpoint,id,values,user_id,lactation_number) => {     
      await  postCalving(endpoint,id,values,user_id,lactation_number)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setValues({});        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_calving_add,animal_id,values,user_id,lactationNumber);  */  
  };

  const handleSwitchChange = event => {
    event.persist();
    setChangeLogo(!changeLogo); 
    setFileProps({ name:null, type:null, size:null})  
  };
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    > 
    <CardHeader title="Organization / Farm Logo" />
    <Divider />
      <CardContent className={classes.content}>
        <Avatar
          className={classes.avatar}
          src={profile.profile_image}
        />
        <Typography
          className={classes.name}
          gutterBottom
          variant="h3"
        >
          {profile.name}
        </Typography>  
        { !fileProps.name ||  !changeLogo  ? null :

         < div className={classes.name}>
            <Typography className={classes.name} > 
            <b>File Name</b>: {fileProps.name}
            </Typography>  

            <Typography className={classes.name}>
            <b>File Type</b>: {fileProps.type}
            </Typography> 

            <Typography className={classes.name}>
            <b>File size</b>: {(fileProps.size/1048576).toFixed(2)} MB
            </Typography> 
        </div>
      }
       
      </CardContent>
      <CardActions> 
      <form onSubmit={handleSubmit} >
        <Box> 
          <Typography variant="h6">{ changeLogo? "Cancel logo change" : "Change logo"} </Typography> 
        </Box> 
        <Box> 
          <Switch             
            className={classes.toggle}            
            checked={values.changeLogo}
            color="secondary"
            edge="start"               
            onChange={handleSwitchChange}
          />             
         </Box>  
         { changeLogo ? 
     
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCameraIcon />}
              className={classes.btn}
            >
              Select
              <input
                type="file"
                name="myImage"
                hidden
                onChange={handleChange}
              />
          </Button>  
            {
              !fileProps.name ? null :
              <Button
                variant="contained"
                component="label"
                startIcon={<SaveIcon />}
                className={classes.btn}
              >
                Save
                <input
                  type="file"
                  name="myImage"
                  hidden
                  onChange={handleChange}                       
                />
              </Button> 
        }
        </Box>
        : null 
      }
      </form>  
      </CardActions>
    </Card>
  );
};

ProfileLogo.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};
export default ProfileLogo;
