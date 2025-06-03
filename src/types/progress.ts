import type { IconProp } from "./icon";

export interface ProgressProps {
  label: string;
  duration: number;

  // *new* / not part of original lib
  icon?: IconProp;
}

export interface CirclularProgressProps {
  label?: string;
  duration: number;
  position?: "middle" | "bottom";
  icon?: IconProp;
  // percent?: boolean;
}
