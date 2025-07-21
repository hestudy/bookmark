import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<'signUp' | 'signIn'>('signIn');

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              signIn('password', formData).catch((e) => {
                toast.error(e.message);
              });
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="********"
                />
              </div>
              <input name="flow" type="hidden" value={step} />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {step === 'signIn' ? 'Login' : 'Sign up'}
                </Button>
              </div>
            </div>
            {step === 'signIn' && (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => {
                    setStep('signUp');
                  }}
                >
                  Sign up
                </button>
              </div>
            )}
            {step === 'signUp' && (
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => {
                    setStep('signIn');
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
