import React, { createContext, useState, useContext, ReactNode } from "react";

interface MainPageContextType {
  contactId: string;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
}

interface MainPageProviderProps {
  children: ReactNode;
}

const MainPageContext = createContext<MainPageContextType | null>(null);

export const MainPagePropsProvider = ({ children }: MainPageProviderProps) => {
  const [contactId, setContactId] = useState("");
  return (
    <MainPageContext.Provider value={{ contactId, setContactId }}>
      {children}
    </MainPageContext.Provider>
  );
};

export const useMainPageContext = () => useContext(MainPageContext);
