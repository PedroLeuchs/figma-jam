import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import {
  ReactFlow,
  Background,
  Node,
  ConnectionMode,
  useEdgesState,
  Connection,
  addEdge,
  useNodesState,
  BackgroundVariant,
  useReactFlow,
  MiniMap,
  ColorMode,
  MarkerType,
  NodeChange,
  Edge,
  // NodeChange,
} from '@xyflow/react';
import { useDnD } from '../sideBar/DndContext';
import '@xyflow/react/dist/style.css';

import { zinc } from 'tailwindcss/colors';

//components
import SideBar from '../sideBar/SideBar';
import AlertComponent from '../alert/AlertComponent';

//services
import { EQUIPAMENT } from '../../services/Equipament';
import { MACHINES } from '../../services/Machines';
import { VALUESSIDEBAR } from '../../services/ValuesSideBar';
import { UNITYPHASES } from '../../services/Unitys';
import {
  INITIAL_NODES,
  getId,
  // GROUPIDS,
  NODE_TYPES,
} from '../../services/InicialNodes';
import { EDGE_TYPES, INITIAL_EDGES } from '../../services/inicialEdges';

import BackAndNext from '../sideBar/BackAndNext';
import { CiDark, CiLight } from 'react-icons/ci';

import { useHistoryState } from '@uidotdev/usehooks';
import { debounce } from '@mui/material';
import ZoomControl from '../sideBar/ZoomControl';
// import { useHandleNodesChangeWithHistory } from '../historyState/HistoryState';
// import { debounce } from '@mui/material';

