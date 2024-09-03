import prisma from "../libs/prismaClient";
import { INotificationType, NotificationTypeEnum } from "../libs/types";

const notificationTypes: INotificationType[] = [
  {
    name: "Platform update",
    color: "#090b00",
    code: NotificationTypeEnum.SYSTEM,
  },
  {
    name: "Comment tag",
    color: "#00b1de",
    code: NotificationTypeEnum.COMMENT,
  },
  {
    name: "Access granted",
    color: "#b1de00",
    code: NotificationTypeEnum.ACCESS,
  },
  {
    name: "Join workspace",
    color: "#006078",
    code: NotificationTypeEnum.WORKSPACE,
  },
];

async function main() {
  await prisma.notificationType.deleteMany({});

  const records = await prisma.notificationType.createMany({
    data: notificationTypes,
  });

  console.log(`Created ${records.count} records`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
