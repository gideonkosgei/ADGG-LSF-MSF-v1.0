import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardHeader, Divider,Grid, Button, ButtonGroup } from '@material-ui/core';
import {endpoint_health_summary_table} from '../../../../../../configs/endpoints';
import {getHealthManagementSummary}   from '../../../../../../utils/API';
import authContext from '../../../../../../contexts/AuthContext';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider } from '@material-ui/core/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { GenericMoreButton } from 'components';
import moment from 'moment';
import { DatePicker } from '@material-ui/pickers';
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
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
  dates: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendarTodayIcon: {
    marginRight: theme.spacing(1)
  }
  
}));

const HealthManagementSummmaryTable = props => {
  const { className,health_summary_option, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]); 
  const [ { organization_id }  ] = useContext(authContext);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'years'));
  const [endDate, setEndDate] = useState(moment());
  const [selectEdge, setSelectEdge] = useState(null);
  const [calendarDate, setCalendarDate] = useState(moment());
  let option = health_summary_option;
  let id = option === 1 ? localStorage.getItem('animal_id'): organization_id;
  
  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,option,id,start_date,end_date)=>{     
      await  getHealthManagementSummary(endpoint,option,id,start_date,end_date)
       .then(response => {              
         if (mounted) {
          setValues(response.payload);                           
         }
       });
     })(endpoint_health_summary_table,option,id,moment(startDate).format('YYYY-MM-DD'),moment(endDate).format('YYYY-MM-DD'));
    return () => {
      mounted = false;
    };
  }, [id,option, startDate,endDate]);

  if (!values) {
    return null;
  } 
  
  const columns = [
    { name: "health_category",label: "Health Category",options: {filter: false,sort: true,display:true}},  
    { name: "frequency",label: "Frequency",options: {filter: false,sort: true,display:true}},  
    { name: "cummulative_cost",label: " Cummulative Cost",options: {filter: false,sort: true,display:true}}           
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

      if (moment(date).isAfter(endDate)) {
        setEndDate(date);
      }
    } else {
      setEndDate(date);

      if (moment(date).isBefore(startDate)) {
        setStartDate(date);
      }
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
        action={<GenericMoreButton />}
        title="ANIMAL HEALTH SUMMARY"
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
              {startDate.format('DD MM YYYY')}
            </Button>
            <Button onClick={() => handleCalendarOpen('end')}>
              <CalendarTodayIcon className={classes.calendarTodayIcon} />
              {endDate.format('DD MM YYYY')}
            </Button>
          </ButtonGroup>
        </Grid>
        <br/>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <MuiThemeProvider>                
              <MUIDataTable
                title = ""
                data={values}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </PerfectScrollbar> 
      </CardContent>
      <Divider /> 
      <DatePicker
        maxDate={moment()}
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
HealthManagementSummmaryTable.propTypes = {
  className: PropTypes.string,
  health_summary_option: PropTypes.number
};
export default HealthManagementSummmaryTable;
