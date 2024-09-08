"use client"

import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profile_photo: string;
  role_name: string;
  route: string
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await getUserData();

        if (!userData) {
          throw new Error('User not found');
        }

        setUser(userData);

        if (userData.role_name !== 'Administrador') {
          toast.error("No tienes acceso a esta sección");
          return userData.role_name === "Voluntario" ? redirect("/volunteer") : redirect("/organization")
        }
      } catch (error) {
        if (typeof window !== "undefined") {
          router.push("/auth/signin");
        }
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center left-0 top-0">
        <div className="container_w">
          <div className="tree">
            <div className='branch' style={{ "--x": 0 } as React.CSSProperties}>
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

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

const getUserData = async (): Promise<User> => {
  const res = await axios.get('http://localhost:4000/api/dashboard', {
    withCredentials: true,
  });
  const data = res.data;
  let route:string = "/";
  if(data.role_name === "Administrador"){
    route = "/admin"
  }else if(data.role_name === "Voluntario"){
    route = "/volunteer"
  }else{
    route = "/organization"
  }

  const u = {
    id: data.id,
    name: data.name,
    surname: data.surname,
    email: data.email,
    profile_photo: data.profile_photo,
    route: route
  }
  return res.data;
};
