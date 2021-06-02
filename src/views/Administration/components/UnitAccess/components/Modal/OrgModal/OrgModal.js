import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Fab,CircularProgress,Modal,Card,Grid,TextField,CardContent,Typography, CardActions,Button,LinearProgress, colors} from '@material-ui/core';
import {genericFunctionFiveParameters,UnitAccessAddRemove}   from '../../../../../../../utils/API';
import {endpoint_unit_access,endpoint_add_remove_unit_access} from '../../../../../../../configs/endpoints';
import authContext from '../../../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Alert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: '40%',
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  details: {
    color: 'green'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
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

const OrgModal = props => {
  const { open, onClose, account_id,username, className,user, ...rest } = props;
  const classes = useStyles(); 
  const [values, setValues] = useState([]);
  const [ {user_id} ] = useContext(authContext);
  const [data, setData] = useState([]); 
  const [notes, setNotes] = useState(''); 
  const [output, setOutput] = useState({status:null, message:""}); 
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
 
   /* 
    unit_type = 0 > org
    unit_type = 1 > farm 
  */ 
    const unit_type = 0;
  /* 
    action = 0 > remove
    action = 1 > add 
  */  

  const action = 1 ;
  /* 
    * display_option = 0 > display allocated units
    * display_option = 1 > display unallocated units
    */
  const display_option = 1 ; 
  
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  async function getallunits(endpoint,desc,user,unit_type,display_option) { 
    setValues([]);    
    await  genericFunctionFiveParameters(endpoint,desc,user,unit_type,display_option)
    .then(response => {  
        setIsLoading(false);          
        setValues(response.payload);     
    });
  };


  useEffect(() => {           
    let mounted = true;
    setOutput({status:null, message:''});
    setData([]);
    setNotes('');
    
    (async  (endpoint,desc,user,unit_type,display_option) => {     
      await  genericFunctionFiveParameters(endpoint,desc,user,unit_type,display_option)
      .then(response => {                        
        if (mounted) {   
          setIsLoading(false);          
          setValues(response.payload);                 
        }
      });
    })(endpoint_unit_access,'org unit access',account_id,unit_type,display_option);      
      
    return () => {
      mounted = false;    
    };
  }, [account_id]); 

  if (!open || !values) {
    return null;
  }
const columns = [
  { name: "id",label: "ID",options: {filter: false,sort: false,display:true}}, 
  { name: "org_name",label: "ORG NAME",options: {filter: false,sort: true,display:true}},
  { name: "country",label: "COUNTRY",options: {filter: true,sort: true,display:true}}
];

const options = {       
  filter: true,
  print: false,
  download: false,
  viewColumns: false,
  rowsPerPage: 5,       
  rowsPerPageOptions :[5,10,20,50,100],
  selectableRows: 'none',      
  filterType: 'checkbox',
  responsive: 'stacked',                
  rowHover: true,       
  setTableProps: () => {
   return {
     padding: "none" ,         
     size: "small",
   };
 },
 textLabels: {
  body: {
      noMatch: isLoading ? 'Loading...':'Sorry, there is no matching records to display',
    },
  },
 onRowClick: (rowData) => {
  setOutput({status:null, message:''});
  setData([]);
  setNotes('');
  setData(rowData);  
  const msg = `Confirming this action will give  ${username} access to the selected org unit `
  setNotes(msg); 
  },
};

const handleChange = event => {
  event.persist();
  setData({
    ...data,
    [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
        
  });
};

const handleSubmit = event => {   
  event.preventDefault();
  if (!loading) {
    setSuccess(false);
    setLoading(true);
  }

  let id = typeof data[0] === 'undefined' ? '' : data[0];  
  if (id ===''){
    setOutput({status:0, message:"Nothing Was Selected!"});
  } else {
    (async  (endpoint,unit_id,account_id,user,unit_type,action) => {     
      await  UnitAccessAddRemove(endpoint,unit_id,account_id,user,unit_type,action)
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
    })(endpoint_add_remove_unit_access,id,account_id,user_id,unit_type,action);    
  }  

};

const onClear =() =>  { 
  setData([]); 
};

const handleClickRefresh = () => {
  getallunits(endpoint_unit_access,'org unit access',account_id,unit_type,display_option);  
  setOutput({status:null, message:''});
  setData([]);
};

  return (
    <Modal
      onClose={onClose}
      open={open}
    >   
         
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >        
        <form  onSubmit={handleSubmit} >        
          <CardContent>
          <Grid container spacing={2} >
            <Grid
              item
              md={10}
              xs={12}
            >
              <Typography
                component="h1"
                gutterBottom
                variant="h3"
              >
                ORG UNIT ASSIGNMENT
              </Typography>
            </Grid> 

            <Grid
              item
              md={2}
              xs={12}
            >
              <Button          
                variant="outlined"
                onClick={handleClickRefresh} 
                style={{
                  marginRight: "10px"          
                }} 
              >
                Refresh
              </Button>

            </Grid> 


          </Grid>

          {output.status === 0 ?
              <>
              <Alert severity="error" >{output.message}</Alert>             
              </>
            :output.status === 1 ?
            <>
            <Alert severity="success" >{output.message}</Alert>           
            </>
            :null
            }          
            <br/>

            {
              data.length > 0 ? 
            <Grid container spacing={2} >
              <Grid
                item
                md={12}
                xs={12}
              >
               
              <Chip label = {notes} />
              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: true                
                }}   
                margin = 'dense'           
                label="ID"                               
                variant="outlined"
                value = {data[0]} 
                name = 'id' 
                onChange={handleChange}
              />

              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: true                
                }}   
                margin = 'dense'           
                label="ORG"                               
                variant="outlined"
                value = {data[1]} 
                name = 'org' 
                onChange={handleChange}
              />

              </Grid>

              <Grid
                item
                md={4}
                xs={12}
              >
                <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }} 
                inputProps={{
                  readOnly: true                
                }}   
                margin = 'dense'           
                label="COUNTRY"                               
                variant="outlined"
                value = {data[2]} 
                name = 'country' 
                onChange={handleChange}
              />

              </Grid>
             
              
              <br/> <br/>
            </Grid> 
           
            : null 
            }
            { isLoading  &&
              <LinearProgress/>
            }  
            <PerfectScrollbar>
              <div className={classes.inner}>
                <MuiThemeProvider>                
                  <MUIDataTable
                    title = ""
                    data={values}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
                </div>
            </PerfectScrollbar>
          </CardContent>
          <CardActions className={classes.actions}>
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
                    Confirm
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div> 

           
            <Button
            className={classes.saveButton}
              onClick={onClear}
              variant="contained"
            >
              Clear
            </Button>
            
           
            <Button
             className={classes.saveButton}
              onClick={onClose}
              variant="contained"
            >
              Close
            </Button>           
          </CardActions>
        </form>
      </Card>
      
    </Modal>
  );
};

OrgModal.displayName = 'OrgModal';
OrgModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  account_id : PropTypes.number.isRequired,
  username : PropTypes.string.isRequired,
  user: PropTypes.number.isRequired  
};

OrgModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default OrgModal;
