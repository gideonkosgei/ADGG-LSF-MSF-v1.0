import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page, SearchBar } from 'components';
import { Header, Results } from './components';
import {endpoint_clients} from '../../configs/endpoints';
import {getClients}   from '../../utils/API';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const ClientList = () => {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const organization_id = 1; 

  useEffect(() => {   
    let mounted = true;
    (async  (endpoint,id) => {     
        await  getClients(endpoint,id)
        .then(response => {       
          if (mounted) {
            setClients(response.payload[0]);
          }
        });
      })(endpoint_clients,organization_id); 
    return () => {
      mounted = false;
    };
  }, []);

  if (!clients) {
    return null;
  }



  const handleFilter = () => {};
  const handleSearch = () => {};

  return (
    <Page
      className={classes.root}
      title="Clients List"
    >
      <Header />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {clients && (
        <Results
          className={classes.results}
          clients={clients}
        />
      )}
    </Page>
  );
};

export default ClientList;
