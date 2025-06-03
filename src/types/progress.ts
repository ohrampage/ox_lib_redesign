import type { IconProp } from "./icon";

export interface CirclularProgressProps {
  label?: string;
  duration: number;
  position?: "middle" | "bottom";
  percent?: boolean;
}

export interface ProgressProps {
  label: string;
  duration: number;

  // *new* / not part of original lib
  icon?: IconProp;
}
