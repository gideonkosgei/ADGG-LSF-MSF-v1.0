import React from 'react';
const animalContext = React.createContext({});
export const Provider = animalContext.Provider;
export const Consumer = animalContext.Consumer;
export default animalContext;
