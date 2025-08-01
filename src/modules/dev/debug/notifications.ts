import type { NotificationProps } from "@/types/notifications";
import { debugData } from "@/utils/debugData";

export const debugNotification = () => {
  debugData<NotificationProps>([
    {
      action: "notify",
      data: {
        title: "Success",
        description: "Notification with duration",
        type: "success",
        id: "pogchamp",
        duration: 10000,
        alignIcon: "top",
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: "notify",
      data: {
        title: "Error",
        type: "error",
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: "notify",
      data: {
        title: "Custom icon success",
        description: "Notification description",
        type: "success",
        icon: "icon-[ion--hardware-chip]",
        showDuration: false,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: "notify",
      data: {
        title: "Default notification",
        duration: 30000,
      },
    },
  ]);
};
