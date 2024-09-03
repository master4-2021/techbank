import {
  INotification,
  INotificationType,
  NotificationTypeEnum,
} from "@/libs/types";
import { NotificationFormInput, transformData } from "@/libs/utils";
import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Select,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { trpc } from "@/libs/trpc";
import { useNotificationContext } from "./NotificationProvider";

type Props = {
  notificationTypes: INotificationType[];
};

const schema = yup
  .object({
    type: yup
      .mixed<NotificationTypeEnum>()
      .oneOf(Object.values(NotificationTypeEnum))
      .required(),
    notificationValue: yup.string().required(),
  })
  .required();

export default function NotificationForm({ notificationTypes }: Props) {
  const { setNotifications, notifications } = useNotificationContext();
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NotificationFormInput>({
    defaultValues: {
      type: NotificationTypeEnum.SYSTEM,
      notificationValue: "",
    },
    resolver: yupResolver(schema),
  });
  const mutation = trpc.notification.create.useMutation({
    onSuccess: (data) => {
      setNotifications([...notifications, data as INotification]);
    },
  });

  const onSubmit: SubmitHandler<NotificationFormInput> = (data) => {
    if (!Object.keys(errors)?.length) {
      mutation.mutate(transformData(data));
      setDialogOpen(false);
    } else {
      console.log(errors);
    }
  };

  const [type, setType] = useState(NotificationTypeEnum.SYSTEM);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onTypeChange = (value: NotificationTypeEnum) => {
    setValue("type", value);
    setType(value);
  };

  const onValueChange = (value: string) => {
    setValue("notificationValue", value);
  };

  return (
    <Dialog.Root open={isDialogOpen}>
      <Dialog.Trigger
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        <Button>Create</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create notification</Dialog.Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Type
              </Text>
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={onTypeChange}
                    defaultValue={field.value}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {notificationTypes?.length
                        ? notificationTypes.map((item) => (
                            <Select.Item key={item.code} value={item.code}>
                              {item.name}
                            </Select.Item>
                          ))
                        : null}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  Type is a required field
                </p>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {type === NotificationTypeEnum.SYSTEM
                  ? "Release number"
                  : "Person name"}
              </Text>
              <Controller
                name="notificationValue"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField.Root
                    defaultValue={field.value}
                    onChange={(e) => onValueChange(e.target.value)}
                    placeholder={`Enter ${
                      type === NotificationTypeEnum.SYSTEM
                        ? "release number"
                        : "person name"
                    }`}
                  />
                )}
              />
              {errors.notificationValue && (
                <p className="text-red-500 text-sm mt-1">{`${
                  type === NotificationTypeEnum.SYSTEM
                    ? "Release number"
                    : "Person name"
                } is a required field`}</p>
              )}
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close onClick={() => setDialogOpen(false)}>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            {/* <Dialog.Close> */}
            <button type="submit">Save</button>
            {/* </Dialog.Close> */}
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
