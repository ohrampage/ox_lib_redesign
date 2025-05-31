export interface AlertProps {
  header: string;
  content: string;
  icon?: `icon-[${string}]`;
  labels?: {
    cancel?: string;
    confirm?: string;
  };
}

export type AlertCloseType = "cancel" | "confirm";