export function DnDFlow() {
  const { state, set, undo, redo, canUndo, canRedo } = useHistoryState({
    nodesHistoryState: INITIAL_NODES,
    edgesHistoryState: INITIAL_EDGES,
  });
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    state.edgesHistoryState
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(
    state.nodesHistoryState
  );
  const [type, setType] = useDnD();
  const { screenToFlowPosition } = useReactFlow();
  const [selectedUnityId, setSelectedUnityId] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');

  const { getIntersectingNodes } = useReactFlow();
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');
  const [isResizing, setIsResizing] = useState(false);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  // const [canEditEdges, setCanEditEdges] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState<string | null>(
    null
  );

  // useEffect(() => {
  //   // Verifica se algum edge está selecionado
  //   const isAnySelected = edges.some((edge) => edge.selected);
  //   setCanEditEdges(isAnySelected);
  // }, [edges]);

  const handleNodeSelect = (nodeType: string, label?: string) => {
    onShowAlert(
      `${label} Selecionado. Clique na tela para adicionar o nó.`,
      'info'
    );

    setSelectedNodeType(nodeType);
    setSelectedNodeLabel(label || 'Novo Nó');
  };

  const handleClickOnWorkspace = (event: React.MouseEvent) => {
    if (!selectedNodeType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: Node = {
      id: getId().toString(),
      type: selectedNodeType,
      position,
      data: { label: selectedNodeLabel },
      style: {},
    };

    set({
      ...state,
      nodesHistoryState: [...state.nodesHistoryState, newNode],
    });

    onShowAlert(`${selectedNodeLabel} Adicionado com sucesso.`, 'success');
    setSelectedNodeType(null);
    setSelectedNodeLabel(null);
  };

  // function useHandleNodesChangeWithHistory(
  //   onNodesChange: OnNodesChange, // Usando o tipo específico OnNodesChange
  //   nodes: Node[], // Usando tipo específico para os nodes
  //   set: any
  // ) {
  //   return useCallback(
  //     (changes: NodeChange[]) => {
  //       // Define mudanças como NodeChange<CustomNode>[]
  //       // Chama a função onNodesChange original para aplicar as mudanças no estado dos nodes
  //       onNodesChange(changes);

  //       set({
  //         ...state,
  //         nodesHistoryState: [...state.nodesHistoryState, changes],
  //       });

  //       // Atualiza o histórico após aplicar as mudanças
  //     },
  //     [onNodesChange, nodes, set]
  //   );
  // }

  // const handleNodesChangeWithHistory = useHandleNodesChangeWithHistory(
  //   onNodesChange,
  //   nodes,
  //   set
  // );

  // const handleNodesChangeWithHistory = useCallback(
  //   (changes: any) => {
  //     // Atualiza os nodes usando o onNodesChange original
  //     onNodesChange(changes);

  //     // Após a atualização, salva o novo estado dos nodes no histórico
  //     set((prevState) => ({
  //       ...prevState,
  //       nodesHistoryState: [
  //         ...prevState.nodesHistoryState,
  //         applyNodeChanges(changes, nodes),
  //       ],
  //     }));
  //   },
  //   [onNodesChange, nodes, set]
  // );

  // const [isResizing, setIsResizing] = useState(false);

  const onNodeClick = useCallback((_?: React.MouseEvent, node?: Node) => {
    if (node === undefined) {
      setSelectedUnityId('');
      return;
    }
    if (node.type === 'unity') {
      setSelectedUnityId(node.id);
    } else {
      setSelectedUnityId('');
    }
  }, []);

  // const verifyHasNodeOnUnity = useCallback(
  //   (nodes: Node[]) => {
  //     if (hasNodeOnUnityVerify) {
  //       return;
  //     }

  //     nodes.forEach((node) => {
  //       const isUnity = GROUPIDS.includes(node.id);

  //       if (isUnity) {
  //         const { position, style } = node;
  //         const { x, y } = position;
  //         const { width, height } = style as { width: number; height: number };

  //         // Filtra nodes que estão dentro da unidade
  //         const nodesInUnity = nodes.filter((otherNode) => {
  //           if (otherNode.id === node.id) return false;

  //           const otherX = otherNode.position.x;
  //           const otherY = otherNode.position.y;

  //           return (
  //             otherX >= x &&
  //             otherX <= x + width &&
  //             otherY >= y &&
  //             otherY <= y + height
  //           );
  //         });

  //         // Se houver nodes dentro da unidade, distribui-os em uma grade
  //         if (nodesInUnity.length > 0) {
  //           const gridColumns = Math.ceil(Math.sqrt(nodesInUnity.length));
  //           const cellWidth = width / gridColumns;
  //           const cellHeight = height / gridColumns;

  //           nodesInUnity.forEach((foundNode, index) => {
  //             const row = Math.floor(index / gridColumns);
  //             const col = index % gridColumns;

  //             foundNode.parentId = node.id || '';
  //             foundNode.position = {
  //               x: col * cellWidth + cellWidth / 2,
  //               y: row * cellHeight + cellHeight / 2,
  //             };
  //             foundNode.extent = 'parent'; // Define para ficar posicionado relativo ao parent
  //           });
  //         }
  //       }
  //     });
  //   },
  //   [hasNodeOnUnityVerify]
  // );

  const onNodeDragOver = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type === 'unity') {
        return;
      }
      if (node.type === 'separator') {
        return;
      }
      console.log('nodes: ', nodes);
      console.log('state.nodesHistoryState: ', state.nodesHistoryState);

      const intersectingUnities = getIntersectingNodes(node).filter(
        (n) => n.type === 'unity'
      );

      if (intersectingUnities.length > 0) {
        const unityNode = intersectingUnities[0];
        const relativePosition = {
          x:
            node.position.x -
            (node.parentId
              ? node.parentId == ''
                ? unityNode.position.x
                : 0
              : unityNode.position.x),
          y:
            node.position.y -
            (node.parentId
              ? node.parentId == ''
                ? unityNode.position.y
                : 0
              : unityNode.position.y),
        };

        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  parentId: unityNode.id,
                  position: relativePosition,
                }
              : n
          )
        );
        set({
          ...state,
          nodesHistoryState: nodes.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  parentId: unityNode.id,
                  position: relativePosition,
                }
              : n
          ),
        });
      } else {
        set({
          ...state,
          nodesHistoryState: nodes.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  position: { x: node.position.x, y: node.position.y },
                }
              : n
          ),
        });
      }
    },
    [getIntersectingNodes, setNodes, set, state, nodes]
  );

  const onConnect = useCallback(
    (connection: Connection & { markerEnd?: { type: MarkerType } }) => {
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
        newEdge.markerEnd = { type: MarkerType.ArrowClosed };
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
    [nodes, edges, setEdges, set, state]
  );
  const doesPhaseBelongToUnity = (
    unityName: string | unknown,
    phaseName: string
  ) => {
    // Encontra a unidade correspondente no UNITYPHASES
    const unity = UNITYPHASES.find((u) => u.Unidade === unityName);

    if (!unity) return false; // Se a unidade não for encontrada, retorna falso

    // Verifica se a phase está nas fases da unidade
    return unity.Fases.includes(phaseName);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
    label?: string
  ) => {
    setNewLabel(label || '');
    setType(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      // Conta a quantidade de triângulos já presentes
      const triangleCount = nodes.filter(
        (node) => node.type === 'triangle'
      ).length;

      // Se já houverem dois triângulos, exibe alerta e retorna
      if (triangleCount >= 2 && type === 'triangle') {
        onShowAlert(
          'Você só pode adicionar no máximo dois triângulos.',
          'error'
        );
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode: Node = {
        id: type === 'unity' ? getId('unity').toString() : getId().toString(),
        type,
        measured: {
          width:
            type === 'square' || type === 'phase'
              ? 200
              : type === 'circle' || type === 'triangle'
              ? 100
              : type === 'unity'
              ? 500
              : 50,
          height:
            type === 'square' || type === 'phase'
              ? 50
              : type === 'circle' || type === 'triangle'
              ? 100
              : type === 'unity'
              ? 500
              : 50,
        },
        position,
        data: {
          label:
            type === 'circle'
              ? 'Novo Silo'
              : type === 'square'
              ? 'Novo Equipamento'
              : type === 'unity'
              ? UNITYPHASES[0].Unidade
              : type === 'phase'
              ? newLabel
              : type === 'label'
              ? 'Escreva aqui'
              : 'Novo Nó',
          ingredients: type === 'square' ? EQUIPAMENT : null,
          machine: type === 'circle' ? MACHINES : null,
          unitphases: type === 'unity' ? UNITYPHASES : null,
          operatorSelected: type === 'logicControl' ? 'AND' : null,
        },
        style: {},
      };

      if (type !== 'unity') {
        newNode.parentId = '';
        if (type == 'phase' || type == 'logicControl') {
          newNode.extent = 'parent';
        }
      }

      if (type !== 'square') {
        newNode.data.ingredients = null;
      }

      if (type !== 'circle') {
        newNode.data.machine = null;
      }

      if (type !== 'unity') {
        newNode.data.unitphases = null;
      }
      if (type !== 'logicControl') {
        newNode.data.operatorSelected = null;
      }
      if (type === 'triangle') {
        let countTriangle = 0;
        nodes.map((node) => {
          if (node.type === 'triangle') {
            countTriangle++;
          }
        });
        if (countTriangle === 0) {
          newNode.data.direction = false;
        } else if (countTriangle === 1) {
          newNode.data.direction = true;
        }
      }

      if (type === 'unity') {
        newNode = {
          ...newNode,
          style: { width: Number(500), height: Number(300) },
        };
      }

      if (type !== 'unity') {
        const parentGroup = nodes.find(
          (node) =>
            node.type === 'unity' &&
            position.x > node.position.x &&
            position.x <
              node.position.x +
                (typeof node.measured?.width === 'number'
                  ? node.measured.width
                  : 0) &&
            position.y > node.position.y &&
            position.y <
              node.position.y +
                (typeof node.measured?.height === 'number'
                  ? node.measured.height
                  : 0)
        );

        if (type === 'phase') {
          if (!parentGroup) {
            onShowAlert(
              'Você só pode adicionar uma Phase dentro de uma Unity.',
              'error'
            );
            return;
          }
          if (!doesPhaseBelongToUnity(parentGroup.data.label, newLabel)) {
            onShowAlert(
              `${newLabel} não pertence a ${parentGroup.data.label}.`,
              'error'
            );
            return;
          }

          newNode = {
            ...newNode,
            parentId: parentGroup.id,
            data: {
              label: newLabel,
              unitphases: UNITYPHASES,
              ingredients: null,
              machine: null,
              operatorSelected: null,
            },
          };
        } else if (type === 'logicControl') {
          newNode = {
            ...newNode,
            parentId: parentGroup?.id ? parentGroup.id : '00',
            data: {
              label: null,
              unitphases: null,
              ingredients: null,
              machine: null,
              operatorSelected: 'AND',
            },
          };
        } else {
          if (parentGroup) {
            onShowAlert(
              'Você só pode adicionar Phase e Controle de lógica dentro de uma Unity.',
              'error'
            );
            return;
          }
          newNode = {
            ...newNode,
            id: getId().toString(),
            parentId: '',
          };
        }
      }

      setNodes((prevNodes) => [...prevNodes, newNode]);
      set({
        ...state,
        nodesHistoryState: [...state.nodesHistoryState, newNode],
      });
    },
    [screenToFlowPosition, type, setNodes, nodes, newLabel, state, set]
  );

  const removeMarcaDagua = () => {
    const reactIconFlow = document.getElementsByClassName(
      'react-flow__panel react-flow__attribution bottom right'
    );
    if (reactIconFlow.length > 0) {
      reactIconFlow[0].classList.add('hidden');
    }
  };

  removeMarcaDagua();

  // const mapNodesWithPhasesAndSettingsCheck = (nodes: Node[]) => {

  //   // Percorre todos os nodes para configurar `hasPhases` e `canSettings` em cada `unity`
  //   nodes.forEach((node) => {
  //     if (node.type === 'unity') {
  //       // Filtra os nodes filhos da unidade atual
  //       const childrenNodes = nodes.filter(
  //         (child) => child.parentId === node.id
  //       );

  //       // Verifica se a unidade contém algum `phase`
  //       const hasPhases = childrenNodes.some((child) => child.type === 'phase');

  //       // Define as propriedades `hasPhases` e `canSettings` com base nos `phases`
  //       node.data.canSettings = hasPhases; // Se tiver phases, `canSettings` será `false`

  //       // Armazena os nodes filhos dentro da propriedade `childrenNodes`
  //     }
  //   });

  //   return nodes; // Retorna os nodes atualizados com as novas propriedades
  // };

  // Executando a função para mapear os nodes com `hasPhases` e `canSettings`

  const onToggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  // useEffect(() => {
  //   mapNodesWithPhasesAndSettingsCheck(nodes);
  // }, [nodes, mapNodesWithPhasesAndSettingsCheck]);

  useEffect(() => {
    const mapNodesWithPhasesAndSettingsCheck = (nodes: Node[]) => {
      nodes.forEach((node) => {
        if (node.type === 'unity') {
          const childrenNodes = nodes.filter(
            (child) => child.parentId === node.id
          );

          const hasPhases = childrenNodes.some(
            (child) => child.type === 'phase'
          );
          node.data.canSettings = hasPhases;
        }
      });

      return nodes;
    };

    mapNodesWithPhasesAndSettingsCheck(state.nodesHistoryState);
    setEdges(state.edgesHistoryState);
    setNodes(state.nodesHistoryState);
    mapNodesWithPhasesAndSettingsCheck(state.nodesHistoryState);
  }, [state, setEdges, setNodes]);

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

  const onShowAlert = (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success'
  ) => {
    setShowAlertMessage(message);
    setShowAlertSeverity(severity);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

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

  const handleNodeChanges = (changes: NodeChange<Node>[]) => {
    onNodesChange(changes);

    changes.forEach((change) => {
      // Verifica se é um tipo de mudança que tem id
      let nodeId: string | undefined;
      let newDimensions: { width: number; height: number } | undefined;
      let position: { x: number; y: number } | undefined;

      // Verifica o tipo de mudança
      if ('id' in change) {
        nodeId = change.id;
      }

      if ('position' in change) {
        const positionChange = change;
        position = positionChange.position;
      }

      if ('dimensions' in change) {
        const resizeChange = change;
        newDimensions = resizeChange.dimensions;
      }

      // Obtém o rótulo do nó
      const nodelabel = nodes.find((node) => node.id === nodeId)?.data.label;

      // Chama handleResize se houver um id, dimensões ou posição e um rótulo do nó
      if (nodeId && (newDimensions || position) && nodelabel) {
        handleResize(nodeId, newDimensions, position, nodelabel); // Passa o id e as dimensões
      }
    });
    // handleLabelChange();
  };

  const handleDeleteNodes = ({
    nodes: deletedNodes,
    edges: deletedEdges,
  }: {
    nodes: Node[];
    edges: Edge[];
  }) => {
    const newNodes = nodes.filter(
      (node) => !deletedNodes.some((deletedNode) => deletedNode.id === node.id)
    );
    const newEdges = edges.filter(
      (edge) => !deletedEdges.some((deletedEdge) => deletedEdge.id === edge.id)
    );

    setNodes(newNodes);
    setEdges(newEdges);
    set({
      ...state,
      nodesHistoryState: newNodes,
      edgesHistoryState: newEdges,
    });
  };

  // const handleLabelChange = useCallback(() => {
  //   // Verifica se há algum nó com label diferente em nodesHistoryState
  //   const labelsDiffer = nodes.some((node, index) => {
  //     const correspondingNode = state.nodesHistoryState[index];
  //     return node.data.label !== correspondingNode?.data.label;
  //   });

  //   if (labelsDiffer) {

  //     // Atualiza o estado para refletir as novas labels de nodes
  //     set({
  //       ...state,
  //       nodesHistoryState: nodes.map((node) => ({
  //         ...node,
  //         data: {
  //           ...node.data,
  //           label: node.data.label,
  //         },
  //       })),
  //     });
  //   } else {
  //   }
  // }, [nodes, state, set]);

  return (
    <div className="w-screen h-screen relative right-0 dndflow">
      {/* <div className="w-screen h-screen dndflow"> */}
      {/* <DnDProvider> */}
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          panOnScroll={false}
          panOnDrag={true}
          zoomOnPinch={true}
          onNodeClick={onNodeClick}
          onPaneClick={handleClickOnWorkspace}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodes={nodes}
          edges={edges}
          onNodeDragStop={onNodeDragOver}
          onNodesChange={handleNodeChanges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDelete={handleDeleteNodes}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{ type: 'default' }}
          minZoom={0.01}
          maxZoom={2.5}
          defaultViewport={{
            x: 0,
            y: 0,
            zoom: viewportWidth < 1000 ? 0.3 : 1,
          }}
          colorMode={colorMode}
        >
          <BackAndNext
            canUndo={canUndo}
            canRedo={canRedo}
            undo={undo}
            redo={redo}
          />
          <Background
            variant={BackgroundVariant.Cross}
            size={7}
            gap={40}
            color={colorMode == 'light' ? zinc[200] : zinc[800]}
          />

          <ZoomControl
            nodes={nodes}
            viewportHeight={viewportHeight}
            viewportWidth={viewportWidth}
          />

          {/* dispositivos xl  */}
          <div className="2xl:flex xl:hidden lg:hidden md:hidden sm:hidden xs:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 220,
                height: 150,
              }}
            />
          </div>
          {/* dispositivos xl  */}
          <div className="2xl:hidden xl:flex lg:hidden md:hidden sm:hidden xs:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 220,
                height: 140,
              }}
            />
          </div>
          {/* dispositivos lg  */}
          <div className="2xl:hidden xl:hidden lg:flex md:hidden sm:hidden xs:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 200,
                height: 140,
              }}
            />
          </div>
          {/* dispositivos md  */}
          <div className="xl:hidden lg:hidden md:flex sm:hidden xs:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 170,
                height: 110,
              }}
            />
          </div>
          {/* dispositivos sm  */}
          <div className="xl:hidden lg:hidden md:hidden sm:flex xs:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 150,
                height: 80,
              }}
            />
          </div>
          {/* dispositivos xs  */}
          <div className=" xl:hidden lg:hidden md:hidden sm:hidden xs:flex flex ">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                bottom: 30,
                backgroundColor: zinc[400],
                borderRadius: 10,
                width: 130,
                height: 60,
              }}
            />
          </div>
        </ReactFlow>
      </div>
      {/* </DnDProvider> */}

      <SideBar
        nodes={nodes}
        edges={edges}
        state={state}
        set={set}
        setEdges={setEdges}
        ingredients={VALUESSIDEBAR}
        onDragStart={onDragStart}
        selectedUnityId={selectedUnityId}
        unitphases={UNITYPHASES}
        onNodeSelect={handleNodeSelect}
        viewportWidth={viewportWidth}
        viewportHeight={viewportHeight}
      />
      <div
        onClick={onToggleColorMode}
        className={`border cursor-pointer bg-gray-100  border-gray-400 dark:bg-zinc-700  dark:border-zinc-600 fixed top-2 2xl:right-72 xl:right-64 lg:right-56 right-16 rounded-full flex items-center justify-center p-2 transition-all duration-500 ease-in-out ${
          colorMode == 'light' ? 'hover:-rotate-90' : 'hover:-scale-x-100'
        }`}
      >
        {colorMode == 'light' ? (
          <CiLight className="text-3xl text-black " />
        ) : (
          <CiDark className="text-3xl text-white" />
        )}
      </div>

      <AlertComponent
        show={showAlert}
        message={showAlertMessage}
        severity={showAlertSeverity}
      />
    </div>
  );
}

