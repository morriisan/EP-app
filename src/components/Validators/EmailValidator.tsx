"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounceValue } from "@/hooks/useDebounce";
import useSWR from "swr";

interface EmailValidatorProps {
  value: string;
  onChange: (value: string, isValid: boolean, exists: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface EmailCheckResponse {
  exists: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function EmailValidator({
  value,
  onChange,
  label = "Email",
  placeholder = "Enter your email",
  required = true,
  className,
}: EmailValidatorProps) {
  const [email, setEmail] = useState(value);
  const [touched, setTouched] = useState(false);

  // Memoize regex to prevent recreations
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const isValid = emailRegex.test(email);

  // Debounce email for API calls
  const debouncedEmail = useDebounceValue(email, 200);

  // Use SWR for email existence checking
  const { data, isValidating } = useSWR<EmailCheckResponse>(
    touched && isValid ? `/api/check-email?email=${encodeURIComponent(debouncedEmail)}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 10000 // Cache results for 10 seconds
    }
  );

  const exists = data?.exists ?? false;

  // Update when external value changes
  useEffect(() => {
    if (value !== email) {
      setEmail(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Notify parent when validation status changes
  useEffect(() => {
    onChange(email, isValid, exists);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, isValid, exists]);

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
          {isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
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