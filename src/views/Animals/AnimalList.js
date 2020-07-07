import React, { useState, useEffect,useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Results } from './components';
import {endpoint_animal_org} from '../../configs/endpoints';
import {getAnimalsOrg}   from '../../utils/API';
import authContext from '../../contexts/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {
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
  const [ { organization_id }  ] = useContext(authContext);
  const animal_categ_id = parseInt(props.match.params.id); 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,id) => {     
        await  getAnimalsOrg(endpoint,id)
        .then(response => {       
          if (mounted) { 
          let filtered = []; 
          if (typeof(animal_categ_id) !='undefined'){
            for (let i = 0; i<response.payload.length; i++){              
              if (response.payload[i].animal_type_id === animal_categ_id){              
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
      })(endpoint_animal_org,organization_id); 
    return () => {
      mounted = false;
    };
  }, [organization_id,animal_categ_id]);

  if (!animals) {
    return null;
  }
  return (
    <Page
      className={classes.root}
      title="Animals List"
    >         
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
