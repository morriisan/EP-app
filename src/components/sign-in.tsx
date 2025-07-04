"use client"

// Type declarations for Credential Management API
interface PasswordCredentialData {
  id: string;
  password: string;
}

declare global {
  interface Window {
    PasswordCredential?: {
      new (data: PasswordCredentialData): Credential;
    };
  }
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SignIn({ callbackURL = "/dashboard" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("Form submitted!"); // Debug log
            setError("");
            
            if (!email.trim()) {
              toast.error("Please enter your email address");
              return;
            }
            
            if (!password.trim()) {
              toast.error("Please enter your password");
              return;
            }

            setLoading(true);
            try {
              const result = await signIn.email({
                email: email.trim(),
                password,
                callbackURL,
              });

              // If Better-Auth login was successful, ask Chrome to save the login
              if (!result.error && window.PasswordCredential && navigator.credentials?.store) {
                try {
                  await navigator.credentials.store(
                    new window.PasswordCredential({
                      id: email.trim(),
                      password,
                    })
                  );
                  console.log("✅ Credential store invoked—Chrome should offer 'Save password?'");
                } catch (credErr) {
                  console.warn("Credential store failed:", credErr);
                }
              }

              // Handle any server-side error message
              if (result.error) {
                setError(result.error.message || "Login failed");
                toast.error(result.error.message || "Login failed. Please check your credentials.");
              }
            } catch (err) {
              console.error("Sign in error:", err);
              const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
              setError(msg);
              toast.error(msg);
            } finally {
              setLoading(false);
            }
          }}
          className="grid gap-4"
          method="post"
          action="/api/auth/sign-in/email"
        >
          <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

        {/*    <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  onClick={() => {
                    setRememberMe(!rememberMe);
                  }}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>  */}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <Button
              type="submit"
              className="w-full mb-2"
              disabled={loading}
              onClick={(e) => {
                console.log("Button clicked!"); // Debug log
                // Manually trigger form submission
                const form = e.currentTarget.closest('form');
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
        </form>

        <div className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col"
            )}>
          {/*     <Button
                  variant="outline"
                  className={cn(
                    "w-full gap-2"
                  )}
                  onClick={async () => {
                    await signIn.social({
                      provider: "microsoft",
                      callbackURL: callbackURL
                    });
                  }}
                >
                  <svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
				></path>
			</svg>
                  Sign in with Microsoft
                </Button> */}
                {/* <Button
                  variant="outline"
                  className={cn(
                    "w-full gap-2"
                  )}
                  onClick={async () => {
                    await signIn.social({
                      provider: "apple",
                      callbackURL: callbackURL
                    });
                  }}
                >
                  <svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25"
				></path>
			</svg>
                  Sign in with Apple
                </Button> */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full gap-2"
                  )}
                  onClick={async () => {
                    setError("");
                    setLoading(true);
                    
                    try {
                      const result = await signIn.social({
                        provider: "google",
                        callbackURL: callbackURL
                      });
                      
                      if (result?.error) {
                        setError(result.error.message || "Google sign-in failed");
                        toast.error(result.error.message || "Google sign-in failed. Please try again.");
                      }
                    } catch (error) {
                      console.error("Google sign-in error:", error);
                      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed. Please try again.";
                      setError(errorMessage);
                      toast.error(errorMessage);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
				<path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
				<path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
				<path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
				<path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
			</svg>
                  Sign in with Google
                </Button>
            </div>
      </CardContent>
      <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              Powered by{" "}
              <Link
                href="https://better-auth.com"
                className="underline"
                target="_blank"
              >
                <span className="dark:text-orange-200/90">better-auth.</span>
              </Link>
            </p>
          </div>
        </CardFooter>
    </Card>
  );
}