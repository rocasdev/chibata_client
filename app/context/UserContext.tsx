"use client"

import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface User {
  user_id: string;
  firstname: string;
  surname: string;
  email: string;
  doc_type: string;
  doc_num: string;
  phone_number: string;
  avatar?: string;
  role_name: string;
  role_path: string;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Obtener solo el primer segmento de la ruta
  const routeActual = `/${pathname.split("/")[1]}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await getUserData();

        if (!userData || !userData.user_id) {
          throw new Error("User not signed in. Redirecting to signin page.");
        }

        setUser(userData);
        if (userData.role_path !== routeActual) {
          toast.success(`Redirigiendo según tu rol: ${userData.role_name}`);
          router.push(userData.role_path);
        }
      } catch (error) {
        if (typeof window !== "undefined") {
          toast("Inicia sesión para acceder a esta ruta.", { icon: "⚠️​" });
          router.push("/auth/signin");
        }
      }
    };

    fetchUser();
  }, [router, routeActual]);

  if (!user) {
    return (
      <div className="relative left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div className="container_w">
          {/* Loading UI */}
          <div className="tree">
            <div className="branch" style={{ "--x": 0 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 1 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 2 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 3 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="stem">
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <span className="shadow"></span>
          </div>
        </div>
      </div>
    );
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};

const getUserData = async (): Promise<User> => {
  try {
    const res = await axios.get("http://localhost:4000/api/users/me", {
      withCredentials: true
    });
    if (res.data) {
      const data = res.data.user;

      return {
        user_id: data.user_id,
        firstname: data.firstname,  
        surname: data.surname,
        email: data.email,
        doc_type: data.doc_type,
        doc_num: data.doc_num,
        phone_number: data.phone_number,
        avatar: data.avatar,
        role_name: data.Role.name,
        role_path: data.Role.path,
      };
    } else {
      throw new Error("No data received from API, signin to try it again");
    }
  } catch (error) {
    throw error.message;
  }
};
