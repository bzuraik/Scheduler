import React from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import AppContainer from '../containers/AppContainer';

// Router Documentation: https://reactrouter.com/en/main/route/route
export default createBrowserRouter([
  {
    path: '/',
    loader: () => redirect('/semester/F22'),
  },
  {
    path: '/semester/:semesterId',
    element: <AppContainer />,
  },
]);
