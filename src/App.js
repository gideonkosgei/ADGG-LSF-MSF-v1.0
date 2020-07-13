import React, { useReducer }from 'react';
import { Redirect } from 'react-router-dom';
import { Router} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { renderRoutes } from 'react-router-config';

import theme from './theme';
import routes from './routes';
import {ScrollReset,GoogleAnalytics, CookiesNotification} from './components';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/index.scss';

import { Provider } from './contexts/AuthContext';
import { authReducer, initialAuthState } from './reducers/authReducer';
const history = createBrowserHistory();
const App = () => {
  const useAuthState = useReducer(authReducer, initialAuthState);   
  const isAuthenticated = isNaN(localStorage.getItem('isLoggedIn'),false);   
  return (       
    <Provider value={useAuthState}>    
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router history={history}>            
            <ScrollReset />
            <GoogleAnalytics />
            <CookiesNotification />                
            {renderRoutes(routes)}   
            {(isAuthenticated)? "":<Redirect to="/auth/login"/>}         
          </Router>
        </MuiPickersUtilsProvider>
      </ThemeProvider>    
    </Provider>
  );
};
export default App;


