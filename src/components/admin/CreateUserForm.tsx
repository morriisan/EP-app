import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { EmailValidator } from "@/components/Validators/EmailValidator";

interface CreateUserFormProps {
  onSubmit: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  loading: boolean;
}

export function CreateUserForm({ onSubmit, loading }: CreateUserFormProps) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if email is invalid or already exists
    if (!isEmailValid || emailExists) {
      return;
    }
    
    await onSubmit(userData);
    setUserData({ name: "", email: "", password: "", role: "user" });
  };

  const handleEmailChange = (email: string, isValid: boolean, exists: boolean) => {
    setUserData({ ...userData, email });
    setIsEmailValid(isValid);
    setEmailExists(exists);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={userData.name}
          onChange={(e) => setUserData({...userData, name: e.target.value})}
          required
        />
      </div>
      
      <EmailValidator
        value={userData.email}
        onChange={handleEmailChange}
        label="Email"
        placeholder="user@example.com"
      />
      
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={userData.role}
          onChange={(e) => setUserData({...userData, role: e.target.value})}
          className="border rounded p-2 bg-theme-accent-secondary"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !isEmailValid || emailExists}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Create User
      </Button>
      
      {emailExists && (
        <p className="text-center text-sm text-yellow-500">
          This email is already registered. Please use a different email.
        </p>
      )}
    </form>
  );
} 