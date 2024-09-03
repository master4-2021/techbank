"use client";

import { trpc } from "@/libs/trpc";
import { INotification, INotificationType } from "@/libs/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type NotificationContext = {
  notifications: INotification[];
  notificationTypes: INotificationType[];
  setNotifications: (data: INotification[]) => void;
};

const Context = createContext<NotificationContext | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationTypes, setNotificationTypes] = useState<
    INotificationType[]
  >([]);

  const notificationQuery = trpc.notification.getAll.useQuery();
  const notificationTypeQuery = trpc.notificationType.useQuery();

  useEffect(() => {
    if (notificationQuery.isLoading || notificationTypeQuery.isLoading) {
      return;
    } else {
      setNotifications(notificationQuery.data as INotification[]);
      setNotificationTypes(notificationTypeQuery.data as INotificationType[]);
    }
  }, [notificationQuery.isLoading, notificationTypeQuery.isLoading]);

  useEffect(() => {
    if (notificationQuery.error) {
      console.error("Error fetching notifications:", notificationQuery.error);
    }
    if (notificationTypeQuery.error) {
      console.error(
        "Error fetching notification types:",
        notificationTypeQuery.error
      );
    }
  }, [notificationQuery.error, notificationTypeQuery.error]);

  const contextValues = {
    notifications,
    notificationTypes,
    setNotifications,
  };

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};
