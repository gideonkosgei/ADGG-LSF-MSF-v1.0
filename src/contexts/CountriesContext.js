import React from 'react';
const countriesContext = React.createContext({});
export const Provider = countriesContext.Provider;
export const Consumer = countriesContext.Consumer;
export default countriesContext;
