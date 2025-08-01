import type { AlertProps } from "@/types";
import { debugData } from "@/utils/debugData";

export const debugAlert = () => {
  debugData<AlertProps>([
    {
      action: "sendAlert",
      data: {
        header: "Debug Alert",
        content: "This is a debug alert message.",
        icon: "icon-[ion--alert-circle-sharp]",
        // labels: {
        //   confirm: "OK",
        //   cancel: "Cancel",
        // },
      },
    },
  ]);
};
