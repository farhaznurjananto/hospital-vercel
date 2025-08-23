'use client';

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
// import { authClient } from '@/lib/auth-client';
import { GithubIcon, Loader, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //   async function signInWithGitHub() {
  //     startGithubTransition(async () => {
  //       await authClient.signIn.social({
  //         provider: 'github',
  //         callbackURL: '/',
  //         fetchOptions: {
  //           onSuccess: () => {
  //             toast.success(
  //               'Sign in with GitHub, you will be redirected shortly.'
  //             );
  //           },
  //           onError: () => {
  //             toast.error('Failed to sign in with GitHub.');
  //           },
  //         },
  //       });
  //     });
  //   }

  //   function signInWithEmail() {
  //     startEmailTransition(async () => {
  //       await authClient.emailOtp.sendVerificationOtp({
  //         email: email,
  //         type: 'sign-in',
  //         fetchOptions: {
  //           onSuccess: () => {
  //             toast.success('Email sent');
  //             router.push(`verify-request?email=${email}`);
  //           },
  //           onError: () => {
  //             toast.error('Failed to sending email');
  //           },
  //         },
  //       });
  //     });
  //   }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your GitHub or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* <Button
          disabled={githubPending}
          //   onClick={signInWithGitHub}
          className="w-full"
          variant="outline"
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or Continue with
          </span>
        </div> */}

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="****"
              required
            />
          </div>

          {/* <Button onClick={signInWithEmail} disabled={emailPending}> */}
          <Button disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                Sign In
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
