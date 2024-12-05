import { useCallback } from 'react';
import { Connection, Edge, Node, MarkerType, addEdge } from '@xyflow/react';

interface ConnectProps {
  nodes: Node[];
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
  onShowAlert: (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success'
  ) => void;
}

export const useConnect = ({
  nodes,
  edges,
  setEdges,
  set,
  state,
  onShowAlert,
}: ConnectProps) => {
  const onConnect = useCallback(
    (
      connection: Connection & {
        markerEnd?: { type: MarkerType; color?: string };
      }
    ) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (
        connection.sourceHandle === 'top' ||
        connection.targetHandle === 'bottom'
      ) {
        onShowAlert(
          'Conexões do handle superior da origem ou para o handle inferior do destino não são permitidas.',
          'error'
        );
        return;
      }

      if (sourceNode?.id === targetNode?.id) {
        onShowAlert('Não é permitido conectar um nó a ele mesmo.', 'error');
        return;
      }
      if (connection.sourceHandle === connection.targetHandle) {
        const traducaoHandle =
          connection.sourceHandle == 'bottom' ? 'inferiores' : 'superiores';
        onShowAlert(
          `Não é permitido conectar dois nodes pelas partes ${traducaoHandle}.`,
          'error'
        );
        return;
      }

      // Verificar se o targetNode já possui uma conexão de entrada
      const targetHasIncomingEdge = edges.some(
        (edge) =>
          edge.target === connection.target &&
          edge.targetHandle === connection.targetHandle // Verifica a handle do target
      );

      if (targetHasIncomingEdge && targetNode?.type !== 'logicControl') {
        onShowAlert(
          'O nó de destino já possui uma conexão de entrada na mesma handle. Use o controle de lógica para fazer mais conexões.',
          'error'
        );
        return; // Impede a conexão se o nó já estiver recebendo uma edge na mesma handle
      }

      // Verificar se já existe uma conexão na mesma sourceHandle ou targetHandle
      const handleAlreadyConnected = edges.some(
        (edge) =>
          (edge.source === connection.source &&
            edge.sourceHandle === connection.sourceHandle) ||
          (edge.target === connection.target &&
            edge.targetHandle === connection.targetHandle)
      );

      if (handleAlreadyConnected) {
        onShowAlert(
          'Já existe uma conexão na mesma handle. Não é permitido mais de uma conexão no mesmo ponto.',
          'error'
        );
        return; // Impede a conexão se já existir uma ligação na mesma handle
      }

      // Adiciona nova edge

      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        style: { stroke: '#000000', zIndex: 99999 },
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };

      if (sourceNode?.type === 'phase' && targetNode?.type === 'phase') {
        newEdge.markerEnd = {
          color: '#000000',
          type: MarkerType.ArrowClosed,
        };
      }

      setEdges((edges) =>
        addEdge(
          {
            ...newEdge,
            sourceHandle: newEdge.sourceHandle ?? null,
            targetHandle: newEdge.targetHandle ?? null,
          },
          edges
        )
      );

      set({
        ...state,
        edgesHistoryState: [...state.edgesHistoryState, newEdge],
      });
    },
    [nodes, edges, setEdges, set, state, onShowAlert]
  );

  return { onConnect };
};
