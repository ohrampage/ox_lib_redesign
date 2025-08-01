import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { AlertCloseType, AlertProps } from "@/types";
import { fetchNui } from "@/utils/fetchNui";
import { useState } from "react";

export const AlertDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: "",
    content: "",
  });

  const handleClose = (type: AlertCloseType) => {
    setDialogOpen(false);
    fetchNui("closeAlert", type);
  };

  useNuiEvent("sendAlert", (data: AlertProps) => {
    setDialogData(data);
    setDialogOpen(true);
  });

  useNuiEvent("closeAlertDialog", () => {
    setDialogOpen(false);
  });

  if (!dialogOpen) return null;

  return (
    <AlertDialogRoot open={dialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-1">
            {dialogData.icon && <span className={`${dialogData.icon}`} />}
            {dialogData.header}
          </AlertDialogTitle>
          <AlertDialogDescription>{dialogData.content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose("cancel")}>
            {dialogData.labels?.cancel || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose("confirm")}>
            {dialogData.labels?.confirm || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
