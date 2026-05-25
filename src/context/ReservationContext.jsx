import { createContext, useContext, useState } from "react";

const initialState = {
  from: undefined,
  to: undefined,
};

const ReservationContext = createContext();

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);

  function resetRange() {
    setRange(initialState);
  }

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (context === undefined) {
    throw new Error(
      "useReservation must be used within a ReservationProvider"
    );
  }

  return context;
}

export { ReservationProvider, useReservation };