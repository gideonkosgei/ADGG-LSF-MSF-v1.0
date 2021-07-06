import React, { Fragment, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Paper,Grid } from '@material-ui/core';
import { Hidden } from '@material-ui/core';
import useRouter from 'utils/useRouter';
import { Navigation } from 'components';
import navigationAdminConfig from '../../../../layouts/Dashboard/components/NavBar/navigationAdminConfig';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    weight: '30%',
    overflowY: 'auto'
  },
  content: {
    padding: theme.spacing(2)
  },

  name: {
    marginTop: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  navigation: {
    marginTop: theme.spacing(2)
  }
}));

const Admin = props => {
  const { openMobile, onMobileClose, className, ...rest } = props;
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {

    if (openMobile) {
      onMobileClose && onMobileClose();
    }

  }, [router.location.pathname, onMobileClose, openMobile]);

  const navbarContent = (
    <div className={classes.content}>
      <nav className={classes.navigation}>
        {navigationAdminConfig.map(list => (
          <Navigation
            component="div"
            key={list.title}
            pages={list.pages}
            title={list.title}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          <div
            {...rest}
            className={clsx(classes.root, className)}
          >
            {navbarContent}
          </div>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Paper
          {...rest}
          className={clsx(classes.root, className)}
          elevation={1}
          square
        >
          <Grid container>
            <Grid
              item
              xl={3}
              xs={3}
            >
              {navbarContent}
            </Grid>
          </Grid>

        </Paper>
      </Hidden>
    </Fragment>
  );
};

Admin.propTypes = {
  className: PropTypes.string,
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default Admin;
