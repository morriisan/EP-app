"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash"; // You'll need to install this: npm install lodash

interface EmailValidatorProps {
  value: string;
  onChange: (value: string, isValid: boolean, exists: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function EmailValidator({
  value,
  onChange,
  label = "Email",
  placeholder = "Enter your email",
  required = true,
  className,
}: EmailValidatorProps) {
  const [email, setEmail] = useState(value);
  const [isValid, setIsValid] = useState(false);
  const [exists, setExists] = useState(false);
  const [checking, setChecking] = useState(false);
  const [touched, setTouched] = useState(false);

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email exists in the database
  const checkEmailExists = async (email: string) => {
    if (!emailRegex.test(email)) {
      return;
    }

    setChecking(true);
    try {
      const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setExists(data.exists);
        onChange(email, true, data.exists);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    } finally {
      setChecking(false);
    }
  };

  // Debounce the API call to avoid too many requests
  const debouncedCheckEmail = debounce(checkEmailExists, 500);

  // Validate email on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const valid = emailRegex.test(email);
    setIsValid(valid);
    
    if (valid && touched) {
      debouncedCheckEmail(email);
    } else {
      onChange(email, valid, false);
    }
    
    return () => {
      debouncedCheckEmail.cancel();
    };
  }, [email]);

  // Update when external value changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (value !== email) {
      setEmail(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);
    setTouched(true);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor="email" className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
          {checking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </Label>
      )}
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={cn(
            "pr-10",
            touched && email && !isValid && "border-red-500 focus-visible:ring-red-500",
            touched && isValid && !exists && "border-green-500 focus-visible:ring-green-500",
            touched && isValid && exists && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
        {touched && email && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {!isValid && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            {isValid && !exists && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {isValid && exists && (
              <XCircle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        )}
      </div>
      {touched && email && (
        <div className="text-xs">
          {!isValid && (
            <p className="text-red-500">Please enter a valid email address</p>
          )}
          {isValid && exists && (
            <p className="text-yellow-500">This email is already registered</p>
          )}
          {isValid && !exists && (
            <p className="text-green-500">Email is available</p>
          )}
        </div>
      )}
    </div>
  );
}