import { useState } from "react";

export const useInteractionLayout = () => {
  const [dragLayout, setDragLayout] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState(false);
  const [isLocked, setIsLocked] = useState(false);


  return { dragLayout, selectedLayout, setDragLayout, setSelectedLayout, isLocked, setIsLocked };
};
