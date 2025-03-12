"use client";

import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserManagementTab } from "@/components/admin/UserManagementTab";
import { CreateUserTab } from "@/components/admin/CreateUserTab";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";

export function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  const fetchUsers = async (pageNum = 1, search = "") => {
    setLoading(true);
    try {
      const pageSize = 10;
      const result = await authClient.admin.listUsers({
        query: {
          limit: pageSize,
          offset: (pageNum - 1) * pageSize,
          ...(search ? {
            searchField: "email",
            searchOperator: "contains",
            searchValue: search
          } : {})
        }
      });
      
      if (result.data) {
        setUsers(result.data.users);
        setTotalPages(Math.ceil(result.data.total / pageSize));
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.role === "admin") {
      fetchUsers();
    }
  }, [session]);

  // Create new user
  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);
    
    try {
      await authClient.admin.createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role as "user" | "admin"
      });
      
      toast.success("User created successfully");
      fetchUsers(page, searchTerm);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Ban user
  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({ userId });
      toast.success("User banned successfully");
      fetchUsers(page, searchTerm);
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    }
  };

  // Unban user
  const handleUnbanUser = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({ userId });
      toast.success("User unbanned successfully");
      fetchUsers(page, searchTerm);
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Failed to unban user");
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, role: string) => {
    try {
      await authClient.admin.setRole({ userId, role: role as "user" | "admin" });
      toast.success("User role updated successfully");
      fetchUsers(page, searchTerm);
    } catch (error) {
      console.error("Error changing user role:", error);
      toast.error("Failed to change user role");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    try {
      await authClient.admin.removeUser({ userId });
      toast.success("User deleted successfully");
      fetchUsers(page, searchTerm);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Impersonate user
  const handleImpersonateUser = async (userId: string) => {
    try {
      await authClient.admin.impersonateUser({ userId });
      toast.success("Now impersonating user");
      window.location.href = "/dashboard"; // Redirect to dashboard
    } catch (error) {
      console.error("Error impersonating user:", error);
      toast.error("Failed to impersonate user");
    }
  };

  // Stop impersonating
  const handleStopImpersonating = async () => {
    try {
      await authClient.admin.stopImpersonating();
      toast.success("Stopped impersonating");
      window.location.reload();
    } catch (error) {
      console.error("Error stopping impersonation:", error);
      toast.error("Failed to stop impersonating");
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchUsers(1, term);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchTerm);
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
      
      {session && typeof (session as any).impersonatedBy !== 'undefined' && (
        <ImpersonationBanner onStopImpersonating={handleStopImpersonating} />
      )}
      
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