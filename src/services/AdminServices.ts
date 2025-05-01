import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User } from "@/components/Interface/InterfaceUser";

// Fetch users with pagination and search
export async function fetchUsers(pageNum = 1, search = "", pageSize = 10): Promise<{
  users: User[];
  totalPages: number;
}> {
  try {
    const result = await authClient.admin.listUsers({
      query: {
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
        ...(search
          ? {
              searchField: "email",
              searchOperator: "contains",
              searchValue: search,
            }
          : {}),
      },
    });

    if (result.data) {
      return {
        users: result.data.users as User[],
        totalPages: Math.ceil(result.data.total / pageSize),
      };
    }
    
    return { users: [], totalPages: 0 };
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to fetch users");
    throw error;
  }
}

// Create new user
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<boolean> {
  try {
    await authClient.admin.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role as "user" | "admin",
    });

    toast.success("User created successfully");
    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    toast.error("Failed to create user");
    return false;
  }
}

// Ban user
export async function banUser(userId: string): Promise<boolean> {
  try {
    await authClient.admin.banUser({ userId });
    toast.success("User banned successfully");
    return true;
  } catch (error) {
    console.error("Error banning user:", error);
    toast.error("Failed to ban user");
    return false;
  }
}

// Unban user
export async function unbanUser(userId: string): Promise<boolean> {
  try {
    await authClient.admin.unbanUser({ userId });
    toast.success("User unbanned successfully");
    return true;
  } catch (error) {
    console.error("Error unbanning user:", error);
    toast.error("Failed to unban user");
    return false;
  }
}

// Change user role
export async function changeRole(userId: string, role: string): Promise<boolean> {
  try {
    await authClient.admin.setRole({ userId, role: role as "user" | "admin" });
    toast.success("User role updated successfully");
    return true;
  } catch (error) {
    console.error("Error changing user role:", error);
    toast.error("Failed to change user role");
    return false;
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<boolean> {
  if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
    return false;
  }

  try {
    await authClient.admin.removeUser({ userId });
    toast.success("User deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user");
    return false;
  }
}

// Impersonate user
export async function impersonateUser(userId: string): Promise<boolean> {
  try {
    await authClient.admin.impersonateUser({ userId });
    toast.success("Now impersonating user");
    window.location.href = "/"; // Redirect to home
    return true;
  } catch (error) {
    console.error("Error impersonating user:", error);
    toast.error("Failed to impersonate user");
    return false;
  }
}

// Stop impersonating
export async function stopImpersonating(): Promise<boolean> {
  try {
    await authClient.admin.stopImpersonating();
    toast.success("Stopped impersonating");
    window.location.href = "/dashboard"; // Redirect to dashboard
    return true;
  } catch (error) {
    console.error("Error stopping impersonation:", error);
    toast.error("Failed to stop impersonating");
    return false;
  }
} 