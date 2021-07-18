import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Results } from './components';
import { endpoint_animal } from '../../configs/endpoints';
import { genericFunctionFourParameters } from '../../utils/API';
import authContext from '../../contexts/AuthContext';
import { LinearProgress, Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    paddingTop: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const AnimalList = props => {
  const { HerdIdProp } = props;
  const classes = useStyles();
  const [animals, setAnimals] = useState([]);
  const [caption, setCaption] = useState(null);
  const [{ user_id }] = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true);

  let animal_categ_id = null;
  let herd_id = null;
  let option = null;
  let id = null;

  if (typeof HerdIdProp === "undefined") {
    animal_categ_id = parseInt(props.match.params.id);
    herd_id = parseInt(props.match.params.herd);
    option = 2;
    id = user_id;

  } else {
    animal_categ_id = parseInt(null);
    herd_id = parseInt(HerdIdProp);
    option = 4;
    id = herd_id;
  }

  useEffect(() => {
    let mounted = true;
    (async (endpoint, desc, _option, _id) => {
      await genericFunctionFourParameters(endpoint, desc, _option, _id)
        .then(response => {
          if (mounted) {
            let filtered = [];
            setIsLoading(false);

            if (typeof (animal_categ_id) != 'undefined' && isNaN(herd_id)) {
              for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].animal_type_id === animal_categ_id) {
                  filtered.push(response.payload[i]);
                }
              }
            }

            if (typeof (animal_categ_id) != 'undefined' && isNaN(herd_id) === false) {
              for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].animal_type_id === animal_categ_id && response.payload[i].herd_id === parseInt(herd_id)) {
                  filtered.push(response.payload[i]);
                }
              }
            }

            const res = isNaN(animal_categ_id) ? response.payload : filtered;
            if (!isNaN(animal_categ_id)) {
              setCaption(res[0].animalType);
            }
            setAnimals(res);
          }
        });
    })(endpoint_animal, 'get animals -> by user', option, id); /* RAC of animals */

    return () => {
      mounted = false;
    };
  }, [animal_categ_id, herd_id, id, option]);

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
      <br />
      {isLoading &&
        <LinearProgress />
      }

      {animals && (
        <Results
          className={classes.results}
          animals={animals}
          caption={caption}
        />
      )}
    </Page>
  );
};
AnimalList.propTypes = {
  history: PropTypes.object.isRequired,
  HerdIdProp: PropTypes.object
};

export default AnimalList;
