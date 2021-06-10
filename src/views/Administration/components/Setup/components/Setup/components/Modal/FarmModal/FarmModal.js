import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Fab,CircularProgress,Modal,Card,Grid,TextField,CardContent,Typography, CardActions,Button,LinearProgress, colors} from '@material-ui/core';
import {genericFunctionFourParameters,putOrgFarmAllocation}   from '../../../../../../../../../utils/API';
import {endpoint_farms,endpoint_org_farm_alloc} from '../../../../../../../../../configs/endpoints';
import authContext from '../../../../../../../../../contexts/AuthContext';
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
    width: '70%',
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

const FarmModal = props => {
  const { open, onClose, Details, className, ...rest } = props;
  const classes = useStyles(); 
  const [values, setValues] = useState([]);
  const [ {user_id} ] = useContext(authContext);
  const [data, setData] = useState([]); 
  const [notes, setNotes] = useState(''); 
  const [output, setOutput] = useState({status:null, message:""}); 
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const option  =  2;
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });


  useEffect(() => {           
    let mounted = true;
    setOutput({status:null, message:''});
    setData([]);
    setNotes('');
    
    (async  (endpoint,desc,option,id) => {     
      await  genericFunctionFourParameters(endpoint,desc,option,id)
      .then(response => {                        
        if (mounted) {            
          setValues(response.payload[0]); 
          setIsLoading(false);                  
        }
      });
    })(endpoint_farms,'get all farms',option,user_id);       
      
    return () => {
      mounted = false;    
    };
  }, [user_id]); 

  if (!open || !values) {
    return null;
  }
const columns = [
  { name: "id",label: "ID",options: {filter: false,sort: false,display:true}},   
  { name: "name",label: "FARM NAME",options: {filter: false,sort: true,display:true}},
  { name: "farmer_name",label: "FARMER NAME",options: {filter: false,sort: true,display:true}},
  { name: "code",label: "FARM CODE",options: {filter: false,sort: false,display:true}},
  { name: "org_name",label: "ORG NAME",options: {filter: true,sort: true,display:true}},
  { name: "farm_type",label: "FARM TYPE",options: {filter: true,sort: true,display:true}}, 
  { name: "phone",label: "PHONE",options: {filter: false,sort: true,display:true}},
  { name: "email",label: "EMAIL",options: {filter: false,sort: true,display:true}},
  { name: "country",label: "COUNTRY",options: {filter: true,sort: true,display:true}},    
  { name: "reg_date",label: "REG DATE",options: {filter: false,sort: false,display:true}}, 
  { name: "org_id",label: "ORG ID",options: {filter: false,sort: false,display:false}}, 
];

const options = {       
  filter: true,
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
  const msg = isNaN(parseInt(rowData[10])) ? `Confirming this action will move this farm & all its animals to ${Details.org_name}` :`This farm already belongs to ${rowData[4]}. Confirming this action will move this farm & all its animals to ${Details.org_name}`
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

    (async  (endpoint,org,farm,user) => {     
      await  putOrgFarmAllocation(endpoint,org,farm,user)
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
    })(endpoint_org_farm_alloc,Details.id,data[0],user_id);    
  }  

};

const onClear =() =>  { 
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
              md={12}
              xs={12}
            >
              <Typography
                component="h1"
                gutterBottom
                variant="h3"
              >
                FARM LINKING
              </Typography>

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
                md={3}
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
                label = "Farm Name"
                name = 'farm_name'                
                variant="outlined"
                value = {data[1]}  
                onChange={handleChange}
              />
              </Grid>
              <Grid
                item
                md={3}
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
                label="Farmer Name"                               
                variant="outlined"
                value = {data[2]} 
                name = 'farmer_name' 
                onChange={handleChange}
              />

              </Grid>
              <Grid
                item
                md={3}
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
                label="Farm Code"                               
                variant="outlined"
                name = 'farm_code' 
                value = {data[3]}  
                onChange={handleChange}
              />

              </Grid>
              <Grid
                item
                md={3}
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
                label="Farm Type"                               
                variant="outlined"
                value = {data[5]} 
                name = 'farm_type' 
                onChange={handleChange}
              />

              </Grid>
              <Grid
                item
                md={3}
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
                label="Country"                               
                variant="outlined"
                value = {data[8]} 
                name = 'country' 
                onChange={handleChange}
              />

              </Grid>
              <Grid
                item
                md={3}
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
                label="Org Name"                               
                variant="outlined"
                value = {data[4]} 
                name = 'org' 
                onChange={handleChange}
              />

              </Grid>
              <Grid
                item
                md={3}
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
                label="Phone Number"                               
                variant="outlined"
                value = {data[6]} 
                name = 'phone' 
                onChange={handleChange}
              />

              </Grid>

              <Grid
                item
                md={3}
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
                label="Email Address"                               
                variant="outlined"
                value = {data[7]} 
                name = 'email' 
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
                    title = "All FARMS"
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

FarmModal.displayName = 'FarmModal';
FarmModal.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

FarmModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default FarmModal;
