import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Tooltip, IconButton, Link } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import authContext from '../../../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {},
}));
const Header = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [{ is_admin }] = useContext(authContext); 
  const display_add = parseInt(is_admin) === 1 ? true : false;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}    >
      <CardContent>

        <Tooltip title="Home">
          <IconButton aria-label="home" size="small" >
            <Link component={RouterLink} to={`/management/farms`}>
              <HomeIcon />
            </Link>
          </IconButton>
        </Tooltip>

        <Tooltip title="view">
          <IconButton aria-label="view" size="small" >
            <Link component={RouterLink} to={`/management/farms`}>
              <ListIcon />
            </Link>
          </IconButton>
        </Tooltip>

        {display_add &&
          <Tooltip title="Add New">
            <IconButton aria-label="add" size="small" >
              <Link component={RouterLink} to={`/management/farms/add`}>
                <AddIcon />
              </Link>
            </IconButton>
          </Tooltip>
        }
      </CardContent>
    </Card>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;