import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal,Card,CardContent, CardActions, Grid,Typography,Button} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
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
  cancelButton: {
    marginLeft: 'auto'
  }
}));

const SeeAllModal = props => {
  const { open, onClose,Details, className, ...rest } = props;
  const classes = useStyles();  

  if (!open) {
    return null;
  }
  const columns = [
    { name: "animal_id",label: " ANIMAL ID",options: {filter: false,sort: false,display:true}},   
    { name: "tag_id",label: "TAG ID",options: {filter: false,sort: false,display:true}},
    { name: "name",label: "ANIMAL NAME",options: {filter: false,sort: false,display:true}},  
    { name: "total_milk",label: "TOTAL MILK",options: {filter:false,sort: true,display:true}},   
    
    { name: "",
      options: {
      filter: false,
      sort: false,  
      empty:true  
    }
  }    
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
   }   
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
        <form>
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="h5"
            >
              ANIMAL PERFORMANCE - TOP ANIMALS (Milk)
            </Typography>
            <Grid
              className={classes.container}
              container
              spacing={3}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <PerfectScrollbar>
                    <div className={classes.inner}>
                      <MuiThemeProvider>                
                        <MUIDataTable
                          title = "TOP ANIMALS"
                          data={Details}
                          columns={columns}
                          options={options}
                        />
                      </MuiThemeProvider>
                    </div>
                  </PerfectScrollbar>                 
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
             className={classes.cancelButton}
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

SeeAllModal.displayName = 'SeeAllModal';

SeeAllModal.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

SeeAllModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default SeeAllModal;
