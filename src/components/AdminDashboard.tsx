"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagementTab } from "@/components/admin/UserManagementTab";
import { CreateUserTab } from "@/components/admin/CreateUserTab";
import { User } from "@/components/Interface/InterfaceUser";
import useSWR from "swr";
import { toast } from "sonner";
import { 
  fetchUsers,
  createUser, 
  banUser, 
  unbanUser, 
  changeRole, 
  deleteUser, 
  impersonateUser, 
} from "@/services/AdminServices";

interface UsersResponse {
  users: User[];
  totalPages: number;
}

export function AdminDashboard() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR with fetchUsers
  const { data, isLoading: loading, mutate: mutateUsers } = useSWR<UsersResponse>(
    session?.user.role === "admin" ? ['users', page, searchTerm] : null,
    () => fetchUsers(page, searchTerm),
    { 
      fallbackData: { users: [], totalPages: 1 },
      revalidateOnFocus: false
    }
  );

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  // Create new user
  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await createUser(userData);
      toast.success("User created successfully");
      mutateUsers();
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  // Ban user
  const handleBanUser = async (userId: string) => {
    try {
      await banUser(userId);
      toast.success("User banned successfully");
      mutateUsers();
    } catch (error) {
      toast.error("Failed to ban user");
      console.error("Error banning user:", error);
    }
  };

  // Unban user
  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast.success("User unbanned successfully");
      mutateUsers();
    } catch (error) {
      toast.error("Failed to unban user");
      console.error("Error unbanning user:", error);
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await changeRole(userId, role);
      toast.success("User role updated successfully");
      mutateUsers();
    } catch (error) {
      toast.error("Failed to change user role");
      console.error("Error changing user role:", error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      mutateUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  // Impersonate user
  const handleImpersonateUser = async (userId: string) => {
    try {
      await impersonateUser(userId);
      toast.success("Now impersonating user");
      // No need to mutate as we're redirecting
    } catch (error) {
      toast.error("Failed to impersonate user");
      console.error("Error impersonating user:", error);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!session || (session.user.role !== "admin")) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagementTab 
            users={users}
            loading={loading}
            page={page}
            totalPages={totalPages}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onChangeRole={handleChangeRole}
            onImpersonateUser={handleImpersonateUser}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>
        
        <TabsContent value="create">
          <CreateUserTab 
            onCreateUser={handleCreateUser}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 