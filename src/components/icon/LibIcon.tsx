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
  const validateIcon = (icon: string) => {
    // Check if the icon is a valid string
    if (typeof icon !== "string" || icon.trim() === "") {
      throw new Error("Invalid icon name provided");
    }

    // we may need to handle more cases depending on fa LibIcon used in original version
    if (icon.includes("fas fa")) {
      return icon.replace("fas fa-", "fa7-solid:");
    }

    if (icon.includes("far fa")) {
      return icon.replace("far fa-", "fa7-regular:");
    }

    if (icon.includes("fab fa")) {
      return icon.replace("fab fa-", "fa7-brands:");
    }

    if (icon.includes(":")) {
      return icon;
    } else {
      return `fa7-solid:${icon}`;
    }
  };

  return <StyledIcon icon={validateIcon(icon)} className={cn(className)} />;
};
