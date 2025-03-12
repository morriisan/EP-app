import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@/components/Interface/InterfaceUser";


interface UserTableProps {
  users: User[];
  loading: boolean;
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
  onChangeRole: (userId: string, role: string) => void;
  onImpersonateUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserTable({
  users,
  loading,
  onBanUser,
  onUnbanUser,
  onChangeRole,
  onImpersonateUser,
  onDeleteUser
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-center py-8 text-gray-500">No users found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                <select
                  value={user.role}
                  onChange={(e) => onChangeRole(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-2 px-4">
                {user.banned ? (
                  <span className="text-red-500">Banned</span>
                ) : (
                  <span className="text-green-500">Active</span>
                )}
              </td>
              <td className="py-2 px-4 flex gap-2">
                {user.banned ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onUnbanUser(user.id)}
                  >
                    Unban
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onBanUser(user.id)}
                  >
                    Ban
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onImpersonateUser(user.id)}
                >
                  Impersonate
                </Button>
                
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 