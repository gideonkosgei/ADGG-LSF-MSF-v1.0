import React, {useEffect,useState,useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/styles';
import {
  Card,Box,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,Fab,CircularProgress
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {postOrgProfileLogo,genericFunctionFourParameters}   from '../../../../../../utils/API';
import {endpoint_org_profile_logo,endpoint_get_avatar} from '../../../../../../configs/endpoints';
import authContext from '../../../../../../contexts/AuthContext';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';

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
  btn: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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



const ProfileDetails = props => {
  const { profile, className, ...rest } = props;
  const classes = useStyles();  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [output, setOutput] = useState({status:null, message:""}); 
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [fileProps, setFileProps] = useState({ name: null, type: null, size: null }); 
  const [ {user_id,organization_id} ] = useContext(authContext); 
  const timer = React.useRef();
  const type = 1;

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
    })(endpoint_get_avatar,'get avatar',user_id,type); 

    return () => {
      mounted = false;      
    };    
  }, [user_id,type]);  

  
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
    })(endpoint_org_profile_logo,organization_id,formData,user_id,type); 
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
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
        />
        <Typography
          className={classes.name}
          gutterBottom
          variant="h3"
        >
          {profile.name}
        </Typography>       
        
      </CardContent>
      <CardActions>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCameraIcon />}
            className={classes.btn}              
          >
            Change Pic
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
                  type="submit"
                  className={buttonClassname}
                >
                  {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
              </div>
             
            </>
          }
        </Box>       
      </CardActions>
      </form>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object.isRequired
};

export default ProfileDetails;
