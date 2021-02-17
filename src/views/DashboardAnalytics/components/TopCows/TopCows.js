import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button,Card, CardContent, CardHeader, Divider,Grid, ButtonGroup } from '@material-ui/core';
import authContext from '../../../../contexts/AuthContext';
import {endpoint_top_cows} from '../../../../configs/endpoints';
import {getTopCows}   from '../../../../utils/API';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  avatar: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.white
  },
  actions: {
    justifyContent: 'flex-end'
  },
  arrowForwardIcon: {
    marginLeft: theme.spacing(1)
  },
  dates: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendarTodayIcon: {
    marginRight: theme.spacing(1)
  }
}));

const TopCows = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [topCows, setTopCows] = useState([]);
  const [ { organization_id }  ] = useContext(authContext);   
  const [startDate, setStartDate] = useState(moment());  
  const [selectEdge, setSelectEdge] = useState(null);
  const [calendarDate, setCalendarDate] = useState(moment());  
  
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,org_id,year)=>{     
      await  getTopCows(endpoint,org_id,year)
       .then(response => {              
         if (mounted) {
          setTopCows(response.payload);                           
         }
       });
     })(endpoint_top_cows,organization_id,moment(startDate).format('YYYY'));
    return () => {
      mounted = false;
    };
  }, [organization_id,startDate]); 

  if (!topCows) {
    return null;
  } 

  
  const columns = [
    { name: "tag_id",label: "Tag ID",options: {filter: false,sort: true,display:true}},  
    { name: "name",label: "Name",options: {filter: false,sort: true,display:true}},  
    { name: "average_milk",label: "Average Milk(ltrs)",options: {filter: false,sort: true,display:true}},  
    { name: "total_milk",label: "Total Milk(ltrs)",options: {filter: false,sort: true,display:true}}           
  ];

  const options = {  
    rowsPerPage: 5,       
    rowsPerPageOptions :[5,10,20,50,100],
    selectableRows: 'none',      
    filterType: 'checkbox',
    responsive: 'stacked',                
    rowHover: true, 
    search: false,
    filter: false,  
    print: true,
    viewColumns: false,    
    setTableProps: () => {
     return {
       padding: "none" ,         
       size: "small",
     };
   }    
  };

  
  const handleCalendarOpen = edge => {
    setSelectEdge(edge);
  };

  const handleCalendarChange = date => {
    setCalendarDate(date);
  };

  const handleCalendarClose = () => {
    setCalendarDate(moment());
    setSelectEdge(null);
  };

  const handleCalendarAccept = date => {
    setCalendarDate(moment());

    if (selectEdge === 'start') {
      setStartDate(date);      
    } 
    setSelectEdge(null);
  };
  const open = Boolean(selectEdge); 
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader       
        title= {`TOP MILK PRODUCING COWS`}
      />
      <Divider />
      <CardContent className={classes.content}>
      <br/>
      <Grid
          className={classes.dates}
          item
          lg={12}
          xs={12}
        >
            <ButtonGroup variant="contained">
              <Button onClick={() => handleCalendarOpen('start')}>
                <CalendarTodayIcon className={classes.calendarTodayIcon} />
                {startDate.format('YYYY')}
              </Button>             
            </ButtonGroup>
          </Grid>
          <br/>      
        
          <PerfectScrollbar>
            <div className={classes.inner}>
              <MuiThemeProvider>                
                <MUIDataTable
                  title = ""
                  data={topCows}
                  columns={columns}
                  options={options}
                />
              </MuiThemeProvider>
            </div>
          </PerfectScrollbar>
        </CardContent>      
     

      <DatePicker
        maxDate={moment()}
        views={["year"]}
        animateYearScrolling
        onAccept={handleCalendarAccept}
        onChange={handleCalendarChange}
        onClose={handleCalendarClose}
        open={open}
        style={{ display: 'none' }} // Temporal fix to hide the input element
        value={calendarDate}
        variant="dialog"
      />

    </Card>
    
  );
};

TopCows.propTypes = {
  className: PropTypes.string
};

export default TopCows;
