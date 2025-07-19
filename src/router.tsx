import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const Home = await lazy(() => import('./pages/home'));
      return { Component: Home };
    },
  },
]);
