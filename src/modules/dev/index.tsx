import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { debugAlert } from "./debug/alert";
import { debugTextUI } from "./debug/textui";
import { debugProgress } from "./debug/progress";

export const Dev = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="absolute bottom-5 right-5">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 pt-12 flex flex-col gap-5">
        <Button size="lg" onClick={() => console.log("opened input dialog")}>
          Open input dialog
        </Button>
        <Button size="lg" onClick={() => debugAlert()}>
          Open alert dialog
        </Button>
        <Button size="lg" onClick={() => console.log("opened context menu")}>
          Open context menu
        </Button>
        <Button size="lg" onClick={() => console.log("opened list menu")}>
          Open list menu
        </Button>
        <Button size="lg" onClick={() => console.log("opened radial menu")}>
          Open radial menu
        </Button>
        <Button size="lg" onClick={() => console.log("sent notification")}>
          Send notification
        </Button>
        <Button size="lg" onClick={() => debugProgress()}>
          Activate progress bar
        </Button>
        <Button
          size="lg"
          onClick={() => console.log("activated progress circle")}
        >
          Activate progress circle
        </Button>
        <Button size="lg" onClick={() => debugTextUI()}>
          Show Text UI
        </Button>
        <Button size="lg" onClick={() => console.log("running skill check")}>
          Run Skill Check
        </Button>
      </SheetContent>
    </Sheet>
  );
};
