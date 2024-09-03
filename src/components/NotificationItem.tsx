import { trpc } from "@/libs/trpc";
import { INotification, NotificationTypeEnum } from "@/libs/types";
import { generateContent } from "@/libs/utils";
import { useNotificationContext } from "./NotificationProvider";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import { RocketIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function NotificationItem({ data }: { data: INotification }) {
  const content = generateContent(data);
  const router = useRouter();
  const { setNotifications, notifications } = useNotificationContext();
  const mutation = trpc.notification.markAsRead.useMutation({
    onSuccess: (updated) => {
      const index = notifications.findIndex((i) => i.id === updated.id);
      setNotifications([
        ...notifications.slice(0, index),
        updated as INotification,
        ...notifications.slice(index + 1),
      ]);
    },
  });

  const onClick = () => {
    if (!data.isRead) {
      mutation.mutate({ id: data.id as number });
    }

    if (data.typeCode !== NotificationTypeEnum.SYSTEM) {
      let path = "/";
      switch (data.typeCode) {
        case NotificationTypeEnum.COMMENT:
          path = "/comment";
          break;
        case NotificationTypeEnum.ACCESS:
          path = "/chat";
          break;
        case NotificationTypeEnum.WORKSPACE:
          path = "/workspace";
          break;
        default:
          return;
      }

      router.push(path);
    } else {
      alert(data.releaseNumber);
    }
  };

  return (
    <Card
      className={`mb-2 hover:bg-cyan-400 ${
        data.isRead ? "bg-cyan-50" : "bg-gray-400"
      }`}
      onClick={onClick}
    >
      <Flex gap="3" align="center">
        {data.typeCode === NotificationTypeEnum.SYSTEM ? (
          <RocketIcon />
        ) : (
          <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback={`${data.personName?.charAt(0).toUpperCase()}`}
          />
        )}
        <Box>
          <Text as="div" size="2" weight="bold">
            {content?.title}
          </Text>
          <Text as="div" size="2" color="gray">
            {content?.content}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
