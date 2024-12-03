import { FC, useEffect, useState } from 'react';
import {
  Handle,
  NodeProps,
  NodeResizeControl,
  Position,
  useStore,
} from '@xyflow/react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FaExchangeAlt } from 'react-icons/fa';
import { ResizeIconWhite } from '../resizeCustom/ResizeCustom';
import { FiMove } from 'react-icons/fi';

interface LogicControlProps extends NodeProps {
  type: string;
  data: { typeControls: []; operatorSelected: 'AND' | 'OR' };
}
const LogicControl: FC<LogicControlProps> = ({ selected = false, data }) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const [operator, setOperator] = useState<'AND' | 'OR'>(data.operatorSelected);
  const [width, setWidth] = useState(100); // Estado para guardar a largura atual

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowOnMouseEnter(true);
    }
  }, [selected, showOnMouseEnter]);

  // Obter as edges atuais (conexões) da store do React Flow
  const edges = useStore((state) => state.edges);

  // Função para calcular a quantidade de handles com base na largura
  const calculateHandles = () => {
    const handleCount = Math.max(3, Math.floor(width / 50)); // Mínimo de 3 handles
    return handleCount;
  };

  const handles = Array.from(
    { length: calculateHandles() },
    (_, index) => index
  );

  // Função para verificar se algum handle já está conectado
  const isHandleConnected = (handleId: string) => {
    return edges.some(
      (edge) => edge.sourceHandle === handleId || edge.targetHandle === handleId
    );
  };

  // Função chamada ao redimensionar
  const handleResize = (_event: unknown, params: { width: number }) => {
    const newWidth = params.width;
    const newHandleCount = Math.floor(newWidth / 50);

    // Verificar se algum handle seria removido enquanto ainda tem uma conexão
    const currentHandleCount = calculateHandles();
    if (newHandleCount < currentHandleCount) {
      for (let i = newHandleCount; i < currentHandleCount; i++) {
        const topHandleId = `top-handle-${i}`;
        const bottomHandleId = `bottom-handle-${i}`;

        if (
          isHandleConnected(topHandleId) ||
          isHandleConnected(bottomHandleId)
        ) {
          // Se algum handle conectado está prestes a ser removido, impede a redução
          return;
        }
      }
    }

    // Permitir o redimensionamento se não houver conexões nos handles que seriam removidos
    setWidth(newWidth);
  };

  return (
    <div
      onMouseEnter={() => setShowOnMouseEnter(true)}
      onMouseLeave={() => setShowOnMouseEnter(false)}
      className={`w-full h-full min-w-[100px] ${
        operator == 'AND'
          ? 'border-t-8 border-b-8 border-gray-700 min-h-[20px] max-h-[20px]'
          : 'bg-black min-h-[6px] max-h-[6px]'
      } `}
    >
      {(selected || showOnMouseEnter) && (
        <NodeResizeControl
          onResize={handleResize}
          minWidth={100}
          minHeight={operator ? 20 : 6}
          maxHeight={operator ? 20 : 6}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        >
          <ResizeIconWhite />
        </NodeResizeControl>
      )}

      {/* Renderização dinâmica dos handles com base no tamanho */}
      {handles.map((index) => {
        const leftPosition = `${(index / (handles.length - 1)) * 100}%`; // Distribui uniformemente

        return (
          <Handle
            key={`top-${index}`}
            id={`top-handle-${index}`} // Garante que cada handle tenha um ID único
            type="source"
            position={Position.Top}
            className={`handle handle-top absolute ${
              showOnMouseEnter ? 'opacity-1' : 'opacity-0'
            }`}
            style={{ left: leftPosition }} // Garante a posição correta dos handles
          />
        );
      })}
      {handles.map((index) => {
        const leftPosition = `${(index / (handles.length - 1)) * 100}%`;

        return (
          <Handle
            key={`bottom-${index}`}
            id={`bottom-handle-${index}`} // Garante que cada handle tenha um ID único
            type="source"
            position={Position.Bottom}
            className={`handle handle-bottom absolute ${
              showOnMouseEnter ? 'opacity-1' : 'opacity-0'
            }`}
            style={{ left: leftPosition }} // Garante a posição correta dos handles
          />
        );
      })}

      {operator == 'AND' ? (
        <div className="border-b-4 border-t-4 border-black fixed top-1/2 -translate-y-1/2 -right-7 w-5 h-3"></div>
      ) : (
        <div className="bg-black fixed top-1/2 -translate-y-1/2 -right-7 w-5 h-1"></div>
      )}
      {selected && (
        <Toolbar.Root asChild>
          <div className="w-full h-full flex items-center justify-center">
            <Toolbar.Button
              className={`fixed -left-10 rounded-full bg-white border border-gray-500 hover:border-gray-600 hover:bg-gray-200 p-2 transition-colors duration-200`}
              onClick={() => {
                setOperator(operator === 'AND' ? 'OR' : 'AND');
                data.operatorSelected = operator === 'AND' ? 'OR' : 'AND';
              }}
            >
              <FaExchangeAlt />
            </Toolbar.Button>
          </div>
        </Toolbar.Root>
      )}
      {(selected || showOnMouseEnter) && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <FiMove className="drag-handle__custom rotate-45 hover:scale-125 transition-all duration-150" />
        </div>
      )}
    </div>
  );
};

export default LogicControl;
