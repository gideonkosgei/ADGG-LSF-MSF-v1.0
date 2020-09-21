/* eslint-disable react/display-name */
import React, { useState, forwardRef,useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Switch,
  colors
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import authContext from '../../../../contexts/AuthContext';
import {postCalenderEvent}   from '../../../../utils/API';
import {endpoint_calender_event_create} from '../../../../configs/endpoints';
import SuccessSnackbar from '../../../../components/SuccessSnackbar';
import ErrorSnackbar from '../../../../components/ErrorSnackbar';

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
  field: {
    marginTop: theme.spacing(3)
  },
  cancelButton: {
    marginLeft: 'auto'
  },
  confirmButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const AddEditEvent = forwardRef((props, ref) => {
  const {event,onDelete,onCancel,onAdd,onEdit,className, ...rest} = props;
  const [{user_id,organization_id}] = useContext(authContext);
  const [openSnackbarSuccess, setopenSnackbarSuccess] = useState(false);
  const [openSnackbarError, setopenSnackbarError] = useState(false);

  const classes = useStyles();

  const defaultEvent = {
    title: 'Event title',
    desc: 'Event description',
    allDay: false,
    start: moment().toDate(),
    end: moment().toDate()
  };

  const [values, setValues] = useState(event || defaultEvent);

  const mode = event ? 'edit' : 'add';

  const handleFieldChange = e => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }));
  };

  const handleDelete = () => {
    onDelete && onDelete(event);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    (async  (endpoint,title,description,event_start,event_end,all_day,color,created_by,org_id) => {      
      await  postCalenderEvent(endpoint,title,description,event_start,event_end,all_day,color,created_by,org_id)
      .then(() => {  
        setopenSnackbarSuccess(true);        
        document.forms["calender"].reset();
      }).catch((err) => {               
        setopenSnackbarError(true); 
      });
    })(endpoint_calender_event_create,values.title,values.desc,moment(values.start).format('YYYY-MM-DD HH:mm'),moment(values.end).format('YYYY-MM-DD HH:mm'),values.allDay,1,user_id,organization_id);
  
    if (!values.title || !values.desc) {
      return;
    } 
    var delayInMilliseconds = 800; //1 second        
        setTimeout(function() {
          onAdd({ ...values, id: uuid()});
        }, delayInMilliseconds);
  };



  const handleEdit = () => {
    if (!values.title || !values.desc) {
      return;
    }

    onEdit(values);
  };

  const handleSnackbarSuccessClose = () => {
    setopenSnackbarSuccess(false);
  };

  const handleSnackbarErrorClose = () => {
    setopenSnackbarError(false);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
      ref={ref}
    >
      <form id ="calender">
        <CardContent>
          <Typography
            align="center"
            gutterBottom
            variant="h3"
          >
            {mode === 'add' ? 'Add Event' : 'Edit Event'}
          </Typography>
          <TextField
            className={classes.field}
            fullWidth
            label="Title"
            name="title"
            onChange={handleFieldChange}
            value={values.title}
            variant="outlined"
          />
          <TextField
            className={classes.field}
            fullWidth
            label="Description"
            name="desc"
            onChange={handleFieldChange}
            value={values.desc}
            variant="outlined"
          />
          <FormControlLabel
            className={classes.field}
            control={
              <Switch
                checked={values.allDay}
                name="allDay"
                onChange={handleFieldChange}
              />
            }
            label="All day"
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.start).format('YYYY-MM-DDThh:mm:ss')}
            fullWidth
            label="Start date"
            name="start"
            onChange={handleFieldChange}
            type="datetime-local"
            variant="outlined"
          />
          <TextField
            className={classes.field}
            defaultValue={moment(values.end).format('YYYY-MM-DDThh:mm:ss')}
            disabled={values.allDay}
            fullWidth
            label="End date"
            name="end"
            onChange={handleFieldChange}
            type="datetime-local"
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <IconButton
            edge="start"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            variant="contained"
          >
            Cancel
          </Button>
          {mode === 'add' ? (
            <Button
              className={classes.confirmButton}
              onClick={handleAdd}
              variant="contained"
            >
              Add
            </Button>
          ) : (
            <Button
              className={classes.confirmButton}
              onClick={handleEdit}
              variant="contained"
            >
              Save
            </Button>
          )}
        </CardActions>
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
  );
});

AddEditEvent.propTypes = {
  className: PropTypes.string,
  event: PropTypes.object,
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default AddEditEvent;
