import React,{useState,useEffect,useContext} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { makeStyles} from '@material-ui/styles';
import {Card, CardContent,Grid,Divider,Button,CardActions,Input} from '@material-ui/core';
import authContext from '../../../../../../contexts/AuthContext';
import './style/app.css';

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



const UploadBatch = props => {
  const {className, ...rest } = props;
  const classes = useStyles(); 

 
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

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
  
  return (
    <Grid container spacing={1} justify="center"> 
    <Grid item xs={11}>
      <Card  {...rest} className={clsx(classes.root, className)}>      
      <form>      
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
       
    </Card>
    </Grid>
    </Grid>
 );
};

UploadBatch.propTypes = {
  className: PropTypes.string  
};

export default UploadBatch;
