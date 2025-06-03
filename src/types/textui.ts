import React from "react";
// import { IconAnimation } from '../components/LibIcon';
import type { IconProp } from "./icon";

export type TextUIPosition =
  | "right-center"
  | "left-center"
  | "top-center"
  | "bottom-center";

export interface TextUIProps {
  text: string;
  position?: TextUIPosition;
  icon?: IconProp;
  iconColor?: string;
  //   iconAnimation?: IconAnimation; -- need to find solution for this
  style?: React.CSSProperties;
  alignIcon?: "top" | "center";
  interactKey?: string;
}
