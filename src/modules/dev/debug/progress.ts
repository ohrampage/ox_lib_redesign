import type { CirclularProgressProps, ProgressProps } from "@/types/progress";
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

export const debugCirclularProgress = () => {
  debugData<CirclularProgressProps>([
    {
      action: "circleProgress",
      data: {
        duration: 8000,
        label: "Rolling dice...",
        icon: "icon-[ion--dice]",
        position: "middle",
      },
    },
  ]);
};
