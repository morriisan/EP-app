"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagementTab } from "@/components/admin/UserManagementTab";
import { CreateUserTab } from "@/components/admin/CreateUserTab";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { User } from "@/components/Interface/InterfaceUser";
import { 
  fetchUsers, 
  createUser, 
  banUser, 
  unbanUser, 
  changeRole, 
  deleteUser, 
  impersonateUser, 
  stopImpersonating 
} from "@/services/AdminServices";

export function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (session?.user.role === "admin") {
      handleFetchUsers();
    }
  }, [session]);
  
  // Fetch users
  const handleFetchUsers = async (pageNum = 1, search = "") => {
    setLoading(true);
    try {
      const result = await fetchUsers(pageNum, search);
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (error) {
      // Error is already handled in the service
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

 

  // Create new user
  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);
    const success = await createUser(userData);
    if (success) {
      handleFetchUsers(page, searchTerm);
    }
    setLoading(false);
  };

  // Ban user
  const handleBanUser = async (userId: string) => {
    const success = await banUser(userId);
    if (success) {
      handleFetchUsers(page, searchTerm);
    }
  };

  // Unban user
  const handleUnbanUser = async (userId: string) => {
    const success = await unbanUser(userId);
    if (success) {
      handleFetchUsers(page, searchTerm);
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, role: string) => {
    const success = await changeRole(userId, role);
    if (success) {
      handleFetchUsers(page, searchTerm);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      handleFetchUsers(page, searchTerm);
    }
  };

  // Impersonate user
  const handleImpersonateUser = async (userId: string) => {
    await impersonateUser(userId);
    // No need to fetch users as we're redirecting
  };

  // Stop impersonating
  const handleStopImpersonating = async () => {
    await stopImpersonating();
    // No need to fetch users as we're reloading the page
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    handleFetchUsers(1, term);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    handleFetchUsers(newPage, searchTerm);
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
      
      {session && typeof session === 'object' && 'impersonatedBy' in session && (
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