import React from 'react';
import apolloClient from './apolloSetup';
import { ApolloProvider } from '@apollo/react-hooks';
import NewVideoNotification from './components/NewVideoNotification';

const App = () => (
  <ApolloProvider client={apolloClient}>
      <NewVideoNotification />
  </ApolloProvider>
);
 
export default App;
