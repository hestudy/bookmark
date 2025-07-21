import { LoginForm } from '@/components/login-form';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { memo } from 'react';
import { Outlet } from 'react-router';

const AuthLayout = memo(() => {
  return (
    <>
      <AuthLoading>
        <div>loading</div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
});

export default AuthLayout;
