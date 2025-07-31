import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { styled } from "@stitches/react";
import type { RadialMenuItem } from "@/types";
import { LibIcon } from "@/components/icon/LibIcon";
import { fetchNui } from "@/utils/fetchNui";

const ITEM_OFFSET = 90;
const MAX_ITEMS = 7;

const Ring = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  translate: "-50% -50%",
  boxShadow:
    "0 2px 6px rgba(0, 0, 0, 0.025), 0 4px 12px rgba(0, 0, 0, 0.05), 0 8px 36px rgba(0, 0, 0, 0.1)",
  backgroundColor: "var(--slate-2)",
  borderRadius: "100%",

  "&::after": {
    content: "",
    backgroundColor: "var(--slate-1)",
    borderRadius: "100%",
    position: "absolute",
    top: "50%",
    left: "50%",
    translate: "-50% -50%",
  },
});

const StyledRadialMenuItem = styled(motion.li, {
  "--rotate": "",
  display: "block",
  position: "absolute",
  bottom: "50%",
  right: "50%",
  backgroundColor: "var(--slate-2)",
  border: "1px solid var(--slate-3)",
  transformOrigin: "100% 100% 0px",
  transition: "background 200ms ease",

  '&[data-selected="true"]': {
    backgroundColor: "var(--slate-3)",
    color: "var(--slate-12)",

    "& svg": {
      color: "var(--slate-12)",
    },
  },
});

const RadialMenuWrapper = styled(motion.div, {
  position: "absolute",
  top: "50%",
  left: "50%",
  translate: "-50% -50%",
  color: "var(--slate-5)",
  zIndex: 999,
});

const RadialMenu = styled("ul", {
  position: "relative",
  overflow: "hidden",
  backgroundColor: "var(--slate-3)",
  borderRadius: 9999,
});

const Inner = styled("div", {
  backgroundColor: "var(--slate-1)",
  border: "1px solid var(--slate-3)",
  borderRadius: 9999,
  position: "absolute",
  left: "50%",
  top: "50%",
  translate: "-50% -50%",

  "&::after": {
    content: "",
    backgroundColor: "var(--slate-1)",
    border: "1px solid var(--slate-3)",
    borderRadius: 9999,
    position: "absolute",
    top: "50%",
    left: "50%",
    translate: "-50% -50%",
  },
});

