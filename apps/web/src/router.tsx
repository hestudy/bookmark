import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import AuthLayout from './layouts/authLayout';
import SidebarLayout from './layouts/sidebarLayout';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <SidebarLayout />,
        children: [
          {
            path: '/',
            lazy: async () => {
              const Home = lazy(() => import('./pages/home'));
              return { Component: Home };
            },
          },
        ],
      },
    ],
  },
]);
