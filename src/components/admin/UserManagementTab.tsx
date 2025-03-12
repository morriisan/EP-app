import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/admin/UserTable";
import { Pagination } from "@/components/admin/Pagination";
import { SearchForm } from "@/components/admin/SearchForm";

interface UserManagementTabProps {
  users: any[];
  loading: boolean;
  page: number;
  totalPages: number;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onPageChange: (page: number) => void;
  onBanUser: (userId: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  onChangeRole: (userId: string, role: string) => Promise<void>;
  onImpersonateUser: (userId: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserManagementTab({
  users,
  loading,
  page,
  totalPages,
  searchTerm,
  onSearch,
  onPageChange,
  onBanUser,
  onUnbanUser,
  onChangeRole,
  onImpersonateUser,
  onDeleteUser
}: UserManagementTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View, edit, and manage user accounts
        </CardDescription>
        
        <SearchForm onSearch={onSearch} initialValue={searchTerm} />
      </CardHeader>
      
      <CardContent>
        <UserTable 
          users={users}
          loading={loading}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
          onChangeRole={onChangeRole}
          onImpersonateUser={onImpersonateUser}
          onDeleteUser={onDeleteUser}
        />
      </CardContent>
      
      <CardFooter>
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />
      </CardFooter>
    </Card>
  );
} 