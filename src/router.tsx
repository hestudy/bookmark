import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import AuthLayout from './layouts/authLayout';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const Home = await lazy(() => import('./pages/home'));
          return { Component: Home };
        },
      },
    ],
  },
]);
