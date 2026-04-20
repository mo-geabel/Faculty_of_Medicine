import { createContext, useReducer } from "react";

export const EmergencyContext = createContext();

export const EmergencyContextProvider = ({ children }) => {
  const EmergencyReducer = (state, action) => {
    switch (action.type) {
      case "GET_EMERGENCY":
        return { ...state, Emergency: action.payload };
      case "CREATE_EMERGENCY":
        return {
          ...state,
          Emergency: [...state.Emergency, action.payload],
        };
      case "UPDATE_EMERGENCY":
        return {
          ...state,
          Emergency: state.Emergency.map((eme) =>
            eme._id === action.payload._id
              ? { ...eme, ...action.payload.data }
              : eme
          ),
        };

      case "DELETE_EMERGENCY":
        return {
          ...state,
          Emergency: state.Emergency.filter(
            (eme) => eme._id !== action.payload
          ),
        };
      default:
        return state;
    }
  };

  // Initial state and useReducer hook
  const initialState = {
    Emergency: [],
  };
  const [state, dispatch] = useReducer(EmergencyReducer, initialState);
  return (
    <EmergencyContext.Provider value={{ Emergency: state.Emergency, dispatch }}>
      {children}
    </EmergencyContext.Provider>
  );
};
