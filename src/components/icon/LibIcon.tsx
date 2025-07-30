import { cn } from "@/lib/utils";
import type { LibIconProps } from "@/types/icon";
import { Icon } from "@iconify/react";

export const LibIcon = ({ icon, className }: LibIconProps) => {
  return (
    <Icon
      icon={icon.includes(":") ? icon : `fa7-solid:${icon}`}
      className={cn(className)}
    />
  );
};
