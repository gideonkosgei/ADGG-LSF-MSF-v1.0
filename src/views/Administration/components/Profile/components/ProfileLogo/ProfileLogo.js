import React, {useEffect,useState,useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';
import {Card, CardActions  , CardContent,CardHeader, Avatar, Typography, Button,Box,Divider,Switch} from '@material-ui/core';
import {postOrgProfileLogo}   from '../../../../../../utils/API';
import {endpoint_org_profile_logo} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import SuccessSnackbar from '../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../components/ErrorSnackbar';

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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [fileProps, setFileProps] = useState({ name: null, type: null, size: null });
  const [changeLogo, setChangeLogo] = useState(false);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id} ] = useContext(authContext); 
 
  useEffect(() => { 
  }, []);

  const handleChange = event => {
    event.persist();    
    if (event.target.files.length) {
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0]
      });
      setFileProps({ name:event.target.files[0].name, type:event.target.files[0].type, size:event.target.files[0].size})
    }        
  };  

  const handleSubmit = event => {
    event.preventDefault();    
    const formData = new FormData();
    formData.append("image", image.raw);    

    (async  (endpoint,org_id,formData,user_id) => {     
      await  postOrgProfileLogo(endpoint,org_id,formData,user_id)
      .then(() => {  
        setopenSnackbarSuccess(true); 
        setImage({ preview: "", raw: "" });        
        document.forms["event"].reset();
      }).catch(() => {
        setopenSnackbarError(true); 
      });
    })(endpoint_org_profile_logo,organization_id,image.raw,user_id);
  };

  const handleSwitchChange = event => {
    event.persist();
    setChangeLogo(!changeLogo); 
    setFileProps({ name:null, type:null, size:null})  
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
    <CardHeader title="Organization / Farm Logo" />
    <Divider />  
    <form id ='event' onSubmit={handleSubmit} >
      <CardContent className={classes.content}>
        <Avatar
          className={classes.avatar}
          src={image.preview}
          //src={profile.profile_image}          
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


        <Box flexWrap="wrap"> 
          <Typography variant="h6">{ changeLogo? "Cancel logo change" : "Change logo"} </Typography> 
        </Box> 
        <br/>
        <Box style={{marginLeft:10}}> 
          <Switch             
            className={classes.toggle}  
            color="secondary"
            edge="start"               
            onChange={handleSwitchChange}
          />             
         </Box> 
         <CardActions>  
       
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
                className={classes.btn}
                type = "submit"
                variant="contained"               
                startIcon={<SaveIcon />}
              >
                Save  
              </Button> 
        }
        </Box>
        : null 
      }

</CardActions>  
      <SuccessSnackbar
          onClose={handleSnackbarSuccessClose}
          open={openSnackbarSuccess}
      />
      <ErrorSnackbar
          onClose={handleSnackbarErrorClose}
          open={openSnackbarError}
      />
         </CardContent>
    </form>
    </Card>
  );
};

ProfileLogo.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};
export default ProfileLogo;
