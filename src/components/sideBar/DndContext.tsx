import React, { createContext, useContext, useState } from 'react';

const DnDContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {}]);

export const DnDProvider = ({ children }: { children: React.ReactNode }) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export const useDnD = () => {
  return useContext(DnDContext);
};
