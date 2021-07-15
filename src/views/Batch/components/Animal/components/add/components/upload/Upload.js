import React,{useState,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {ExcelRenderer} from 'react-excel-renderer';
import { makeStyles} from '@material-ui/styles';
import {Card, CardContent,Grid,Divider,Button,CardActions,Input} from '@material-ui/core';
import authContext from '../../../../../../../../contexts/AuthContext';
import {postBatchUpload}   from '../../../../../../../../utils/API';
import {endpoint_batch_animal_upload} from '../../../../../../../../configs/endpoints';
import './style/app.css';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import uuid from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

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

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        backgroundColor: "#FFF",
        width: "125px"
      }
    }
  }
});


const Upload = props => {
  const {className, ...rest } = props;
  const classes = useStyles(); 
 
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);
  const [ {user_id,organization_id} ] = useContext(authContext); 


  const fileInput = React.createRef();
  const renderFile = (fileObj) => {      
    ExcelRenderer(fileObj, (err, resp) => {      
      if(err){
        console.log(err.message);            
      }
      else{
        
               
        for (let i = 0; i< resp.rows.length; i++){         
          for(let r = 0 ; r<resp.rows[i].length; r++){
            
            /* Replace whitespaces with underscore on column headers */
            if(i === 0) { 
              resp.rows[i][r] =  resp.rows[i][r].split(" ").join("_").toUpperCase();             
            }              
            /* replace empty slots with null */
            if(typeof resp.rows[i][r] === 'undefined') {
              resp.rows[i][r] = null;
            }
            
            /* Convert numeric dates to normal date */
            if ((r === 7 || r === 8 || r === 9)){
              if(resp.rows[i][r]  && !isNaN(resp.rows[i][r])){
                resp.rows[i][r] = new Date(Math.round((resp.rows[i][r] - 25569)*86400*1000)).toLocaleDateString() 
              }
            }
          }
        }  
        
        /* remove the 1st row. it contains the column headers */
        let file_rows = [];  
        for (let i = 0; i<resp.rows.length; i++) {
          if (i !== 0) {
            file_rows.push(resp.rows[i]);
          }          
        }
        setCols(resp.rows[0]);
        setRows(file_rows);
        setDataLoaded(true);        
      }
    }); 
  };


  const fileHandler = (event) => {    
    if(event.target.files.length){
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;   
      
   
      if(fileName.slice(fileName.lastIndexOf('.')+1) === "csv" || fileName.slice(fileName.lastIndexOf('.')+1) === "xls" ||fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
        setIsFormInvalid(false);
        setUploadedFileName(fileName);        
        renderFile(fileObj)
      }    
      else{
        setIsFormInvalid(true);
        setUploadedFileName("");        
      }
    }               
  };

  const openFileBrowser = () => {
    fileInput.current.click();
  } 

  const handleSubmit = event => {
    const batch_uuid = uuid();
    localStorage.setItem("batch_upload_uuid", batch_uuid);
    event.preventDefault();
    (async  (endpoint,rows,cols,user_id,org_id,uuid) => {     
      await  postBatchUpload(endpoint,rows,cols,user_id,org_id,uuid)
      .then(() => {  
        setopenSnackbarSuccess(true);
        var delayInMilliseconds = 1000; //1 second        
        setTimeout(function() {
          window.location.replace(`/batch-process/animal/add/${batch_uuid}`);
        }, delayInMilliseconds);
        document.forms["event"].reset();
      }).catch((err) => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_batch_animal_upload,rows,cols,user_id,organization_id,batch_uuid);    
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  const options = {       
    filter: true,
    rowsPerPage: 20,       
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
   }  
  };

 

  /** set datatable columns */
 let columns = [];
 if (cols) {
  for (let i = 0; i<cols.length; i++){
    columns.push(
      { 
        name: cols[i],
        label: cols[i],
        options: {
          filter: false,
          sort: false, 
          display:true  
        }
      }
    );
  }

  

}

  
  

  
  
  return (
    <Grid container spacing={1} justify="center"> 
    <Grid item xs={11}>
      <Card  {...rest} className={clsx(classes.root, className)}>      
      <form onSubmit={handleSubmit} id = "event">      
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
             <Button color="info"  onClick={openFileBrowser}><i className="cui-file"></i> Browse</Button>
             <input type="file" hidden onChange={fileHandler} ref={fileInput} onClick={(event)=> { event.target.value = null }}/> 
             <Input type="text"  value={uploadedFileName} readOnly invalid={isFormInvalid} />              
          
          </Grid>   

          <Grid container spacing={4}> 
          <Grid item md={12} xs={12} >                        
            {dataLoaded && 
              <div>             
                <Card  className="restrict-card">   
                   <PerfectScrollbar>                 
                    <MuiThemeProvider theme={getMuiTheme()}>                
                      <MUIDataTable
                        title = "BATCH LISTING - PEDIGREE FILE"
                        data={rows}
                        columns={columns}
                        options={options}
                      />
                    </MuiThemeProvider>
                    </PerfectScrollbar>
                </Card>  
                       
              </div>
            }
            </Grid>            
          </Grid>   
        </Grid>
        
    </CardContent>
    <Divider />    
      {dataLoaded &&  
        <div> 
          <CardActions>          
          <Button
            className={classes.saveButton}
            type="submit"
            variant="contained"
          >
            Save Details
          </Button>
          </CardActions> 
        </div>
      }
 
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

Upload.propTypes = {
  className: PropTypes.string  
};

export default Upload;
