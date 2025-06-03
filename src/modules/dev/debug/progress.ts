import type { ProgressProps } from "@/types/progress";
import { debugData } from "@/utils/debugData";

export const debugProgress = () => {
  debugData<ProgressProps>([
    {
      action: "progress",
      data: {
        label: "Rolling dice...",
        duration: 8000,
        icon: "icon-[ion--dice]",
      },
    },
  ]);
};
