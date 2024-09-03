import { INotification, NotificationTypeEnum } from "@/libs/types";

export type NotificationFormInput = {
  type: NotificationTypeEnum;
  notificationValue: string;
};

export const generateContent = (data: INotification) => {
  switch (data.typeCode) {
    case NotificationTypeEnum.SYSTEM:
      return {
        title: "[Platform update]",
        content: data.releaseNumber,
      };
    case NotificationTypeEnum.COMMENT:
      return {
        title: "[Comment Tag]",
        content: `${data.personName} tagged you in a comment`,
      };
    case NotificationTypeEnum.ACCESS:
      return {
        title: "[Access granted]",
        content: `${data.personName} shared a chat with you`,
      };
    case NotificationTypeEnum.WORKSPACE:
      return {
        title: `[Join workspace]`,
        content: `${data.personName} joined your workspace`,
      };
    default:
      return;
  }
};

export const transformData = (
  data: NotificationFormInput
): { typeCode: string; releaseNumber?: string; personName?: string } => {
  return data.type === NotificationTypeEnum.SYSTEM
    ? {
        typeCode: data.type,
        releaseNumber: data.notificationValue,
      }
    : {
        typeCode: data.type,
        personName: data.notificationValue,
      };
};
