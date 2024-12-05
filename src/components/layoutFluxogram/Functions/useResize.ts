import { debounce } from '@mui/material';
import { useCallback, useState } from 'react';
import { Edge, Node } from '@xyflow/react';

interface ResizeProps {
  state: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  };
  set: (newPresent: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  }) => void;
}

export const useResize = ({ set, state }: ResizeProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeEnd = useCallback(
    (
      nodeId: string,
      newDimensions?: { width: number; height: number },
      position?: { x: number; y: number },
      nodelabel?: string | unknown
    ) => {
      set({
        ...state,
        nodesHistoryState: state.nodesHistoryState.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                measured:
                  newDimensions && newDimensions !== n.measured
                    ? {
                        width: newDimensions.width,
                        height: newDimensions.height,
                      }
                    : n.measured,
                style:
                  newDimensions && newDimensions !== n.style
                    ? {
                        width: newDimensions.width,
                        height: newDimensions.height,
                      }
                    : n.style,
                position:
                  position && position !== n.position
                    ? { x: position.x, y: position.y }
                    : n.position,
                data:
                  nodelabel && nodelabel !== n.data.label
                    ? { ...n.data, label: nodelabel }
                    : n.data,
              }
            : n
        ),
      });
    },
    [set, state]
  );
  const debouncedHandleResizeEnd = useCallback(
    debounce(
      (
        nodeId: string,
        dimensions?: { width: number; height: number },
        position?: { x: number; y: number },
        nodelabel?: string | unknown
      ) => {
        handleResizeEnd(nodeId, dimensions, position, nodelabel);
      },
      100
    ),
    [handleResizeEnd]
  );

  const handleResize = useCallback(
    (
      id: string,
      dimensions?: { width: number; height: number },
      position?: { x: number; y: number },
      nodelabel?: string | unknown
    ) => {
      if (!isResizing) {
        setIsResizing(true);
      }
      debouncedHandleResizeEnd(id, dimensions, position, nodelabel); // Chama o debounce ao final do resize
    },
    [isResizing, debouncedHandleResizeEnd]
  );

  return { handleResize };
};
