import type React from "react";
import type { IconProp } from "./icon";
import type { ToasterProps } from "sonner";

export interface NotificationProps {
  style?: React.CSSProperties;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconProp;
  iconColor?: string;
  // iconAnimation?: IconAnimation;
  position?: ToasterProps["position"] | "top" | "bottom";
  id?: number | string;
  type?: "inform" | "error" | "success" | "warning";
  alignIcon?: "top" | "center";
}