const Label = styled("span", {
  userSelect: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  translate: "-50% -50%",
  zIndex: 999,
  color: "var(--slate-12)",
  maxWidth: "90%",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

interface RadialMenuNewProps {
  menuItems: RadialMenuItem[];
  size?: number;
  subMenu?: boolean;
  option?: number;
}

export const RadialMenuNew = ({ menuItems, size = 200, option }: RadialMenuNewProps) => {
  const [state, setState] = useState<{
    selected: number | null;
    currentPage: number;
  }>({
    selected: null,
    currentPage: option ? Math.floor((option - 1) / MAX_ITEMS) : 0,
  });
  const [properties, setProperties] = useState<[number, number, number, number, number]>([
    30, 62, 59, 120, 83.2,
  ]);

  const innerEl = useRef<HTMLDivElement | null>(null);
  const lastAngle = useRef<number | null>(-1);

  const totalPages = Math.ceil(menuItems.length / MAX_ITEMS);
  const displayItems = menuItems.slice(
    state.currentPage * MAX_ITEMS,
    (state.currentPage + 1) * MAX_ITEMS
  );

  if (totalPages > 1 && displayItems.length < MAX_ITEMS) {
    displayItems.push({
      //   id: state.currentPage < totalPages - 1 ? "next" : "back",
      label: state.currentPage < totalPages - 1 ? "Next" : "Back",
      icon: "chevron-right",
      menu: state.currentPage < totalPages - 1 ? "next" : "back",
    });
  }

  useEffect(() => {
    const updateProperties = () => {
      const itemCount = Math.min(displayItems.length, MAX_ITEMS);
      switch (itemCount) {
        case 3:
          setProperties([-30, 48, 40, 60, 66.6]);
          break;
        case 4:
          setProperties([0, 52, 52, 90, 74.9]);
          break;
        case 5:
          setProperties([18, 55, 55, 108, 80]);
          break;
        case 6:
          setProperties([30, 63, 60, 120, 83.2]);
          break;
        case 7:
          setProperties([38.5, 68, 59, 128.7, 85.7]);
          break;
        default:
          setProperties([0, 0, 0, 0, 0]);
          break;
      }
    };

    updateProperties();
  }, [displayItems.length]);

  const getSelectedAngle = (selectedIndex: number) => {
    const baseAngle = (360 / displayItems.length) * selectedIndex - properties[3];
    const normalizedBaseAngle = normalizeAngle(baseAngle);

    if (lastAngle.current === null) return normalizedBaseAngle;

    const newAngle =
      normalizedBaseAngle + 360 * Math.round((lastAngle.current - normalizedBaseAngle) / 360);

    lastAngle.current = newAngle;
    return newAngle;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!innerEl.current) return;

      const rect = innerEl.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const innerRadius = rect.width / 2;
      if (distance < innerRadius) {
        setState((prev) => ({ ...prev, selected: null }));
        return;
      }

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const normalizedAngle = normalizeAngle(angle - ITEM_OFFSET);
      const stepAngle = 360 / displayItems.length;
      const selected = Math.floor(normalizedAngle / stepAngle);

      setState((prev) => ({ ...prev, selected }));
    };

    const handleClick = () => {
      if (state.selected === null) return;

      const item = displayItems[state.selected];
      if (item.menu === "next") {
        setState((prev) => ({
          ...prev,
          currentPage: prev.currentPage + 1,
          selected: null,
        }));
      } else if (item.menu === "back") {
        setState((prev) => ({
          ...prev,
          currentPage: prev.currentPage - 1,
          selected: null,
        }));
        fetchNui("radialBack");
      } else {
        fetchNui("radialClick", state.selected);
        // window.postMessage({ type: "radialClick", index: state.selected }, "*");
        setState((prev) => ({ ...prev, selected: null })); // Reset selection after click
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [state.selected, displayItems]);

  useEffect(() => {
    const getRingAngle = () => {
      if (state.selected === null) return lastAngle.current;

      const newAngle = normalizeAngle((360 / displayItems.length) * state.selected - properties[3]);
      if (lastAngle.current === null) return newAngle;
      const oldAngle = normalizeAngle(lastAngle.current || 0);

      const diff = getAngleDifference(oldAngle, newAngle);
      return lastAngle.current + diff;
    };

    const newRingAngle = getRingAngle();
    setState((prev) => ({ ...prev, ringAngle: newRingAngle }));
  }, [state.selected, properties]);

  return (
    <RadialMenuWrapper
      className="dark-theme"
      id="radial-menu"
      css={{
        "--skew": `${properties[0]}deg`,
        "--top": `${properties[1]}%`,
        "--left": `${properties[2]}%`,
        "--ringPercent": `${properties[4]}%`,
      }}
      initial={{ "--selectedAngle": `${-1}deg` }}
      animate={{
        "--selectedAngle":
          state.selected !== null
            ? `${getSelectedAngle(state.selected)}deg`
            : `${lastAngle.current}deg`,
      }}
      transition={{
        type: "spring",
        velocity: 1,
        damping: 15,
        stiffness: 180,
      }}
    >
      <Ring
        css={{
          '&[data-has-selected="true"]': {
            background: `conic-gradient(
                from var(--selectedAngle),
                var(--slate-2) ${properties[4]}%,
                var(--slate-11) 0,
                var(--slate-11) 100%
              )`,
          },
          width: size + 24,
          height: size + 24,
          "&::after": {
            width: size + 24 - 16,
            height: size + 24 - 16,
          },
        }}
        data-has-selected={state.selected !== null}
      />
      <RadialMenu aria-describedby="radial-menu" role="menu" css={{ width: size, height: size }}>
        {displayItems.map((item, i) => (
          <StyledRadialMenuItem
            key={item.label}
            role="menuitem"
            aria-label={item.label}
            css={{
              "--rotate": getItemStyle(i, displayItems.length),
              transform: `rotate(var(--rotate)) skew(${properties[0]}deg)`,
              width: size / 1.75,
              height: size / 1.75,
              maxWidth: size / 1.75,
              maxHeight: size / 1.75,
              "& svg": {
                position: "absolute",
                top: `${properties[1]}%`,
                left: `${properties[2]}%`,
                transform: `skew(calc(${properties[0]}deg * -1)) rotate(calc(var(--rotate) * -1))`,
                fontSize: 18,
                color: "var(--slate-11)",
                width: "1.5em",
                height: "1.5em",
              },
              "& span": {
                position: "absolute",
                top: `${properties[1]}%`,
                left: `${properties[2]}%`,
                transform: `skew(calc(${properties[0]}deg * -1)) rotate(calc(var(--rotate) * -1))`,
                color: "var(--slate-11)",
                width: "1.5em",
                height: "1.5em",
              },
            }}
            data-selected={state.selected === i}
            onClick={() => {
              if (item.menu === "next") {
                setState((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                  selected: null,
                }));
              } else if (item.menu === "back") {
                setState((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                  selected: null,
                }));
                fetchNui("radialBack");
              } else {
                fetchNui("radialClick", i);
              }
            }}
          >
            <LibIcon icon={item.icon} />
            {/* {typeof item.icon === "string" ? (
              <i className={`fas fa-${item.icon}`}></i>
            ) : (
              <i className={`${item.icon[0]} fa-${item.icon[1]}`}></i>
            )} */}
          </StyledRadialMenuItem>
        ))}
      </RadialMenu>
      <Inner
        ref={innerEl}
        css={{
          width: `calc(0.5 * ${size}px)`,
          height: `calc(0.5 * ${size}px)`,
          "&::after": {
            width: `calc(0.5 * ${size}px - 10px)`,
            height: `calc(0.5 * ${size}px - 10px)`,
          },
        }}
      >
        {state.selected !== null && <Label>{displayItems[state.selected].label}</Label>}
      </Inner>
    </RadialMenuWrapper>
  );
};

const getItemStyle = (i: number, arrLength: number) => {
  const rotate = (360 / arrLength) * i - ITEM_OFFSET;
  return `${rotate}deg`;
};

const normalizeAngle = (angle: number): number => {
  const remainder = angle % 360;
  return remainder < 0 ? remainder + 360 : remainder;
};

const getAngleDifference = (angle1: number, angle2: number): number => {
  const clockwiseDiff = normalizeAngle(angle2 - angle1);
  const counterClockwiseDiff = 360 - clockwiseDiff;
  return clockwiseDiff < counterClockwiseDiff ? clockwiseDiff : -counterClockwiseDiff;
};
