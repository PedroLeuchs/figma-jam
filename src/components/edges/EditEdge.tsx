import { FC, useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import { MdHeight, MdColorLens } from 'react-icons/md';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Node, Edge, MarkerType } from '@xyflow/react';

interface EditEdgeProps {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  state: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  };
  set: (newPresent: {
    nodesHistoryState: Node[];
    edgesHistoryState: Edge[];
  }) => void;
}

const EditEdge: FC<EditEdgeProps> = ({ edges, setEdges, state, set }) => {
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLineType, setShowLineType] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [color, setColor] = useState('black');
  const showOptions = (number: number) => {
    switch (number) {
      case 1:
        setShowHeightPicker(!showHeightPicker);
        setShowColorPicker(false);
        setShowLineType(false);
        break;
      case 2:
        setShowHeightPicker(false);
        setShowColorPicker(!showColorPicker);
        setShowLineType(false);
        break;
      case 3:
        setShowHeightPicker(false);
        setShowColorPicker(false);
        setShowLineType(!showLineType);
        break;
    }
  };

  const updateEdge = (updatedEdge: Partial<Edge>) => {
    if (updatedEdge.style) {
      const newEdges = edges.map((edge) => {
        if (edge.selected) {
          return {
            ...edge,
            style: {
              ...edge.style,
              ...updatedEdge.style,
            },
            // ...updatedEdge,
          };
        }
        return edge;
      });

      setEdges(newEdges);
      set({
        ...state,
        edgesHistoryState: [
          ...state.edgesHistoryState,
          ...newEdges.filter((edge) => edge.selected),
        ],
      });
    } else {
      const newEdges = edges.map((edge) => {
        if (edge.selected) {
          return {
            ...edge,
            // style: {
            //     ...edge.style,
            //     ...updatedEdge.style,
            // },
            ...updatedEdge,
          };
        }
        return edge;
      });

      setEdges(newEdges);
      set({
        ...state,
        edgesHistoryState: [
          ...state.edgesHistoryState,
          ...newEdges.filter((edge) => edge.selected),
        ],
      });
    }
  };

  const handleLineHeightChange = (height: number) => {
    updateEdge({ style: { strokeWidth: height } });
  };

  const handleAnimatedChange = () => {
    setAnimated(!animated);

    if (animated) {
      updateEdge({ animated: true });
    } else {
      updateEdge({ animated: false });
    }
  };

  const handleArrowChange = (type: 'none' | 'end') => {
    const markerEnd =
      type === 'end'
        ? { color, type: MarkerType.ArrowClosed, orient: 'auto' }
        : undefined;
    updateEdge({ markerEnd });
  };

  const handleColorChange = (color: string) => {
    setColor(color);
    updateEdge({
      style: { stroke: color },
    });
    setShowColorPicker(false);
  };
  return (
    <Toolbar.Root className="w-full h-44 rounded-b-lg flex flex-col items-center justify-start">
      <div className="flex items-center justify-center w-full h-1/5">
        <Toolbar.Button
          onClick={() => showOptions(1)}
          className="w-1/3 h-full border-b border-r border-zinc-300 flex items-center justify-center hover:bg-gray-100 hover:border-zinc-400"
        >
          <MdHeight className="text-lg" />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => showOptions(2)}
          className="w-1/3 h-full border-b border-zinc-300 flex items-center justify-center hover:bg-gray-100 hover:border-zinc-400"
        >
          <MdColorLens className="text-lg" />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => showOptions(3)}
          className="w-1/3 h-full border-b border-l border-zinc-300 flex items-center justify-center hover:bg-gray-100 hover:border-zinc-400"
        >
          <FaLongArrowAltRight className="text-lg" />
        </Toolbar.Button>
      </div>
      <div className="h-2/3 w-full flex items-center justify-center">
        {showHeightPicker && (
          <Toolbar.Root className="w-full h-2/3 flex">
            <div className="w-4/5 flex flex-col">
              <Toolbar.Button
                onClick={() => handleLineHeightChange(1)}
                className="w-full h-1/3 p-2 hover:bg-gray-100"
              >
                <hr className="border border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(2)}
                className="w-full h-1/3 p-2 hover:bg-gray-100"
              >
                <hr className="border-2 border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(4)}
                className="w-full h-1/3 p-2 hover:bg-gray-100"
              >
                <hr className="border-4 border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(8)}
                className="w-full h-1/3 p-2 hover:bg-gray-100"
              >
                <hr className="border-8 border-black " />
              </Toolbar.Button>
            </div>
            <div className="w-1/5">
              <Toolbar.Button
                onClick={() => handleAnimatedChange()}
                className="w-full h-full p-2 hover:bg-gray-100"
              >
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
                <hr className="h-1/6 w-1/5 bg-black animate-bounce" />
              </Toolbar.Button>
            </div>
          </Toolbar.Root>
        )}
        {showColorPicker && (
          <BackgroundPicker
            onColorChange={handleColorChange}
            setShowColorPicker={setShowColorPicker}
            lineEdit={true}
          />
        )}
        {showLineType && (
          <Toolbar.Root className="w-full h-2/3 flex flex-col items-center justify-center gap-2">
            <Toolbar.Button
              className="w-full h-1/2 p-2 hover:bg-gray-100 flex items-center justify-center"
              onClick={() => handleArrowChange('none')}
            >
              <hr className="border-2 border-black w-1/5" />
            </Toolbar.Button>
            <Toolbar.Button
              className="w-full h-1/2 p-2 hover:bg-gray-100 flex items-center justify-center"
              onClick={() => handleArrowChange('end')}
            >
              <FaLongArrowAltRight className="text-lg" />
            </Toolbar.Button>
          </Toolbar.Root>
        )}
      </div>
    </Toolbar.Root>
  );
};

export default EditEdge;