/**
 * Instalações necessárias:
 * npm install @xyflow/react
 * npm install reactflow
 * npm install @reactflow/node-resizer
 * npm install --save-dev @types/reactflow
 * npm install @radix-ui/react-toolbar
 * npm install @radix-ui/react-select
 * npm install @radix-ui/react-dialog
 * npm i react-icons
 * npm i @uidotdev/usehooks
 * npm install @mui/material @emotion/react @emotion/styled
 */

/**
 *To-Do:
 - [x] Ajustar enquadramento do zoom.
 - [x] Ajustar controle de logica quando solto em uma unity de fora pra dentro.
 
 - [x] Fazer documentação.
 - [x] Integração com o mes3.
 - [x] Fazer manual de uso do fluxograma.
 
 *Doing:
 - [x] Mobile.
 - [x] Ajustar cor da edge tipo arrow
 - [x] Ajustar para não deixar adicionar mais de dois triangulos pelo mobile.
 - [x] Ajustar add unity pelo mobile.
 - [x] Ajustar edges pelo mobile.
 
 - [x] Edição das labels(negrito, sublinhado, tamanho, itálico, cor).
 
 *Done: 
 
- [V] Ajustar a controle de lógica para que possa ser arrastado para fora de unitys também.
- [V] se não ter nenhum triangulo o primeiro é start e o segundo é end .

- [?] Ajustar lógica do histórico de estados.(não precisou)
- [V] Adicionar alertas de erro.
- [V] Adicionar modal de edição no grupo de nodes.
- [V] Ajustar para que as phases possam ser colocadas apenas as unitys que elas pertencem.
- [V] Depois que existe uma phase dentro da unity, não pode mudar o tipo da unity.
- [V] Ajustar Inicial Nodes exemplo.
- [V] Ajustar css do menu lateral.
- [V] Ajustar Z-index das edges.
- [V] Armazenar edição das edges no histórico.
- [V] Ajustar mensagem de erro e verificar se o json está correto conforme uma atualização de uma edge nula.
- [V] Austar as edges para não permitir conexão de inferior para inferior e superior para superior.
- [V] Atualizar o historico conforme o delete.
- [V] Apenas um start e um end por receita.
- [V] bloquear todos os cantos menos o inferior direito.
- [V] Ajustar node tipo text para que possa ser escrito.
- [V] Só pode adicionar phases dentro de uma unity.
- [V] Ajustar edges.
- [V] Nenhum node pode fazer ligação nele mesmo.


  *Impossivel: 
- [x] Armazenar o historico de uma label de todos os nodes.
- [x] Armazenar tipo do controle de logica no historico.

*/
