"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
//import Image from "next/image";
import { Loader2, /* X */ } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignUpProps {
	callbackURL?: string;
}

export function SignUp({ callbackURL = "/dashboard" }: SignUpProps) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	//const [image, setImage] = useState<File | null>(null);
	//const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

/* 	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}; */

	const handleSubmit = async () => {
		console.log("Form submitted!", { email, firstName, lastName, passwordLength: password.length });
		console.log("authClient:", authClient);
		console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
		
		// Basic validation
		if (!firstName.trim()) {
			toast.error("Please enter your first name");
			return;
		}
		
		if (!lastName.trim()) {
			toast.error("Please enter your last name");
			return;
		}
		
		if (!email.trim()) {
			toast.error("Please enter your email address");
			return;
		}
		
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}
		
		// Validate password confirmation
		if (password !== passwordConfirmation) {
			toast.error("Passwords do not match");
			return;
		}

		// Check if environment variable is set
		if (!process.env.NEXT_PUBLIC_APP_URL) {
			toast.error("App configuration error: NEXT_PUBLIC_APP_URL not set");
			console.error("NEXT_PUBLIC_APP_URL environment variable is not set");
			return;
		}

		console.log("All validations passed, attempting sign up...");
		setLoading(true);
		
		try {
			console.log("Calling authClient.signUp.email...");
			const { data, error } = await authClient.signUp.email({
				email: email.trim(),
				password,
				name: `${firstName.trim()} ${lastName.trim()}`,
				callbackURL: callbackURL,
			}, {
				onRequest: (ctx) => {
					console.log("Sign up request:", ctx);
					setLoading(true);
				},
				onSuccess: (ctx) => {
					console.log("Sign up success:", ctx);
					toast.success("Account created successfully!");
					setLoading(false);
					router.push("/dashboard");
				},
				onError: (ctx) => {
					console.error("Sign up error:", ctx);
					toast.error(ctx.error.message || "Failed to create account");
					setLoading(false);
				},
			});
			
			console.log("SignUp result:", { data, error });
			
			if (error) {
				console.error("SignUp error:", error);
				toast.error(error.message || "Failed to create account");
			} else if (data) {
				console.log("SignUp successful!");
				toast.success("Account created successfully!");
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Sign up error:", error);
			toast.error("Failed to create account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="z-50 rounded-md rounded-t-none max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">First name</Label>
							<Input
								id="first-name"
								placeholder="Max"
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">Last name</Label>
							<Input
								id="last-name"
								placeholder="Robinson"
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password_confirmation">Confirm Password</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Confirm Password"
						/>
					</div>
				
					<Button 
						className="w-full" 
						disabled={loading}
						onClick={async () => {
							console.log("Button clicked!");
							await handleSubmit();
						}}
						aria-label={loading ? "Creating account..." : "Create your account"}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							"Create an account"
						)}
					</Button>
				</div>
			</CardContent>

		</Card>
	);
}

