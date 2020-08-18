import React, {useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {Card, CardContent, CardHeader, Grid,Divider,colors,Button,CardActions,Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import {Link} from "react-router-dom";


const useStyles = makeStyles(theme => ({
  root: {},
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  placeholder: {
    height: 240,
    backgroundColor: colors.blueGrey[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insertDriveFileIcon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    fontSize: theme.spacing(6)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  actions: {
    justifyContent: 'center'
  },
  getAppIcon: {
    marignRight: theme.spacing(1)
  },
  menu: {
    width: 250,
    maxWidth: '100%'
  }
}));

const DownloadDetails = props => {
  const {className, ...rest } = props;  
  const classes = useStyles(); 
 

  useEffect(() => {     
    return () => {            
    };
  }, []);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      
        <CardHeader title="Downloads" />
        <Divider />
        <CardContent> 
          <Grid container spacing={2} > 
            <Grid
            item       
            lg={4}
            md={4}
            sm={6}
            xs={12}
          >
         <Card> 
            <CardContent className={classes.content}>
              <div>
                <Typography variant="h5">Milking Template</Typography>          
              </div>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
             <Link to="/templates/milk.csv" target="_blank" download>
             <Button>
                <GetAppIcon className={classes.getAppIcon} />
                Download
              </Button>
             </Link>              

            </CardActions> 
          </Card>
      </Grid>        
          </Grid>
        </CardContent> 
    </Card>
  );
};

DownloadDetails.propTypes = {
  className: PropTypes.string  
};
export default DownloadDetails;