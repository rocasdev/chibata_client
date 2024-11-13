import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";
import { User } from "@/types/user";

export function useUsers(currentPage: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/users?page=${page}&limit=10`,
        { withCredentials: true },
      );
      const users = response.data.users;
      const totalPages = response.data.totalPages;
      setUsers(users);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  // Agregamos la función mutate para actualizar los datos
  const mutate = useCallback(async () => {
    await fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  return { users, isLoading, error, totalPages, mutate };
}

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (uid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/users/${uid}`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Error fetching user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(id);
  }, [id, fetchUser]);

  const mutate = useCallback(async () => {
    await fetchUser(id);
  }, [id, fetchUser]);

  return { user, isLoading, error, mutate };
}

export function useToggleUserStatus() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/users/${userId}/toggle-state`,
        {},
        { withCredentials: true },
      );
      return response.data.user;
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Error toggling user status");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { toggleStatus, isLoading, error };
}
