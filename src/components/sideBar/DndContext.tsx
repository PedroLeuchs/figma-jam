import React, { createContext, useContext, useState } from 'react';

const DnDContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>]
>(['', () => {}]);

export const DnDProvider = ({ children }: { children: React.ReactNode }) => {
  const [type, setType] = useState<string>('');

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export const useDnD = () => {
  return useContext(DnDContext);
};
