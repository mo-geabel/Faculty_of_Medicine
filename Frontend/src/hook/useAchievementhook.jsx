import AchievementContext from "../context/AchievementContext";
import { useContext } from "react";

const useAchievementhook = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievementhook must be used within a AchievementProvider"
    );
  }
  return context;
};
export default useAchievementhook;
