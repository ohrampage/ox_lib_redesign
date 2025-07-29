import { cn } from "@/lib/utils";
import type { LibIconProps } from "@/types/icon";

export const LibIcon = ({ icon, className }: LibIconProps) => {
  return (
    <span
      className={cn(
        `${icon.startsWith("icon-") ? icon : `icon-[fa7-solid--${icon}]`}`,
        className
      )}
    />
  );
};
