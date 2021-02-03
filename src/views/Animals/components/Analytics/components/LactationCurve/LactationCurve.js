import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent, Divider,TextField,Grid } from '@material-ui/core';
import { GenericMoreButton } from 'components';
import { Chart } from './components';
import {endpoint_lactation_curve} from '../../../../../../configs/endpoints';
import {getlactationCurveData}   from '../../../../../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {},
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginLeft: theme.spacing(1)
    }
  },
  inner: {
    height: 275,
    minWidth: 400
  },
  chart: {
    height: '100%'
  }
}));

const LactationCurve = props => {
  const { className,body_length, ...rest } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [records, setRecords] = useState([]);
  const [milkData, setMilkData] = useState([]);
  const [dimData, setDimData] = useState([]);
  const [lactation_ids, setLactationIds] = useState([]); 
  const animal_id  = localStorage.getItem('animal_id');

  useEffect(() => {
    let mounted = true;   
    (async  (endpoint,animal_id)=>{     
      await  getlactationCurveData(endpoint,animal_id)
       .then(response => {              
         if (mounted) {
          setRecords(response.payload);  

          let lactations = []; 
          if (response.payload.length > 0 ){
            for (let i = 0; i< response.payload.length; i++){ 
              lactations.push(response.payload[i].lactation_id);      
            } 
          }                
          setLactationIds(lactations.filter(onlyUnique));                     
         }
       });
     })(endpoint_lactation_curve,animal_id);
    return () => {
      mounted = false;
    };
  }, [animal_id]);

  if (!records) {
    return null;
  }

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  } 

  let  dim =[];
  let  milk =[];
  

const data = {    
  lactation_data: {
    data: milkData,
    labels: dimData
  }
};
const handleChange = event => {
  setValues({...values });
  event.persist();   
  if (records.length > 0 ){
    for (let i = 0; i< records.length; i++){          
      if (records[i].lactation_id === parseInt(event.target.value)){           
        dim.push(records[i].dim);
        milk.push(records[i].total_milk);
      }  
    }     
  } 
  setMilkData(milk);
  setDimData(dim); 
};

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={<GenericMoreButton />}
        title="LACTATION CURVE"
      />
      <Divider />
      <CardContent className={classes.content}>
      <Grid container spacing={2} justify="center">  
             <Grid item xs={4}>
              <TextField
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                margin = 'dense'
                label=" SELECT LACTATION ID"
                name="lactation_id"
                onChange={handleChange}                    
                default = ""                              
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}                    
                variant="outlined"
              >
                <option></option>
                {lactation_ids.map(lactation_id => (
                          <option                    
                            value={lactation_id}
                          >
                            {lactation_id}
                          </option>
                        ))
                    }   
              </TextField>
              </Grid>
              </Grid>
              <br/>
            
        <PerfectScrollbar>
          <div className={classes.inner}>
              

            <Chart
              className={classes.chart}
              data={data.lactation_data.data}
              labels={data.lactation_data.labels}
            />
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};


LactationCurve.propTypes = {
  className: PropTypes.string
};

export default LactationCurve;
