import React, {useEffect,useState,useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';
import {Card, CardActions ,Fab,CircularProgress, CardContent,CardHeader, Avatar, Typography, Button,Box,Divider,Switch} from '@material-ui/core';
import {postOrgProfileLogo,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_org_profile_logo,endpoint_get_avatar} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import { green } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';

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
    flexDirection: 'column'    
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
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

const ProfileLogo = props => {
  const { profile, className, ...rest } = props;
  const classes = useStyles(); 
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [fileProps, setFileProps] = useState({ name: null, type: null, size: null });
  const [changeLogo, setChangeLogo] = useState(false); 
  const [ {user_id,organization_id} ] = useContext(authContext); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();
  const type = 0;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  }); 
 
  useEffect(() => { 
    let mounted = true;
    (async  (endpoint,desc,id,type) => {     
      await  genericFunctionFourParameters(endpoint,desc,id,type)
      .then(response => {                        
        if (mounted) { 
          if (response.payload[0].length !== 0 ) {   
            setImage({
            preview: `/images/uploads/${response.payload[0][0].filename}`,          
            raw: null
           });
          } 
        }
      });
    })(endpoint_get_avatar,'get avatar',organization_id,type); 
    return () => {
      mounted = false;      
    };    
  }, [organization_id,type]);  
  
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
    formData.append('image', image.raw); 
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }   

    (async  (endpoint,org_id,form_data,user_id,type) => {     
      await  postOrgProfileLogo(endpoint,org_id,form_data,user_id,type)
      .then((response) => {  
        setOutput({status:null, message:''});      
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);          
          if (parseInt(response.status) === 1){               
            setOutput({status:parseInt(response.status), message:response.message}) 
          } else {
            setOutput({status:parseInt(response.status), message:response.message})
          } 
        }, 500);                      
    }).catch((error) => {
      setOutput({status:0, message:error.message})
      setSuccess(false);
      setLoading(false);
    });
    })(endpoint_org_profile_logo,organization_id,formData,user_id,0); 
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
    <form id ='event' onSubmit={handleSubmit} >
      <CardContent className={classes.content}>
        {output.status === 0 ?
          <>
          <Alert severity="error" >{output.message}</Alert>        
          <br/>      
          </>
          :output.status === 1 ?
          <>
          <Alert severity="success" >{output.message}</Alert>  
          <br/>          
          </>
          :null
        }          
        <br/> 
        <Avatar
          className={classes.avatar}
          src={image.preview} 
                
          variant="rounded"         
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
                name="image"
                accept = "image/*"
                multiple = {false}
                hidden
                onChange={handleChange}
              />
          </Button>  
            {
              !fileProps.name ? null :
              <>    
                <div className={classes.wrapper}>
                  <Fab
                    aria-label="save"
                    color="primary"
                    className={buttonClassname}
                  >
                    {success ? <CheckIcon /> : <SaveIcon />}
                  </Fab>
                  {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                </div>
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={buttonClassname}
                    disabled={loading}                
                    type="submit"
                  >
                    Save Changes
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </>


              
        }
        </Box>
        : null 
      }

</CardActions>  
     
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
