import { useNuiEvent } from "@/hooks/useNuiEvent";
import type { GameDifficulty, SkillCheckProps } from "@/types";
import { fetchNui } from "@/utils/fetchNui";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Indicator from "./Indicator";

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

export const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{
    difficulty: GameDifficulty | GameDifficulty[];
    inputs?: string[];
  } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: "easy",
    key: "e",
  });

  const getSkillAreaOffset = (offset: number, radius = 50) => {
    const circumference = 2 * radius * Math.PI;
    return circumference - (Math.PI * radius * offset) / 180;
  };

  useNuiEvent(
    "startSkillCheck",
    (data: {
      difficulty: GameDifficulty | GameDifficulty[];
      inputs?: string[];
    }) => {
      dataRef.current = data;
      dataIndexRef.current = 0;
      const gameData = Array.isArray(data.difficulty)
        ? data.difficulty[0]
        : data.difficulty;
      const offset =
        typeof gameData === "object"
          ? gameData.areaSize
          : difficultyOffsets[gameData];
      const randomKey = data.inputs
        ? data.inputs[Math.floor(Math.random() * data.inputs.length)]
        : "e";
      setSkillCheck({
        angle: -90 + getRandomAngle(120, 360 - offset),
        difficultyOffset: offset,
        difficulty: gameData,
        keys: data.inputs?.map((input) => input.toLowerCase()),
        key: randomKey.toLowerCase(),
      });
      setVisible(true);
    }
  );

  useNuiEvent("skillCheckCancel", () => {
    setVisible(false);
    fetchNui("skillCheckOver", false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      fetchNui("skillCheckOver", success);
      return;
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      fetchNui("skillCheckOver", success);
      return;
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const offset =
      typeof data === "object" ? data.areaSize : difficultyOffsets[data];
    const randomKey = dataRef.current.inputs
      ? dataRef.current.inputs[
          Math.floor(Math.random() * dataRef.current.inputs.length)
        ]
      : "e";
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      keys: dataRef.current.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });
  };

  useEffect(() => {
    console.log("SkillCheck visibility changed:", visible);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <svg className="w-[500px] h-[500px]">
        <circle
          className="fill-transparent stroke-gray-950/60"
          r="50"
          cx="250"
          cy="250"
          strokeWidth="8"
          strokeDasharray={circleCircumference}
        />
        <circle
          transform={`rotate(${skillCheck.angle}, 250, 250)`}
          className="fill-transparent stroke-white"
          r="50"
          cx="250"
          cy="250"
          strokeWidth="8"
          strokeDasharray={circleCircumference}
          strokeDashoffset={getSkillAreaOffset(skillCheck.difficultyOffset)}
        />
        <Indicator
          angle={skillCheck.angle}
          offset={skillCheck.difficultyOffset}
          multiplier={
            skillCheck.difficulty === "easy"
              ? 1
              : skillCheck.difficulty === "medium"
              ? 1.5
              : skillCheck.difficulty === "hard"
              ? 1.75
              : (skillCheck.difficulty as any).speedMultiplier || 1
          }
          handleComplete={handleComplete}
          skillCheck={skillCheck}
          className="fill-transparent stroke-red-500 stroke-[8px]"
        />
      </svg>
      <div className="absolute bg-gray-950/60 w-8 h-8 rounded text-white text-lg font-medium flex items-center justify-center">
        {skillCheck.key.toUpperCase()}
      </div>
    </div>
  );
};
