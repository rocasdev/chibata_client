"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Notification, columns } from "./columns";
import {DataTable} from '../data-table'


const NotificationTable: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async (page: number) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(
        `http://localhost:1337/api/notifications?page=${page}`, { headers: {Authorization: `Bearer ${token}`}}
      );
      setNotifications(res.data.notifications);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="w-full h-full bg-black py-8">
      <DataTable columns={columns} data={notifications} />
    </div>
  );
};

export default NotificationTable;
