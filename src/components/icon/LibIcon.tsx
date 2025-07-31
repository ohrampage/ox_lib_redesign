import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { styled, type ComponentProps } from "@stitches/react";

interface LibIconComponentProps extends ComponentProps<typeof StyledIcon> {
  icon: string;
}

const StyledIcon = styled(Icon, {
  color: "var(--white-a11)",
});

export const LibIcon = ({ icon, className }: LibIconComponentProps) => {
  return (
    <StyledIcon icon={icon.includes(":") ? icon : `fa7-solid:${icon}`} className={cn(className)} />
  );
};
