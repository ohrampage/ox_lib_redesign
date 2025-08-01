import { styled } from "@stitches/react";
import { Flex } from "@/components/ui/flex";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card";
import { Progress, ProgressIndicator } from "@radix-ui/react-progress";
import { LibIcon } from "@/components/icon/LibIcon";
import { fetchNui } from "@/utils/fetchNui";
import { isIconUrl } from "@/utils";
import type { ContextMenuProps, Option } from "@/types/context";

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>("openContext", { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui("clickContext", id);
};

const ButtonRoot = styled("button", {
  height: "fit-content",
  width: "100%",
  padding: "10px",
  backgroundColor: "transparent",
  border: "none",

  "&:hover": {
    backgroundColor: "var(--white-a2)",
  },

  variants: {
    readOnly: {
      true: {
        color: "var(--white-a7)",
        "&:hover": {
          cursor: "unset",
        },
        "&:active": {
          transform: "unset",
        },
      },
    },
  },
});

const Label = styled("span", {
  width: "100%",
  whiteSpace: "pre-wrap",
  color: "var(--white-a10)",

  variants: {
    disabled: {
      true: {
        color: "var(--white-a7)",
      },
    },
  },
});

const Description = styled("p", {
  fontSize: "12px",
  color: "var(--white-a10)",

  variants: {
    disabled: {
      true: {
        color: "var(--white-a7)",
      },
    },
  },
});

const IconImage = styled("img", {
  maxWidth: "25px",
});

const StyledHoverCardContent = styled(HoverCardContent, {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  backgroundColor: "var(--black-a11)",
  padding: 8,
  borderRadius: 4,
  color: "var(--slate-5)",
  fontSize: "14px",
  maxWidth: "256px",
  width: "fit-content",
  border: "none",

  variants: {
    noData: {
      true: {
        padding: 0,
        backgroundColor: "transparent",
      },
    },
  },
});

const StyledProgress = styled(Progress, {
  width: "100%",
  minWidth: 220,
  height: 8,
  position: "relative",
  overflow: "clip",
  backgroundClip: "padding-box",
  borderRadius: "4px",
  backgroundColor: "var(--white-a3)",

  transform: "translateZ(0)",
});

const StyledProgressIndicator = styled(ProgressIndicator, {
  backgroundColor: "var(--white-a11)",
  width: "100%",
  height: "100%",
  transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
});

const Image = styled("img", {
  width: "100%",
  height: "auto",
  objectFit: "cover",
  aspectRatio: "1 / 1",
  borderRadius: 2,
});

const MetadataLabel = styled("span", {
  fontSize: 12,
  color: "var(--white-a9)",
});

const ButtonContent = ({
  button,
  buttonKey,
  disabled,
}: {
  button: Option;
  buttonKey: string;
  disabled: boolean;
}) => (
  <Flex direction="row" justify="between">
    <Flex direction="column" gap="1" align="start">
      <Flex direction="row" gap="1">
        {button?.icon && (
          <Flex direction="column" justify="center" align="center" css={{ width: 25, height: 25 }}>
            {typeof button.icon === "string" && isIconUrl(button.icon) ? (
              <IconImage src={button.icon} alt="Missing img" />
            ) : (
              <LibIcon icon={button.icon} />
            )}
          </Flex>
        )}
        <Label disabled={disabled}>{button.title || buttonKey}</Label>
      </Flex>
      {button.description && <Description disabled={disabled}>{button.description}</Description>}
      {button.progress !== undefined && (
        <StyledProgress value={button.progress}>
          <StyledProgressIndicator
            style={{ transform: `translateX(-${100 - button.progress}%)` }}
          />
        </StyledProgress>
      )}
    </Flex>
    {(button.menu || button.arrow) && button.arrow !== false && (
      <Flex direction="column" justify="center" align="center" css={{ width: 25, height: 25 }}>
        <LibIcon icon="chevron-right" />
      </Flex>
    )}
  </Flex>
);

export const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const [buttonKey, button] = option;
  const hasHoverContent = !button.disabled && (button.metadata || button.image);
  const disabled = button.disabled || false;

  const handleClick = () => {
    if (!button.disabled && !button.readOnly) {
      if (button.menu) {
        openMenu(button.menu);
      } else {
        clickContext(buttonKey);
      }
    }
  };

  if (!hasHoverContent) {
    return (
      <ButtonRoot disabled={disabled} readOnly={button.readOnly} onClick={handleClick}>
        <ButtonContent button={button} buttonKey={buttonKey} disabled={disabled} />
      </ButtonRoot>
    );
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <ButtonRoot disabled={disabled} readOnly={button.readOnly} onClick={handleClick}>
          <ButtonContent button={button} buttonKey={buttonKey} disabled={disabled} />
        </ButtonRoot>
      </HoverCardTrigger>
      <StyledHoverCardContent
        side="left"
        sideOffset={10}
        noData={!button.metadata && !button.image}
      >
        {button.image && <Image src={button.image} alt="" />}
        {Array.isArray(button.metadata)
          ? button.metadata.map((metadata, index) => (
              <div key={`context-metadata-${index}`}>
                <MetadataLabel>
                  {typeof metadata === "string"
                    ? metadata
                    : `${metadata.label}: ${metadata.value ?? ""}`}
                </MetadataLabel>
                {typeof metadata === "object" && metadata.progress !== undefined && (
                  <StyledProgress value={metadata.progress}>
                    <StyledProgressIndicator
                      style={{ transform: `translateX(-${100 - metadata.progress}%)` }}
                    />
                  </StyledProgress>
                )}
              </div>
            ))
          : typeof button.metadata === "object" &&
            Object.entries(button.metadata).map(([key, value], index) => (
              <p key={`context-metadata-${index}`}>{`${key}: ${value}`}</p>
            ))}
      </StyledHoverCardContent>
    </HoverCard>
  );
};
