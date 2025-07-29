import React, { useCallback, useEffect, useState } from "react";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { fetchNui } from "../../../utils/fetchNui";
import type { MenuSettings, MenuItem, MenuPosition } from "../../../types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Position mapping for Tailwind classes
const positionClasses: Record<MenuPosition, string> = {
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
};

// Main ListMenu component using Radix DropdownMenu
export const ListMenu = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: "top-left",
    title: "",
    items: [],
  });
  const [open, setOpen] = useState<boolean>(false);
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>(
    {}
  );

  // Close menu handler
  const closeMenu = useCallback(() => {
    setOpen(false);
    fetchNui("closeMenu");
  }, []);

  // NUI event handlers
  useNuiEvent("setMenu", (data: MenuSettings) => {
    setMenu(data);
    setOpen(true);
    const checkedIndexes: Record<number, boolean> = {};
    data.items.forEach((item, i) => {
      if (item.checked !== undefined) checkedIndexes[i] = !!item.checked;
    });
    setCheckedStates(checkedIndexes);
  });

  useNuiEvent("closeMenu", () => closeMenu());

  // Handle item selection
  const handleSelect = (index: number) => {
    const item = menu.items[index];
    if (item.checked !== undefined) {
      setCheckedStates((prev) => ({ ...prev, [index]: !prev[index] }));
      fetchNui("changeChecked", [index, !checkedStates[index]]).catch();
    } else {
      fetchNui("confirmSelected", [index]).catch();
      if (item.close !== false) setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden">
          Trigger
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`fixed ${
          positionClasses[menu.position || "top-left"]
        } w-96 rounded-md shadow-lg p-2 max-h-[415px] overflow-y-auto`}
      >
        <DropdownMenuLabel>{menu.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menu.items.map((item, index) => (
          <React.Fragment key={`menu-item-${index}`}>
            {item.label &&
              (item.checked !== undefined ? (
                <DropdownMenuCheckboxItem
                  checked={checkedStates[index] || false}
                  onCheckedChange={() => handleSelect(index)}
                >
                  {item.label}
                </DropdownMenuCheckboxItem>
              ) : (
                <DropdownMenuItem onSelect={() => handleSelect(index)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
