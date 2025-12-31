import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface AppContextType {
  currentDate: Date | null;
  setCurrentDate: (date: Date) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextType>({
  currentDate: null,
  setCurrentDate: () => { },
});

export const useAppContext = () => React.useContext(AppContext);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
  }, []);

  return (
    <AppContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </AppContext.Provider>
  );
};
