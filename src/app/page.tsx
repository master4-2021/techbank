"use client";

import NotificationForm from "@/components/NotificationForm";
import NotificationItem from "@/components/NotificationItem";
import { useNotificationContext } from "@/components/NotificationProvider";
import { trpc } from "@/libs/trpc";
import { INotificationType } from "@/libs/types";
import { BellIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";

export default function Home() {
  const { notifications, notificationTypes, unreadNo } =
    useNotificationContext();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" color="cyan">
            <BellIcon />{" "}
            {unreadNo ? <Badge color="crimson">{unreadNo}</Badge> : null}{" "}
            Notifications
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant="soft" color="cyan" size="2">
          <Container size="1">
            {notifications?.length ? (
              notifications?.map((item) => (
                // <DropdownMenu.Item className="h-fit" key={item.id}>
                <NotificationItem key={item.id} data={item} />
                // </DropdownMenu.Item>
              ))
            ) : (
              <>Notification is empty</>
            )}
            <DropdownMenu.Separator />
            <Container>
              <Flex direction="column">
                <NotificationForm
                  notificationTypes={notificationTypes as INotificationType[]}
                />
              </Flex>
            </Container>
          </Container>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </main>
  );
}
