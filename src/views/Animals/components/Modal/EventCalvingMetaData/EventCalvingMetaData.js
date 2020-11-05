import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Modal,Card,CardContent, CardActions, Grid,Typography,TextField,Button, colors} from '@material-ui/core';
import moment from 'moment';
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 400,
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

const EventCalvingMetaData = props => {
  const { open, onClose, calvingDetails, className, ...rest } = props;
  const classes = useStyles(); 

  if (!open) {
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
             Calving Event Record Metadata-<span className={classes.details}> #{calvingDetails.animal_id}</span>
            </Typography>
            <Grid
              className={classes.container}
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth                 
                  margin = 'dense'
                  label="Event ID"
                  name="id" 
                  value = {calvingDetails.event_id} 
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth                 
                  margin = 'dense'
                  label="Animal ID"
                  name="id" 
                  value = {calvingDetails.animal_id} 
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth                 
                  margin = 'dense'
                  label="Creation Date"
                  name="creation_date" 
                  value = {moment(calvingDetails.created_at).format('DD/MM/YYYY')} 
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                  margin = 'dense'
                  label="Created By"
                  name="created_by"                  
                  value={calvingDetails.created_by}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                  margin = 'dense'
                  label="Last Update Date"
                  name="update_date"                  
                  value = {moment(calvingDetails.updated_at).format('DD/MM/YYYY')} 
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  inputProps={{
                    readOnly: true,
                    disabled: true               
                  }}
                  margin = 'dense'
                  label="Last Update By"
                  name="updated_by"                  
                  value={calvingDetails.updated_by}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

               
            </Grid>
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

EventCalvingMetaData.displayName = 'EventCalvingMetaData';

EventCalvingMetaData.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

EventCalvingMetaData.defaultProps = {
  open: false,
  onClose: () => {}
};

export default EventCalvingMetaData;
