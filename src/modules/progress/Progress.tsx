import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { ProgressProps } from "@/types/progress";
import { useEffect, useState } from "react";
import "./Progress.css";

export const Progress = () => {
  const [data, setData] = useState<ProgressProps>({
    label: "",
    duration: 0,
  });
  const [visible, setVisible] = useState(false);

  useNuiEvent("progressCancel", () => setVisible(false));

  useNuiEvent<ProgressProps>("progress", (data) => {
    setData(data);
    setVisible(true);
  });

  useEffect(() => {
    if (data.duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, data.duration);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!visible) return null;

  return (
    <div className="flex flex-col absolute bottom-[20vh] left-1/2 transform -translate-x-1/2 bg-neutral-900/40 backdrop-blur-xs p-2 rounded-md">
      {data.label && (
        <div className="flex gap-1 items-center mb-2 text-white text-sm justify-center">
          {data.icon && <span className={`${data.icon} text-sm`}></span>}
          <p className="font-medium">{data.label}</p>
        </div>
      )}
      <div className="w-[400px] max-w-[85vw] h-4 rounded-xs bg-neutral-900/40  overflow-hidden">
        <div
          style={{
            animation: `load ${data.duration}ms linear`,
            willChange: "width",
          }}
          className={`h-full bg-white`}
        ></div>
      </div>
    </div>
  );
};
