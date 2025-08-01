import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { ProgressProps } from "@/types/progress";
import { useEffect, useState } from "react";
import "./Progress.css";
import { LibIcon } from "@/components/icon/LibIcon";
import { fetchNui } from "@/utils/fetchNui";
import { styled } from "@stitches/react";

const ProgressContainer = styled("div", {
  width: 400,
  maxWidth: "85vw",
  height: 32,
  padding: 2,
  borderRadius: 2,
  boxShadow: "0 0 0 2px var(--white-a7)",
  overflow: "hidden",
});

const ProgressBar = styled("div", {
  height: "100%",
  background: "linear-gradient(to right, var(--white-a3), var(--white-a12))",
  borderRadius: 2,
});

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
        fetchNui("progressComplete");
      }, data.duration);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!visible) return null;

  return (
    <div className="flex flex-col absolute bottom-[20vh] left-1/2 transform -translate-x-1/2 bg-neutral-950/50 backdrop-blur-[2px] p-2 rounded-sm">
      {data.label && (
        <div className="flex gap-1 items-center mb-2 text-white justify-center">
          {data.icon && <LibIcon icon={data.icon} />}
          <p className="font-medium">{data.label}</p>
        </div>
      )}
      <ProgressContainer>
        <ProgressBar
          style={{
            animation: `load ${data.duration}ms linear`,
            willChange: "width",
          }}
          className={`h-full bg-linear-to-r from-gray-300 to-white rounded-xs`}
        ></ProgressBar>
      </ProgressContainer>
    </div>
  );
};
