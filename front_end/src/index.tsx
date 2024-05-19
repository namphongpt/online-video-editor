import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter }  from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queries/queryClient';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN!}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: 'api-gateway'
        }}
      >
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </Auth0Provider>
  </React.StrictMode>
);
