import React, { useState } from 'react';
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
import { HouseholdEdit } from './components';

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


const Household = props => {
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
      <CardHeader title="Household Info" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Farmer is Head</TableCell>
              <TableCell>
                {farmDetails.farmerIsHouseholdHead}                
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell> Head Age</TableCell>
              <TableCell>               
                {farmDetails.householdHeadAge}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Head Gender</TableCell>
              <TableCell>               
                {farmDetails.householdHeadGender}
              </TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Head Mobile</TableCell>
              <TableCell>               
                {farmDetails.householdHeadMobile}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Land Owned</TableCell>
              <TableCell>                
                {farmDetails.totalNumberofParcelofLandowned}
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
      <HouseholdEdit
        farmDetails={farmDetails}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
};

Household.propTypes = {
  className: PropTypes.string,
  farmDetails: PropTypes.object.isRequired
};
export default Household;
