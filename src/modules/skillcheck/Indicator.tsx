import { useCallback, useEffect, useState, useRef } from "react";
import type { SkillCheckProps } from "@/types";

interface Props {
  angle: number;
  offset: number;
  multiplier: number;
  skillCheck: SkillCheckProps;
  className: string;
  handleComplete: (success: boolean) => void;
}

const Indicator: React.FC<Props> = ({
  angle,
  offset,
  multiplier,
  handleComplete,
  skillCheck,
  className,
}) => {
  const [indicatorAngle, setIndicatorAngle] = useState(-90);
  const [keyPressed, setKeyPressed] = useState<false | string>(false);
  const intervalRef = useRef<number | null>(null);

  const startInterval = () => {
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setIndicatorAngle((prev) => prev + multiplier);
    }, 1);
  };

  const stopInterval = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      const capitalHetaCode = 880;
      const isNonLatin = e.key.charCodeAt(0) >= capitalHetaCode;
      let convKey = e.key.toLowerCase();

      if (isNonLatin) {
        if (e.code.indexOf("Key") === 0 && e.code.length === 4) {
          convKey = e.code.charAt(3);
        }
        if (e.code.indexOf("Digit") === 0 && e.code.length === 6) {
          convKey = e.code.charAt(5);
        }
      }
      setKeyPressed(convKey.toLowerCase());
    },
    [skillCheck]
  );

  useEffect(() => {
    setIndicatorAngle(-90);
    startInterval();
    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
      stopInterval();
    };
  }, [skillCheck]);

  useEffect(() => {
    if (indicatorAngle + 90 >= 360) {
      stopInterval();
      handleComplete(false);
    }
  }, [indicatorAngle]);

  useEffect(() => {
    if (!keyPressed) return;
    if (skillCheck.keys && !skillCheck.keys.includes(keyPressed)) return;

    stopInterval();
    window.removeEventListener("keydown", keyHandler);

    if (
      keyPressed !== skillCheck.key ||
      indicatorAngle < angle ||
      indicatorAngle > angle + offset
    ) {
      handleComplete(false);
    } else {
      handleComplete(true);
    }

    setKeyPressed(false);
  }, [keyPressed]);

  return (
    <circle
      cx="250"
      cy="250"
      r="50"
      strokeDasharray="3 311.017"
      strokeDashoffset="0"
      transform={`rotate(${indicatorAngle}, 250, 250)`}
      className={className}
    />
  );
};

export default Indicator;
