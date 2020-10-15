import React,{ useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography, Grid, colors } from '@material-ui/core';
import { Label } from 'components';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_dashboard_overview} from '../../../../configs/endpoints';
import {getStatsDashboardOverview}   from '../../../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: theme.spacing(1)
  }
}));

const Overview = props => {
  const { className, ...rest } = props;
  const [ { organization_id }  ] = useContext(authContext);
  const [stats, setStats] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let mounted = true;
    (async  (org_id)=>{     
      await  getStatsDashboardOverview(endpoint_dashboard_overview,org_id)
       .then(response => {              
         if (mounted) {
          setStats(response.payload[0]);
         }
       });
     })(organization_id);
    return () => {
      mounted = false;
    };
  }, [organization_id]);

 
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="center"
        container
        justify="space-between"
      >
        <Grid
          className={classes.item}
          item
          md={3}
          sm={6}
          xs={12}
        >
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Active Animals
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{Number(stats.current_year_active_animals).toLocaleString()}</Typography> 
            <Label
              className={classes.label}
              color= { (stats.active_animals_change_percentage>0) ? colors.green[600] : colors.red[600] }
              variant="contained"
            >
              {`${stats.active_animals_change_percentage}%`}
            </Label>
          </div>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={3}
          sm={6}
          xs={12}
        >
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Milk Production
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{Number(stats.current_year_total_milk).toLocaleString()} (L)</Typography>           
            <Label
              className={classes.label}
              color= { (stats.milk_change_percentage>0) ? colors.green[600] : colors.red[600] }
              variant="contained"
            >
              {`${stats.milk_change_percentage}%`}              
            </Label>
          </div>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={3}
          sm={6}
          xs={12}
        >
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            New Births 
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{Number(stats.current_year_births).toLocaleString()}</Typography>            
            <Label
              className={classes.label}
              color={ (stats.birth_change_percentage>0) ? colors.green[600] : colors.red[600] }
              variant="contained"
            >
              {`${stats.birth_change_percentage}%`} 
            </Label>
          </div>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={3}
          sm={6}
          xs={12}
        >
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Net Movement
          </Typography>
          <div className={classes.valueContainer}>
            <Typography variant="h3">{Number(stats.current_year_net_movement).toLocaleString()}</Typography>            
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

Overview.propTypes = {
  className: PropTypes.string
};

export default Overview;
