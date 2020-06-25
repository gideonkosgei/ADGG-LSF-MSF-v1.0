import React,{useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow 
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { LocationInfoEdit } from './components';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));


const Location = props => {
  const {farmDetails, className, ...rest } = props;
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  }; 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Address & Location Info" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Country</TableCell>
              <TableCell>
                {farmDetails.country}                
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Region</TableCell>
              <TableCell>               
                {farmDetails.region_name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>District</TableCell>
              <TableCell>               
                {farmDetails.district_name}
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Ward</TableCell>
              <TableCell>               
                {farmDetails.ward_name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Village</TableCell>
              <TableCell>                
                {farmDetails.village_name}
              </TableCell>
            </TableRow>            
            <TableRow selected>
              <TableCell>Longitude</TableCell>
              <TableCell>               
                {farmDetails.longitude}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Map Address</TableCell>
              <TableCell>               
                {farmDetails.map_address}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
           Edit
        </Button>   
      </CardActions>
      <LocationInfoEdit
        farmDetails={farmDetails}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
};

Location.propTypes = {
  className: PropTypes.string,
  farmDetails: PropTypes.object.isRequired
};
export default Location;
