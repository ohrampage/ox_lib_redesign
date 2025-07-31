import { forwardRef } from "react";
import type { MenuItem } from "../../../types";
import { isIconUrl } from "@/utils";
import { LibIcon } from "@/components/icon/LibIcon";
import { styled } from "@stitches/react";
import { Flex } from "@/components/ui/flex";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress, ProgressIndicator } from "@radix-ui/react-progress";

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const ButtonContainer = styled("div", {
  backgroundColor: "var(--white-a1)",
  borderRadius: 4,
  padding: "2px",
  height: "60px",
  scrollMargin: "8px",
  "&:focus": {
    backgroundColor: "var(--white-a3)",
    outline: "none",
  },
});

const IconImage = styled("img", {
  maxWidth: "32px",
});

const ButtonWrapper = styled(Flex, {
  paddingLeft: "5px",
  paddingRight: "12px",
  height: "100%",
});

const IconContainer = styled(Flex, {
  width: "32px",
  height: "32px",
});

const Label = styled("span", {
  display: "inline-block",
  color: "var(--slate-11)",
  textTransform: "uppercase",
  fontSize: 15,
  verticalAlign: "middle",
});

const ChevronIcon = styled(LibIcon, {
  fontSize: "14px",
  color: "var(--slate-11)",
});

const ScrollIndexValue = styled("span", {
  color: "var(--slate-11)",
  textTransform: "uppercase",
  fontSize: "14px",
});

const StyledProgress = styled(Progress, {
  width: "100%",
  minWidth: 220,
  height: 15,
  position: "relative",
  overflow: "clip",
  backgroundClip: "padding-box",
  borderRadius: "4px",
  backgroundColor: "var(--white-a3)",

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: "translateZ(0)",
});

const StyledProgressIndicator = styled(ProgressIndicator, {
  backgroundColor: "var(--white-a11)",
  width: "100%",
  height: "100%",
  transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
});

export const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(
  ({ item, index, scrollIndex, checked }, ref) => {
    return (
      <ButtonContainer
        tabIndex={index}
        key={`item-${index}`}
        //@ts-ignore
        ref={(element: HTMLDivElement) => {
          //@ts-ignore
          if (ref) return (ref.current = [...ref.current, element]);
        }}
      >
        <ButtonWrapper direction="row" gap="2" wrap="noWrap" align="center">
          {item.icon && (
            <IconContainer align="center">
              {typeof item.icon === "string" && isIconUrl(item.icon) ? (
                <IconImage src={item.icon} alt="Missing image" />
              ) : (
                <LibIcon icon={item.icon} />
              )}
            </IconContainer>
          )}
          {Array.isArray(item.values) ? (
            <Flex direction="row" justify="between" align="center" css={{ width: "100%" }}>
              <Flex direction="column" justify="between">
                <Label>{item.label}</Label>
                <Label css={{ fontSize: 12 }}>
                  {typeof item.values[scrollIndex] === "object"
                    ? item.values[scrollIndex].label
                    : item.values[scrollIndex]}
                </Label>
              </Flex>
              <Flex direction="row" gap={1} justify="center" align="center">
                <ChevronIcon icon="chevron-left" />
                <ScrollIndexValue>
                  {scrollIndex + 1}/{item.values.length}
                </ScrollIndexValue>
                <ChevronIcon icon="chevron-right" />
              </Flex>
            </Flex>
          ) : item.checked !== undefined ? (
            <Flex direction="row" justify="between" align="center" css={{ width: "100%" }}>
              <Label>{item.label}</Label>
              <Checkbox checked={checked}></Checkbox>
            </Flex>
          ) : item.progress !== undefined ? (
            <Flex direction="column" gap="2">
              <Label>{item.label}</Label>
              <StyledProgress className="min-w-[180px]" value={item.progress}>
                <StyledProgressIndicator
                  style={{ transform: `translateX(-${100 - item.progress}%)` }}
                />
              </StyledProgress>
            </Flex>
          ) : (
            <Label>{item.label}</Label>
          )}
        </ButtonWrapper>
      </ButtonContainer>
    );
  }
);
