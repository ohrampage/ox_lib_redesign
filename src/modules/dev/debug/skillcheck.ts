import type { GameDifficulty } from "@/types";
import { debugData } from "@/utils/debugData";

export const debugSkillCheck = () => {
  debugData<{
    difficulty: GameDifficulty | GameDifficulty[];
    inputs?: string[];
  }>([
    {
      action: "startSkillCheck",
      data: {
        difficulty: ["easy", "easy", "hard"],
        inputs: ["W", "A", "S", "D"],
      },
    },
  ]);
};
