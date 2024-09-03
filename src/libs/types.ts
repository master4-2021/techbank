export interface INotificationType {
  id?: number;
  name: string;
  color: string;
  code: NotificationTypeEnum;
  notifications?: INotification[];
  createdAt?: Date;
}

export interface INotification {
  id?: number;
  typeCode: NotificationTypeEnum;
  releaseNumber?: string;
  personName?: string;
  isRead: boolean;
  typeDetail?: INotificationType;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum NotificationTypeEnum {
  SYSTEM = "PU",
  COMMENT = "CT",
  ACCESS = "AG",
  WORKSPACE = "JW",
}
