import type { IconProp } from "./icon";

export interface AlertProps {
  header: string;
  content: string;
  icon?: IconProp;
  labels?: {
    cancel?: string;
    confirm?: string;
  };
}

export type AlertCloseType = "cancel" | "confirm";
