import React, { useState, useEffect,useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Results } from './components';
import {endpoint_animal} from '../../configs/endpoints';
import {genericFunctionFourParameters}   from '../../utils/API';
import authContext from '../../contexts/AuthContext';
import { LinearProgress,Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const AnimalList = props => {
  const classes = useStyles();
  const [animals, setAnimals] = useState([]);
  const [caption, setCaption] = useState('All');
  const [ { user_id }  ] = useContext(authContext);
  const animal_categ_id = parseInt(props.match.params.id); 
  const herd_id = parseInt(props.match.params.herd);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,desc,_option,_id) => {     
        await   genericFunctionFourParameters(endpoint,desc,_option,_id)
        .then(response => {       
          if (mounted) { 
          let filtered = [];
          setIsLoading(false); 
           //herd_id: 12740

          if (typeof(animal_categ_id) !='undefined' && isNaN(herd_id) ){
            for (let i = 0; i<response.payload.length; i++){              
              if (response.payload[i].animal_type_id === animal_categ_id){              
                filtered.push(response.payload[i]);
              }
            }
          }  

          if (typeof(animal_categ_id) !='undefined' && isNaN(herd_id) === false ){
            for (let i = 0; i<response.payload.length; i++){              
              if (response.payload[i].animal_type_id === animal_categ_id && response.payload[i].herd_id === parseInt(herd_id) ){              
                filtered.push(response.payload[i]);
              }
            }
          }    

            const res = isNaN(animal_categ_id)? response.payload : filtered; 
            if (!isNaN(animal_categ_id)){
              setCaption(res[0].animalType);           
            }        
            setAnimals(res);
          }
        });
      })(endpoint_animal,'get animals -> by user',2,user_id); /* RAC of animals */
      
    return () => {
      mounted = false;
    };
  }, [animal_categ_id,herd_id,user_id]);

  if (!animals) {
    return null;
  }
 
  return (
    <Page
      className={classes.root}
      title="Animals List"
    >  
     <Typography
        component="h1"
        gutterBottom
        variant="h3"
      >
        ANIMAL LIST
      </Typography>
      <br/>
      { isLoading  &&
        <LinearProgress/>
      }

      {animals && (     
        <Results
          className={classes.results}
          animals={animals}
          caption = {caption}
        />
      )}
    </Page>
  );
};

export default AnimalList;
