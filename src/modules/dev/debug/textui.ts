import type { TextUIProps } from "@/types";
import { debugData } from "@/utils/debugData";

export const debugTextUI = () => {
  debugData<TextUIProps>([
    {
      action: "textUi",
      data: {
        text: "Unlock door",
        interactKey: "E",
        position: "right-center",
        icon: "icon-[ion--lock-open]",
      },
    },
  ]);
};
