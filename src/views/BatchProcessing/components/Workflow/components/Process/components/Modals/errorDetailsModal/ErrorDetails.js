import React,{ useState,useEffect }  from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Modal,Card,CardContent, CardActions, TableContainer,Typography,Button, colors,Table,TableHead,TableBody,TableRow,TableCell} from '@material-ui/core';
import {genericFunctionFiveParameters}  from '../../../../../../../../../utils/API';
import {endpoint_batch_details} from '../../../../../../../../../configs/endpoints';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 600,
    maxHeight: '80%',
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

  const ErrorDetails = props => {
  const { open, onClose, className,record_id,batch_type, ...rest } = props;
  const [values, setValues] =  useState([]); 
  const classes = useStyles(); 
  const option_errors = 0;

  useEffect(() => {     
    let mounted = true;     
      (async (endpoint,desc,id,type,option) => {
        await genericFunctionFiveParameters(endpoint,desc,id,type,option)
          .then(response => {
            if (mounted) {            
              setValues(response.payload);
            }
          });
      })(endpoint_batch_details,'error details',record_id,batch_type,option_errors);
      
    return () => {
      mounted = false;
    };
  }, [record_id,batch_type]); 

  if (!values || !open) {
    return null;
  } 

  
  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form>
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="h5"
            >
             Validation Error Log - <span className={classes.details}> #{record_id}</span>
            </Typography>
            <PerfectScrollbar>
          <div className={classes.inner}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Error Type</TableCell>
                  <TableCell>Error Details</TableCell>                 
                </TableRow>
              </TableHead>
              <TableBody>
                {values.map(value => (
                  <TableRow>                  
                    <TableCell>{value.error_check}</TableCell>
                    <TableCell>{value.error_condition}</TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
        </PerfectScrollbar>
          </CardContent>
          <CardActions className={classes.actions}>
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

ErrorDetails.displayName = 'ErrorDetails';

ErrorDetails.propTypes = {
  className: PropTypes.string,
  record_id: PropTypes.number.isRequired,
  batch_type: PropTypes.number.isRequired,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

ErrorDetails.defaultProps = {
  open: false,
  onClose: () => {}
};

export default ErrorDetails;
