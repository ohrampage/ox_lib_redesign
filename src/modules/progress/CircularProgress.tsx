import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { CirclularProgressProps } from "@/types/progress";
import { useEffect, useRef, useState } from "react";
import "./CircularProgress.css";

const size = 80;
const strokeWidth = 4;

export const CircularProgress = () => {
  const [data, setData] = useState<CirclularProgressProps>({
    label: "",
    duration: 0,
    position: "middle",
  });
  const [visible, setVisible] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useNuiEvent("progressCancel", () => {
    setPercentage(0);
    setVisible(false);
  });

  useNuiEvent<CirclularProgressProps>("circleProgress", (data) => {
    if (visible) return;
    setData(data);
    setPercentage(0);
    setVisible(true);
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setPercentage((previousValue) => {
        const newValue = previousValue + 1;
        if (newValue >= 100) clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
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
    <div className="flex flex-col absolute bottom-[20vh] left-1/2 transform -translate-x-1/2 gap-3 items-center">
      <div className="relative inline-flex items-center justify-center bg-neutral-900/40  rounded-full w-max h-max">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-neutral-950/50"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className={`stroke-white`}
            style={
              {
                "--circumference": circumference,
                animation: `circularLoad ${data.duration}ms cubic-bezier(.42,0,.58,1)`,
                willChange: "stroke-dashoffset",
              } as React.CSSProperties
            }
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg text-center font-medium text-white w-16">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex gap-1 items-center bg-neutral-900/40 backdrop-blur-xs">
        {data.icon && (
          <span className={`${data.icon} text-lg text-white`}></span>
        )}
        <span className="text-base text-center font-medium text-white">
          {data.label}
        </span>
      </div>
    </div>
  );
};
