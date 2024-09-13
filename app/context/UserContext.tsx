"use client";

import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profile_photo: string;
  role_name: string;
  role_path: string;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const routeActual = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await getUserData();
        
        if (!userData || !userData.id) {
          throw new Error("User not found");
        }

        setUser(userData);
        // Redirigir al usuario según su rol
        if (userData.role_path !== routeActual) {
          toast.success(`Redirigiendo según tu rol: ${userData.role_name}`);
          router.push(userData.role_path);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        if (typeof window !== "undefined") {
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
    const token = localStorage.getItem("jwt"); // Obtener el token del localStorage o cualquier otro lugar donde lo guardes
    const res = await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Full response:", res); // Agrega este log
    if (res.data) {
      const data = res.data;
      console.log("User data:", data);
      // Asegúrate de que la estructura de datos coincide con la de tu interfaz
      return {
        id: data.id,
        name: data.name, // Ajusta según la estructura de respuesta de Strapi
        surname: data.surname, // Ajusta según la estructura de respuesta de Strapi
        email: data.email,
        profile_photo: data.profile_photo || '', // Ajusta según la estructura de respuesta de Strapi
        role_name: data.role_public_name, // Ajusta según la estructura de respuesta de Strapi
        role_path: `${data.role_path}`, // Ajusta según la estructura de respuesta de Strapi
      };
    } else {
      throw new Error("Data is empty or invalid");
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error; // Propagar el error para que el useEffect lo capture
  }
};
