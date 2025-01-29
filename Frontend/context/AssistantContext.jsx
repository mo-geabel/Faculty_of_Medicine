import { createContext, useReducer } from "react";

export const AssistantsContext = createContext();

export const AssistantsContextProvider = ({ children }) => {
  const AssistantsReducer = (state, action) => {
    switch (action.type) {
      case "GET_Assistants":
        return { ...state, Assistants: action.payload };
      case "CREATE_Assistants":
        return {
          ...state,
          Assistants: [...state.Assistants, action.payload],
        };
      case "UPDATE_Assistants":
        return {
          ...state,
          Assistants: state.Assistants.map((assistant) =>
            assistant._id === action.payload._id
              ? { ...assistant, ...action.payload.data }
              : assistant
          ),
        };
      case "ADD_SHIFT":
        return {
          ...state,
          Assistants: state.Assistants.map((assistant) =>
            assistant._id === action.payload._id
              ? {
                  ...assistant,
                  shifts: [...assistant.shifts, action.payload.data], // Append new shift
                }
              : assistant
          ),
        };

      case "DELETE_SHIFT":
        return {
          ...state,
          Assistants: state.Assistants.map((assistant) => ({
            ...assistant,
            shifts: assistant.shifts.filter(
              (shift) => shift.id !== action.payload
            ),
          })),
        };
      default:
        return state;
    }
  };

  // Initial state and useReducer hook
  const initialState = {
    Assistants: [],
  };
  const [state, dispatch] = useReducer(AssistantsReducer, initialState);
  return (
    <AssistantsContext.Provider
      value={{ Assistants: state.Assistants, dispatch }}
    >
      {children}
    </AssistantsContext.Provider>
  );
};
