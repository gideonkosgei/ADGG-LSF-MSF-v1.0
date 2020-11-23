import React,{useState,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { makeStyles} from '@material-ui/styles';
import {Card, CardContent,Grid,Divider,Button,CardActions,Input} from '@material-ui/core';
import authContext from '../../../../../../../../contexts/AuthContext';
import {postBatchUploadMilking}   from '../../../../../../../../utils/API';
import {endpoint_batch_milking_upload} from '../../../../../../../../configs/endpoints';
import './style/app.css';
import SuccessSnackbar from '../../../../../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../../../../../components/ErrorSnackbar';
import uuid from 'uuid';

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
        setCols(resp.cols); 
        setRows(resp.rows);
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
      await  postBatchUploadMilking(endpoint,rows,cols,user_id,org_id,uuid)
      .then(() => {  
        setopenSnackbarSuccess(true);
        var delayInMilliseconds = 1000; //1 second        
        setTimeout(function() {
          window.location.replace(`/batch-process/milking-records/add/${batch_uuid}`);
        }, delayInMilliseconds);
        document.forms["event"].reset();
      }).catch((err) => {        
        setopenSnackbarError(true); 
      });
    })(endpoint_batch_milking_upload,rows,cols,user_id,organization_id,batch_uuid);    
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
                    <OutTable data={rows} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
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
