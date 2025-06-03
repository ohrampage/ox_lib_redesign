import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { debugAlert } from "./debug/alert";
import { debugTextUI } from "./debug/textui";
import { debugCirclularProgress, debugProgress } from "./debug/progress";
import { useState } from "react";

const debugItems = [
  {
    label: "Open input dialog",
    onClick: () => console.log("opened input dialog"),
  },
  {
    label: "Open alert dialog",
    onClick: () => debugAlert(),
  },
  {
    label: "Open context menu",
    onClick: () => console.log("opened context menu"),
  },
  {
    label: "Open list menu",
    onClick: () => console.log("opened list menu"),
  },
  {
    label: "Open radial menu",
    onClick: () => console.log("opened radial menu"),
  },
  {
    label: "Send notification",
    onClick: () => console.log("sent notification"),
  },
  {
    label: "Activate progress bar",
    onClick: () => debugProgress(),
  },
  {
    label: "Activate progress circle",
    onClick: () => debugCirclularProgress(),
  },
  {
    label: "Show Text UI",
    onClick: () => debugTextUI(),
  },
  {
    label: "Run Skill Check",
    onClick: () => console.log("running skill check"),
  },
];

interface DebugButtonProps {
  label: string;
  onClick: () => void;
}

const DebugButton = (props: DebugButtonProps) => (
  <Button size="lg" onClick={props.onClick}>
    {props.label}
  </Button>
);

export const Dev = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" className="absolute bottom-5 right-5">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 pt-12 flex flex-col gap-5">
        {debugItems.map((item, index) => (
          <DebugButton
            key={index}
            label={item.label}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          />
        ))}
      </SheetContent>
    </Sheet>
  );
};
