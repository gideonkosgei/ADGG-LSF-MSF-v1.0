import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell
  
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { FarmInfoEdit } from './components';
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

const FarmInfo = props => {
  const { farmDetails, className, ...rest } = props;
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
      <CardHeader title="Farm General info" />
      <Divider />
      <CardContent className={classes.content}>
        <Table>
          <TableBody>            
            <TableRow >
              <TableCell>Farm Code</TableCell>
              <TableCell>{farmDetails.farm_code}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Farm Type</TableCell>
              <TableCell>{farmDetails.farm_type_name}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell>Farm Name</TableCell>
              <TableCell>{farmDetails.farm_name}</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Farmer Name</TableCell>
              <TableCell>{farmDetails.farmer_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project </TableCell>
              <TableCell>{farmDetails.project}</TableCell>
            </TableRow>            
            <TableRow selected>
              <TableCell>Phone</TableCell>
              <TableCell>               
                {farmDetails.phone}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>               
                {farmDetails.email}
              </TableCell>
            </TableRow>
            <TableRow  selected>
              <TableCell>Reg Date</TableCell>             
              <TableCell> {moment(farmDetails.reg_date).format('DD/MM/YYYY')}</TableCell>
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
      <FarmInfoEdit
        farmDetails={farmDetails}
        onClose={handleEditClose}
        open={openEdit}
      />
    </Card>
  );
};

FarmInfo.propTypes = {
  className: PropTypes.string,
  farmDetails: PropTypes.object.isRequired
};

export default FarmInfo;
