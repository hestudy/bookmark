import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { memo } from 'react';
import { Outlet } from 'react-router';

const AuthLayout = memo(() => {
  return (
    <>
      <AuthLoading>loading</AuthLoading>
      <Unauthenticated>login</Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
});

export default AuthLayout;
