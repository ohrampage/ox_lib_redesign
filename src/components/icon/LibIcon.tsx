import { cn } from "@/lib/utils";
import type { LibIconProps } from "@/types/icon";
import { Icon } from "@iconify/react";
import { styled } from "@stitches/react";

const StyledIcon = styled(Icon, {
  color: "var(--slate-11)",
});

export const LibIcon = ({ icon, className }: LibIconProps) => {
  return (
    <StyledIcon icon={icon.includes(":") ? icon : `fa7-solid:${icon}`} className={cn(className)} />
  );
};
