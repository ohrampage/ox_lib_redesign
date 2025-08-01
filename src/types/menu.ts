import type { IconProp } from "./icon";

export type MenuPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface MenuItem {
  image?: string;
  label: string;
  progress?: number;
  colorScheme?: string;
  checked?: boolean;
  values?: Array<string | { label: string; description: string }>;
  description?: string;
  icon?: IconProp | string;
  iconColor?: string;
  //   iconAnimation?: IconAnimation;
  iconAnimation?: any; //temp
  defaultIndex?: number;
  close?: boolean;
}

export interface MenuSettings {
  position?: MenuPosition;
  title: string;
  canClose?: boolean;
  items: Array<MenuItem>;
  startItemIndex?: number;
}

export interface RadialMenuItem {
  icon: string;
  label: string;
  isMore?: boolean;
  menu?: string;
  iconWidth?: number;
  iconHeight?: number;
  // keepOpen?: boolean;
}
