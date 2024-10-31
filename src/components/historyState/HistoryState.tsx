// import { useCallback } from 'react';
// import {
//   Node,
//   NodeChange,
//   applyNodeChanges,
//   OnNodesChange,
//   Edge,
// } from 'reactflow';

// // Tipo específico para os dados de cada nó e tipo de nó
// interface NodeData {
//   label: string; // Exemplo de dado, adapte conforme necessário
// }

// type CustomNode = Node<NodeData>;
// type CustomEdge = Edge;

// // Define o tipo do estado do histórico, com listas de nós e edges
// interface HistoryState {
//   nodesHistoryState: CustomNode[];
//   edgesHistoryState: CustomEdge[];
// }

// // Define a função `set` como um tipo que atualiza o estado do histórico
// type SetHistoryState = (
//   stateUpdater: (prevState: HistoryState) => HistoryState
// ) => void;

// // Adaptar a função handleNodesChangeWithHistory para TypeScript sem `any`
// export function useHandleNodesChangeWithHistory(
//   onNodesChange: OnNodesChange, // Usando o tipo específico OnNodesChange
//   nodes: CustomNode[], // Usando tipo específico para os nodes
//   set: SetHistoryState
// ) {
//   return useCallback(
//     (changes: NodeChange[]) => {
//       // Define mudanças como NodeChange<CustomNode>[]
//       // Chama a função onNodesChange original para aplicar as mudanças no estado dos nodes
//       onNodesChange(changes);

//       // Atualiza o histórico após aplicar as mudanças
//       set((prevState) => ({
//         ...prevState,
//         nodesHistoryState: [
//           ...prevState.nodesHistoryState,
//           ...applyNodeChanges(changes, nodes),
//         ],
//       }));
//     },
//     [onNodesChange, nodes, set]
//   );
// }
