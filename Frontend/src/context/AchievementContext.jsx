import { createContext, useReducer } from "react";

// Create Context
const AchievementContext = createContext();
export default AchievementContext;

// Provider Component
export const AchievementProvider = ({ children }) => {
  // Reducer function
  const achievementReducer = (state, action) => {
    switch (action.type) {
      case "GET_ACHIEVEMENTS":
        return { achievements: action.payload };
      case "CREATE_ACHIEVEMENT":
        return {
          achievements: [...state.achievements, action.payload],
        };
      case "UPDATE_ACHIEVEMENT":
        return {
          achievements: state.achievements.map((achievement) =>
            achievement._id === action.payload._id
              ? action.payload
              : achievement
          ),
        };
      case "DELETE_ACHIEVEMENT":
        return {
          achievements: state.achievements.filter(
            (achievement) => achievement._id !== action.payload
          ),
        };
      default:
        return state;
    }
  };

  // Initial state
  const initialState = {
    achievements: [],
  };

  // UseReducer hook
  const [state, dispatch] = useReducer(achievementReducer, initialState);

  // Provide context value
  return (
    <AchievementContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AchievementContext.Provider>
  );
};
