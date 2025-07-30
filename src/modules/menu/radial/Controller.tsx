import { useEffect, useState } from "react";
import { RadialMenuNew } from "./RadialMenu";
import type { RadialMenuItem } from "@/types";
import { fetchNui } from "@/utils/fetchNui";

// interface RadialMenuControllerProps {
//   size: number;
// }

export const RadialMenuController = () => {
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [subMenu, setSubMenu] = useState<boolean>(false);
  const [option, setOption] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleNUIMessage = (event: MessageEvent) => {
      const { action, data } = event.data;
      if (action === "openRadialMenu") {
        if (data === false) {
          setIsVisible(false);
          setMenuItems([]);
          setSubMenu(false);
          setOption(undefined);
        } else {
          console.log("Radial Menu Data:", data);
          // Assuming data is structured correctly
          setMenuItems(data.items || []);
          setIsVisible(true);
          setSubMenu(!!data.sub);
          setOption(data.option);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        setIsVisible(false);
        setMenuItems([]);
        setSubMenu(false);
        setOption(undefined);
        fetchNui("radialClose");
      }
    };

    window.addEventListener("message", handleNUIMessage);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("message", handleNUIMessage);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return isVisible ? (
    <RadialMenuNew
      menuItems={menuItems}
      size={350}
      subMenu={subMenu}
      option={option}
    />
  ) : null;
};
