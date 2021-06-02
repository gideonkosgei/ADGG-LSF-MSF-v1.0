import React, { useState,useEffect,useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Grid,Divider,Button,colors,Typography,Card,CardContent,LinearProgress} from '@material-ui/core';
import { Page } from 'components';
import {genericFunctionFiveParameters,UnitAccessAddRemove}   from '../../../../../../utils/API';
import {endpoint_unit_access,endpoint_add_remove_unit_access} from '../../../../../../configs/endpoints';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {OrgModal}  from '../Modal';
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import Alert from '@material-ui/lab/Alert';
import authContext from '../../../../../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto'   
  },
  inner: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto'    
  },
  divider: {
    backgroundColor: colors.grey[300]
  }, 
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const Org = props => {  
  const {UserDetails} = props; 
  const classes = useStyles();  
  const [values, setValues] = useState([]);
  const [selectedRowData, SetSelectedRows] = useState([]);  
  const [ {user_id} ] = useContext(authContext); 
  const [isLoading, setIsLoading] = useState(true);
  const [farmModalToggle, setOrgModalToggle] = useState(null);
  const [output, setOutput] = useState({status:null, message:""}); 
  const timer = React.useRef();
  const account_id = UserDetails.id;  
  /* 
    unit_type = 0 > org
    unit_type = 1 > farm 
  */ 
  const unit_type = 0;

  /* 
    action = 0 > remove
    action = 1 > add 
  */  

  const action = 0 ;
  /* 
   * display_option = 0 > display allocated units
   * display_option = 1 > display unallocated units
   */
  const display_option = 0 ; 

  async function getallunits(endpoint,desc,user,unit_type,display_option) { 
    setValues([]);    
    await  genericFunctionFiveParameters(endpoint,desc,user,unit_type,display_option)
    .then(response => {  
        setIsLoading(false);          
        setValues(response.payload);     
    });
  };

  async function remove_access(endpoint,data_array,account_id,user,unit_type,action) {
    /*
     * unit_type = 0 -> org units
     * unit_type = 1 -> farm units
     */
    setIsLoading(true);
    let ids_array = [];

    for (let x = 0 ; x<data_array.length; x++ ){
      ids_array.push(data_array[x].id);
    } 

    await  UnitAccessAddRemove(endpoint,ids_array,account_id,user,unit_type,action)
    .then(response => {     
      setOutput({status:null, message:''});
      timer.current = window.setTimeout(() => {
        setIsLoading(false);
        if (parseInt(response.status) === 1){               
          setOutput({status:parseInt(response.status), message:response.message}) 
        } else {
          setOutput({status:parseInt(response.status), message:response.message})
        } 
      }, 500); 
    }).catch((error) => {        
      setOutput({status:0, message:error.message}); 
      setIsLoading(false);         
    });      
  };

  useEffect(() => {     
    let mounted = true;   
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

  if (!values) {
    return null;
  } 

  const columns = [
    { name: "id",label: "ID",options: {filter: false,sort: false,display:false}},   
    { name: "org_name",label: "ORG NAME",options: {filter: false,sort: true,display:true}},      
    { name: "country",label: "COUNTRY",options: {filter: true,sort: true,display:true}}    
  ]; 
      
  const options = {       
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    search: true,
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],   
    selectableRows: "multiple",  
    selectableRowsHeader: true,       
    filterType: 'checkbox',
    responsive: 'stacked',                
    rowHover: true,     
    onRowsSelect: (rowsSelected, allRows) => {
      const data = [];    
      allRows.forEach(row => {
        data.push(values[row.dataIndex]);      
      });         
      SetSelectedRows(data);
   },  
    setTableProps: () => {
     return {
       padding: "none" ,         
       size: "small",
     };
   },
   customToolbarSelect: selectedRows => (    
    <Tooltip title="remove access">
      <IconButton
        onClick={() => {    
          remove_access(endpoint_add_remove_unit_access,selectedRowData,account_id,user_id,unit_type,action);
        }} 
        style={{
          marginRight: "24px"          
        }}      
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  ) 
  };

  const handleClose = () => {
    setOrgModalToggle(false);
  };

  const handleClickAddFarm = () => {
    setOrgModalToggle(true);   
  };

  const handleClickRefresh = () => {
    getallunits(endpoint_unit_access,'org unit access',account_id,unit_type,display_option);  
    setOutput({status:null, message:''});
  };
  
  return (
    <Page
      className={classes.root}
      title="farms"
    >
      <Typography
        component="h1"
        variant="h3"
      >
        ORG  UNIT ACCESS 
      </Typography>
      <Divider /> 
      <br/>
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Button
          
            variant="outlined"
            onClick={handleClickAddFarm} 
          >
            Add
          </Button>

          <Button          
          variant="outlined"
          onClick={handleClickRefresh} 
          style={{
            marginLeft: "10px"          
          }} 
        >
          Refresh
        </Button>
        <br/> <br/>
        <Typography variant="h6">Important Note(s)</Typography>
        <Typography variant="body2">
          Removing org unit(s) access will also automatically remove 
          access to linked farm units(s) 
        </Typography>
        
        </Grid>
      </Grid>

      <br/>
      { isLoading  &&
        <LinearProgress/>
      } 
      <Divider />         
      <Grid container spacing={1} justify="center">  
        <Grid item xs={12}> 
          <Card>
            <CardContent>  
              {output.status === 0 ?
                <>
                  <Alert severity="error" >{output.message}</Alert>
                  <br/><br/>
                </>
              :output.status === 1 ?
              <>
                <Alert severity="success" >{output.message}</Alert>
                <br/><br/>
              </>
                :null
              }                          
              <PerfectScrollbar>                
                <MuiThemeProvider>                
                  <MUIDataTable
                    title = ""
                    data={values}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>                
              </PerfectScrollbar>   
            </CardContent> 
              <OrgModal         
                onClose = {handleClose}
                open = {farmModalToggle}
                account_id = {account_id}
                user = {user_id}
                username  = {UserDetails.name}
              />  
          </Card>            
        </Grid>
      </Grid>
    </Page>
  );
};

Org.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  UserDetails : PropTypes.object.isRequired
};

export default Org;
