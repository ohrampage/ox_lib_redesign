import { styled } from "@stitches/react";

export const Flex = styled("div", {
  display: "flex",

  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
      rowReverse: {
        flexDirection: "row-reverse",
      },
      columnReverse: {
        flexDirection: "column-reverse",
      },
    },
    align: {
      start: {
        alignItems: "flex-start",
      },
      center: {
        alignItems: "center",
      },
      end: {
        alignItems: "flex-end",
      },
      stretch: {
        alignItems: "stretch",
      },
      baseline: {
        alignItems: "baseline",
      },
    },
    justify: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
      between: {
        justifyContent: "space-between",
      },
    },
    wrap: {
      noWrap: {
        flexWrap: "nowrap",
      },
      wrap: {
        flexWrap: "wrap",
      },
      wrapReverse: {
        flexWrap: "wrap-reverse",
      },
    },
    gap: {
      1: {
        gap: "4px",
      },
      2: {
        gap: "8px",
      },
      3: {
        gap: "12px",
      },
      4: {
        gap: "16px",
      },
      5: {
        gap: "20px",
      },
      6: {
        gap: "24px",
      },
      7: {
        gap: "28px",
      },
      8: {
        gap: "32px",
      },
      9: {
        gap: "36px",
      },
      10: {
        gap: "40px",
      },
      20: {
        gap: "80px",
      },
    },
  },
  defaultVariants: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: "noWrap",
  },
});
