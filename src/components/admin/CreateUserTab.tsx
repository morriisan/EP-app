import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

interface CreateUserTabProps {
  onCreateUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  loading: boolean;
}

export function CreateUserTab({ onCreateUser, loading }: CreateUserTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
        <CardDescription>
          Add a new user to the system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <CreateUserForm 
          onSubmit={onCreateUser}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
} 