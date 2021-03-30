import React, { useState,useEffect,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal,Card,Grid,TextField,CardContent, CardActions,Button, colors} from '@material-ui/core';
import {genericFunctionFourParameters}   from '../../../../../utils/API';
import {endpoint_animals_by_type} from '../../../../../configs/endpoints';
import authContext from '../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Alert from '@material-ui/lab/Alert';


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
  }
}));

const AnimalModal = props => {
  const { open, onClose, parentType, className, ...rest } = props;
  const classes = useStyles(); 
  const [values, setValues] = useState([]);
  const [data, setData] = useState([]);
  const [ {organization_id}  ] = useContext(authContext);
  const [output, setOutput] = useState({status:null, message:""}); 

  useEffect(() => {           
    let mounted = true;
    setOutput({status:null, message:''});
    setData([]);
    
    (async  (endpoint,desc,org,type) => {     
      await  genericFunctionFourParameters(endpoint,desc,org,type)
      .then(response => {                        
        if (mounted) {            
          setValues(response.payload[0]);                 
        }
      });
    })(endpoint_animals_by_type,'Animal by Type',organization_id,parentType ==='sire'? 5 :2);       
      
    return () => {
      mounted = false;    
    };
  }, [organization_id,parentType]); 

  if (!open || !values) {
    return null;
  }

 

const columns = [
  { name: "animal_id",label: "ID",options: {filter: false,sort: true,display:true}},   
  { name: "tag_id",label: "TAG ID",options: {filter: false,sort: true,display:true}}, 
  { name: "animal_name",label: "NAME",options: {filter: false,sort: true,display:true}}, 
  { name: "DOB",label: "DOB",options: {filter: false,sort: true,display:true}},   
  { name: "main_breed",label: "BREED",options: {filter: false,sort: true,display:true}},
  { name: "sex",label: "SEX",options: {filter: false,sort: true,display:true}},   
  { name: "animalType",label: "TYPE",options: {filter: false,sort: true,display:true}} 
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
 onRowClick: (rowData) => {
  setOutput({status:null, message:''});
  setData([]);
  setData(rowData); 
  },
};

const handleChange = event => {
  event.persist();
  setData({
    ...data,
    [event.target.name]:event.target.type === 'checkbox' ? event.target.checked: event.target.value  
        
  });
};

const handleSubmit =  event => {  
  event.preventDefault(); 
  let id = typeof data[0] === 'undefined' ? '' : data[0];
  parentType ==='sire'?  sessionStorage.setItem('_sire_id',id) : sessionStorage.setItem('_dam_id',id); 
  let _message =  parentType ==='sire'? 'Sire Selected Successfully' : 'Dam Selected Successfully';
  if (id ===''){
    setOutput({status:0, message:"Nothing Was Selected!"});
  } else {
    setOutput({status:1, message:_message});
  }
 
}

const onClear =() =>  { 
  setData([]);
  parentType ==='sire'?  sessionStorage.setItem('_sire_id','') : sessionStorage.setItem('_dam_id',''); 
  let _message =  parentType ==='sire'? 'Sire Cleared Successfully' : 'Dam Cleared Successfully';
  setOutput({status:1, message:_message});
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
                label="ID "
                name = 'id'                
                variant="outlined"
                value = {data[0]}  
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
                label="Tag ID"                               
                variant="outlined"
                value = {data[1]} 
                name = 'tag_id' 
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
                label="Name"                               
                variant="outlined"
                name = 'name' 
                value = {data[2]}  
                onChange={handleChange}
              />

              </Grid>
             
            </Grid> 
            : null 
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
          <Button
             className={classes.saveButton}              
              variant="contained"
              type="submit"
            >
              Confirm
            </Button> 

           
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

AnimalModal.displayName = 'AnimalModal';
AnimalModal.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

AnimalModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default AnimalModal;
