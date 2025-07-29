import { toast, Toaster } from "sonner";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { NotificationProps } from "@/types/notifications";
import { LibIcon } from "@/components/icon/LibIcon";

export const Notifications = () => {
  useNuiEvent<NotificationProps>("notify", (data) => {
    if (!data.title && !data.description) return;

    const {
      id,
      title,
      description,
      type = "inform",
      duration = 3000,
      position = "top-right",
      icon,
      alignIcon = "top",
      iconColor,
      showDuration = false,
    } = data;

    // Map position values for backwards compatibility
    let mappedPosition = position;
    if (position === "top") mappedPosition = "top-center";
    if (position === "bottom") mappedPosition = "bottom-center";

    // get the appropriate icon based on notification type
    const iconType = getIconByType(type);
    const color = getColorByType(type);

    // Show the toast with Sonner
    toast(
      <div className="flex gap-2 items-center">
        <div
          className={`flex h-full ${
            alignIcon === "center"
              ? "self-center"
              : "self-start flex-shrink-0 mt-0.5"
          }`}
        >
          <LibIcon
            icon={icon ? icon : iconType}
            className={`text-${color}-400 self-center text-lg`}
          />
        </div>
        <div className="flex-1">
          {title && (
            <div className={`text-${color}-400 font-medium`}>{title}</div>
          )}
          {description && (
            <div className={`text-${color}-200 text-xs`}>{description}</div>
          )}
        </div>
      </div>,
      {
        id: id?.toString(),
        duration,
        position: mappedPosition as any,
        style: {
          alignItems: alignIcon === "center" ? "center" : "flex-start",
        },
      }
    );
  });

  return <Toaster expand closeButton richColors theme="dark" />;
};

function getIconByType(type: string) {
  switch (type) {
    case "inform":
      return "icon-[ion--information-circle]";
    case "error":
      return "icon-[ion--close-circle]";
    case "success":
      return "icon-[ion--checkmark-circle]";
    case "warning":
      return "icon-[ion--warning]";
    default:
      return "icon-[ion--information-circle]";
  }
}

function getColorByType(type: string) {
  switch (type) {
    case "inform":
      return "blue";
    case "error":
      return "red";
    case "success":
      return "green";
    case "warning":
      return "yellow";
    default:
      return "blue";
  }
}
