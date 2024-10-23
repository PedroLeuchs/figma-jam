import { FC, useState } from 'react';
import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  useStore,
} from '@xyflow/react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { FaExchangeAlt } from 'react-icons/fa';

interface LogicControlProps extends NodeProps {
  type: string;
}
const LogicControl: FC<LogicControlProps> = ({ selected = false }) => {
  const [showOnMouseEnter, setShowOnMouseEnter] = useState(false);
  const [operator, setOperator] = useState(true);
  const [width, setWidth] = useState(100); // Estado para guardar a largura atual

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
  const handleResize = (event: unknown, params: { width: number }) => {
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
        operator
          ? 'border-t-8 border-b-8 border-gray-700 min-h-[20px] max-h-[20px]'
          : 'bg-black min-h-[6px] max-h-[6px]'
      } `}
    >
      <NodeResizer
        minHeight={operator ? 20 : 6}
        minWidth={100}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
        onResize={handleResize} // Usar a função handleResize para gerenciar o redimensionamento
      />

      {/* Renderização dinâmica dos handles com base no tamanho */}
      {handles.map((handle, index) => {
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
      {handles.map((handle, index) => {
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

      {operator ? (
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
                setOperator(!operator);
              }}
            >
              <FaExchangeAlt />
            </Toolbar.Button>
          </div>
        </Toolbar.Root>
      )}
    </div>
  );
};

export default LogicControl;
