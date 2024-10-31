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
  Panel,
  MiniMap,
  ColorMode,
  MarkerType,
  NodeChange,
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
  GROUPIDS,
  NODE_TYPES,
} from '../../services/InicialNodes';
import { EDGE_TYPES, INITIAL_EDGES } from '../../services/inicialEdges';

import { MdOutlineZoomInMap } from 'react-icons/md';
import { MdOutlineZoomIn } from 'react-icons/md';
import { MdOutlineZoomOut } from 'react-icons/md';
import BackAndNext from '../sideBar/BackAndNext';
import { CiDark, CiLight } from 'react-icons/ci';

import { useHistoryState } from '@uidotdev/usehooks';
import { debounce } from '@mui/material';
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
  const { setViewport, zoomIn, zoomOut } = useReactFlow();
  const { getIntersectingNodes } = useReactFlow();
  const [hasNodeOnUnityVerify, setHasNodeOnUnityVerify] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');
  const [isResizing, setIsResizing] = useState(false);

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

  const verifyHasNodeOnUnity = useCallback(
    (nodes: Node[]) => {
      if (hasNodeOnUnityVerify) {
        return;
      }

      nodes.forEach((node) => {
        const isUnity = GROUPIDS.includes(node.id);

        if (isUnity) {
          const { position, style } = node;
          const { x, y } = position;
          const { width, height } = style as { width: number; height: number };

          const nodesInUnity = nodes.filter((otherNode) => {
            const otherX = otherNode.position.x;
            const otherY = otherNode.position.y;

            if (otherNode.id === node.id) return false;

            return (
              otherX >= x &&
              otherX <= x + width &&
              otherY >= y &&
              otherY <= y + height
            );
          });

          if (nodesInUnity.length > 0) {
            nodesInUnity.forEach((foundNode) => {
              if (foundNode.type !== 'unity') {
                foundNode.parentId = node.id || '';
                foundNode.position.x = foundNode.position.x - width;
                foundNode.position.y = foundNode.position.y - height;
              }
            });
          }
        }
      });
    },
    [hasNodeOnUnityVerify]
  );

  const onNodeDragOver = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type === 'unity') {
        return;
      }
      if (node.type === 'separator') {
        return;
      }

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

  const removeMarcaDagua = () => {
    const reactIconFlow = document.getElementsByClassName(
      'react-flow__panel react-flow__attribution bottom right'
    );
    if (reactIconFlow.length > 0) {
      reactIconFlow[0].classList.add('hidden');
    }
  };

  removeMarcaDagua();

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!type) {
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
        newNode.extent = 'parent';
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
          if (!parentGroup) {
            onShowAlert(
              'Você só pode adicionar um Controle de lógica dentro de uma Unity.',
              'error'
            );
            return;
          }
          newNode = {
            ...newNode,
            parentId: parentGroup.id,
            data: {
              label: null,
              unitphases: null,
              ingredients: null,
              machine: null,
              operatorSelected: 'AND',
            },
          };
        } else {
          newNode = {
            ...newNode,
            id: getId().toString(),
            parentId: '00',
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

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const lookAllElements = (
    nodes: Node[],
    viewportWidth: number,
    viewportHeight: number
  ) => {
    if (nodes.length === 0) {
      return { x: 0, y: 0, zoom: 1 };
    }

    let minX = nodes[0].position.x;
    let minY = nodes[0].position.y;
    let maxX = nodes[0].position.x;
    let maxY = nodes[0].position.y;

    nodes.forEach((node) => {
      if (!node.parentId) {
        if (node.position.x < minX) {
          minX = node.position.x;
        }
        if (node.position.y < minY) {
          minY = node.position.y;
        }
        if (node.position.x > maxX) {
          maxX = node.position.x;
        }
        if (node.position.y > maxY) {
          maxY = node.position.y;
        }
      }
    });

    const centerX = (maxX + minX) / 2;
    const centerY = (maxY + minY) / 2;

    const width = maxX - minX;
    const height = maxY - minY;

    const zoomX = viewportWidth / width;
    const zoomY = viewportHeight / height;

    let zoom = Math.min(zoomX, zoomY) * 0.9;

    if (zoom < 0.08) {
      zoom = 0.08;
    } else {
      zoom *= 0.98;
    }

    const factorX = (viewportHeight + viewportWidth) / (maxX - minX) / 3.5;
    const factorY = (viewportHeight + viewportWidth) / (maxY - minY) / 3.5;

    const xAdjusted = (centerX - viewportWidth / 2 / zoom) * -1 * factorX;
    const yAdjusted = (centerY - viewportHeight / 2 / zoom) * -1 * factorY;

    return {
      x: xAdjusted,
      y: yAdjusted,
      zoom,
    };
  };

  const onToggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    nodes.forEach((node) => {
      if (!node.parentId) {
        verifyHasNodeOnUnity(nodes);
        setHasNodeOnUnityVerify(true);
      }
    });
  }, [nodes, verifyHasNodeOnUnity]);

  useEffect(() => {
    setEdges(state.edgesHistoryState);
    setNodes(state.nodesHistoryState);
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
    handleLabelChange();
  };

  const handleLabelChange = useCallback(() => {
    // Verifica se há algum nó com label diferente em nodesHistoryState
    const labelsDiffer = nodes.some((node, index) => {
      const correspondingNode = state.nodesHistoryState[index];
      return node.data.label !== correspondingNode?.data.label;
    });

    if (labelsDiffer) {
      console.log('entrou');

      // Atualiza o estado para refletir as novas labels de nodes
      set({
        ...state,
        nodesHistoryState: nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: node.data.label,
          },
        })),
      });
      console.log('Labels foram atualizadas.');
    } else {
      // console.log('Todas as labels já estão iguais.');
    }
  }, [nodes, state, set]);
  console.log('correspondingNode', state.nodesHistoryState[3].data.label);
  console.log('node', nodes[3].data.label);

  return (
    <div className="w-screen h-screen relative right-0 dndflow">
      {/* <div className="w-screen h-screen dndflow"> */}
      {/* <DnDProvider> */}
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          onNodeClick={onNodeClick}
          onPaneClick={onNodeClick}
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
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{ type: 'default' }}
          minZoom={0.01}
          maxZoom={2.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
          <Panel
            position="bottom-left"
            className="flex flex-col items-center justify-center p-1 gap-1 bg-gray-200  rounded border border-black dark:bg-zinc-700 dark:border-zinc-500 dark:text-zinc-400 "
          >
            <button
              className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
              onClick={() => zoomIn({ duration: 500 })}
            >
              <MdOutlineZoomIn className="text-xl w-full h-full hover:scale-125  transition-all duration-200 " />
            </button>
            <button
              className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
              onClick={() => zoomOut({ duration: 500 })}
            >
              <MdOutlineZoomOut className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
            </button>
            <button
              className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white hover:scale-110 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 transition-all"
              onClick={() =>
                setViewport(
                  lookAllElements(nodes, viewportWidth, viewportHeight),
                  { duration: 500 }
                )
              }
            >
              <MdOutlineZoomInMap className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
            </button>
          </Panel>
          <MiniMap
            zoomable
            pannable
            style={{
              backgroundColor: zinc[400],
              borderRadius: 10,
            }}
          />
        </ReactFlow>
      </div>
      {/* </DnDProvider> */}

      <SideBar
        nodes={nodes}
        edges={edges}
        setEdges={setEdges}
        ingredients={VALUESSIDEBAR}
        onDragStart={onDragStart}
        selectedUnityId={selectedUnityId}
        unitphases={UNITYPHASES}
      />
      <div
        onClick={onToggleColorMode}
        className={`border cursor-pointer bg-gray-100  border-gray-400 dark:bg-zinc-700  dark:border-zinc-600 fixed top-5 right-52 rounded-full flex items-center justify-center p-2 transition-all duration-500 ease-in-out ${
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

- [x] Ajustar lógica do histórico de estados.
- [x] Ajustar css do menu lateral.
- [x] Ajustar para que as phases possam ser colocadas apenas as unitys que elas pertencem.
- [x] Depois que existe uma phase dentro da unity, não pode mudar o tipo da unity.
- [x] Austar as edges para não permitir conexão de inferior para inferior e superior para superior.
- [x] Ajustar mensagem de erro e verificar se o json está correto conforme uma atualização de uma edge nula.
- [x] Nenhum node pode fazer ligação nele mesmo.
- [x] Atualizar o historico conforme o delete.
- [x] Apenas um start e um end por receita.
- [x] Ajustar Inicial Nodes exemplo.
- [x] Adicionar modal de edição no grupo de nodes.
- [x] Armazenar edição das edges no histórico.
- [x] Adicionar alertas de erro.
- [x] Só pode adicionar phases e controle de lógica dentro de uma unity.
- [x] Ajustar Z-index das edges.

- [x] Fazer documentação.

- [x] Integração com o mes3.

- [x] Fazer manual de uso do fluxograma.

Doing:


Done: 
- [V] bloquear todos os cantos menos o inferior direito.
- [V] Ajustar node tipo text para que possa ser escrito.

Impossivel: 
- [x] Armazenar o historico de uma label de todos os nodes.
- [x] Armazenar tipo do controle de logica no historico.

*/
