import { authClient } from "@/lib/auth-client";
import { User } from "@/components/Interface/InterfaceUser";

// Fetch users with pagination and search
export async function fetchUsers(pageNum = 1, search = "", pageSize = 10): Promise<{
  users: User[];
  totalPages: number;
}> {
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
}

// Create new user
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> {
  await authClient.admin.createUser({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role as "user" | "admin",
  });
}

// Ban user
export async function banUser(userId: string): Promise<void> {
  await authClient.admin.banUser({ userId });
}

// Unban user
export async function unbanUser(userId: string): Promise<void> {
  await authClient.admin.unbanUser({ userId });
}

// Change user role
export async function changeRole(userId: string, role: string): Promise<void> {
  await authClient.admin.setRole({ userId, role: role as "user" | "admin" });
}

// Delete user
export async function deleteUser(userId: string): Promise<void> {


  await authClient.admin.removeUser({ userId });
}

// Impersonate user
export async function impersonateUser(userId: string): Promise<void> {
  await authClient.admin.impersonateUser({ userId });
  window.location.href = "/"; // Redirect to home
}

// Stop impersonating
export async function stopImpersonating(): Promise<void> {
  await authClient.admin.stopImpersonating();
  window.location.href = "/dashboard"; // Redirect to dashboard
} 