// import { Box, createStyles, Stack, Tooltip } from '@mantine/core';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { ListItem } from "./ListItem";
import { FocusTrap } from "focus-trap-react";
import { fetchNui } from "@/utils/fetchNui";
import type { MenuPosition, MenuSettings } from "@/types";
import { LibIcon } from "@/components/icon/LibIcon";
import { styled } from "@stitches/react";
import { Flex } from "@/components/ui/flex";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

const MenuContainer = styled("div", {
  backgroundColor: "var(--slate-1)",
  position: "absolute",
  pointerEvents: "none",
  width: 384,
  overflow: "clip",
  borderRadius: 8,
});

const MenuContentWrapper = styled("div", {
  height: "fit-content",
  maxHeight: 415,
  overflow: "hidden",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
});

const ScrollArrowContainer = styled(Flex, {
  backgroundColor: "var(--slate-2)",
  textAlign: "center",
  // borderBottomLeftRadius: 8,
  // borderBottomRightRadius: 8,
  height: 25,
});

const Heading = styled("h2", {
  color: "var(--slate-12)",
  fontSize: 21,
});

export const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: "top-left",
    title: "",
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstRenderRef = useRef(false);

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;
    setVisible(false);
    if (!ignoreFetch) fetchNui("closeMenu", keyPressed);
  };

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (firstRenderRef.current) firstRenderRef.current = false;
    switch (e.code) {
      case "ArrowDown":
        setSelected((selected) => {
          if (selected >= menu.items.length - 1) return (selected = 0);
          return selected + 1;
        });
        break;
      case "ArrowUp":
        setSelected((selected) => {
          if (selected <= 0) return (selected = menu.items.length - 1);
          return selected - 1;
        });
        break;
      case "ArrowRight":
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] + 1 <= menu.items[selected].values?.length! - 1
                ? indexStates[selected] + 1
                : 0,
          });
        break;
      case "ArrowLeft":
        if (Array.isArray(menu.items[selected].values))
          setIndexStates({
            ...indexStates,
            [selected]:
              indexStates[selected] - 1 >= 0
                ? indexStates[selected] - 1
                : menu.items[selected].values?.length! - 1,
          });

        break;
      case "Enter":
        if (!menu.items[selected]) return;
        if (menu.items[selected].checked !== undefined && !menu.items[selected].values) {
          return setCheckedStates({
            ...checkedStates,
            [selected]: !checkedStates[selected],
          });
        }
        fetchNui("confirmSelected", [selected, indexStates[selected]]).catch();
        if (menu.items[selected].close === undefined || menu.items[selected].close)
          setVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui("changeChecked", [selected, checkedStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (!menu.items[selected]?.values || firstRenderRef.current) return;
    const timer = setTimeout(() => {
      fetchNui("changeIndex", [selected, indexStates[selected]]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [indexStates]);

  useEffect(() => {
    if (!menu.items[selected]) return;
    listRefs.current[selected]?.scrollIntoView({
      block: "nearest",
      inline: "start",
    });
    listRefs.current[selected]?.focus({ preventScroll: true });
    // debounces the callback to avoid spam
    const timer = setTimeout(() => {
      fetchNui("changeSelected", [
        selected,
        menu.items[selected].values
          ? indexStates[selected]
          : menu.items[selected].checked
          ? checkedStates[selected]
          : null,
        menu.items[selected].values ? "isScroll" : menu.items[selected].checked ? "isCheck" : null,
      ]).catch();
    }, 100);
    return () => clearTimeout(timer);
  }, [selected, menu]);

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape", "Backspace"].includes(e.code)) closeMenu(false, e.code);
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  const isValuesObject = useCallback(
    (values?: Array<string | { label: string; description: string }>) => {
      return Array.isArray(values) && typeof values[indexStates[selected]] === "object";
    },
    [indexStates, selected]
  );

  useNuiEvent("closeMenu", () => closeMenu(true, undefined, true));

  useNuiEvent("setMenu", (data: MenuSettings) => {
    firstRenderRef.current = true;
    if (!data.startItemIndex || data.startItemIndex < 0) data.startItemIndex = 0;
    else if (data.startItemIndex >= data.items.length) data.startItemIndex = data.items.length - 1;
    setSelected(data.startItemIndex);
    if (!data.position) data.position = "top-left";
    listRefs.current = [];
    setMenu(data);
    setVisible(true);
    const arrayIndexes: { [key: number]: number } = {};
    const checkedIndexes: { [key: number]: boolean } = {};
    for (let i = 0; i < data.items.length; i++) {
      if (Array.isArray(data.items[i].values))
        arrayIndexes[i] = (data.items[i].defaultIndex || 1) - 1;
      else if (data.items[i].checked !== undefined)
        checkedIndexes[i] = data.items[i].checked || false;
    }
    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);
    listRefs.current[data.startItemIndex]?.focus();
  });

  return (
    <>
      {visible && (
        <>
          <MenuContainer
            className="dark-theme"
            css={{
              marginTop: menu.position === "top-left" || menu.position === "top-right" ? 5 : 0,
              marginLeft: menu.position === "top-left" || menu.position === "bottom-left" ? 5 : 0,
              marginRight:
                menu.position === "top-right" || menu.position === "bottom-right" ? 5 : 0,
              marginBottom:
                menu.position === "bottom-left" || menu.position === "bottom-right" ? 5 : 0,
              right:
                menu.position === "top-right" || menu.position === "bottom-right" ? 1 : undefined,
              left: menu.position === "top-left" || menu.position === "bottom-left" ? 1 : undefined,
              bottom:
                menu.position === "bottom-left" || menu.position === "bottom-right" ? 1 : undefined,

              top: menu.position === "top-left" || menu.position === "top-right" ? 1 : undefined,

              zIndex: 9999,
            }}
          >
            <Flex
              align="center"
              css={{
                padding: "12px",
                backgroundColor: "var(--slate-2)",
                borderBottom: "1px solid var(--slate-4)",
              }}
            >
              <Heading>{menu.title}</Heading>
            </Flex>
            <MenuContentWrapper
              css={{
                borderRadius:
                  menu.items.length <= 6 || selected === menu.items.length - 1 ? "8px" : undefined,
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => moveMenu(e)}
            >
              <FocusTrap active={visible}>
                <Flex direction="column" gap="2" css={{ padding: 8, overflowY: "scroll" }}>
                  {menu.items.map((item, index) => (
                    <React.Fragment key={`menu-item-${index}`}>
                      {item.label && (
                        <ListItem
                          index={index}
                          item={item}
                          scrollIndex={indexStates[index]}
                          checked={checkedStates[index]}
                          ref={listRefs}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Flex>
              </FocusTrap>
            </MenuContentWrapper>
            {menu.items.length > 6 && selected !== menu.items.length - 1 && (
              <ScrollArrowContainer justify="center">
                <LibIcon
                  icon="chevron-down"
                  // className={classes.scrollArrowIcon}
                />
              </ScrollArrowContainer>
            )}
          </MenuContainer>
          <Tooltip
            open={
              isValuesObject(menu.items[selected].values)
                ? // @ts-ignore
                  !!menu.items[selected].values[indexStates[selected]].description
                : !!menu.items[selected].description
            }
            // transitionDuration={0}
            // classNames={{ tooltip: classes.tooltip }}
            onOpenChange={(open) => !open}
          >
            <TooltipContent>
              {isValuesObject(menu.items[selected].values)
                ? // @ts-ignore
                  menu.items[selected].values[indexStates[selected]].description
                : menu.items[selected].description}
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </>
  );
};
