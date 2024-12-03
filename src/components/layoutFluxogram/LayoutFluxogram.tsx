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
import { INITIAL_NODES, getId, NODE_TYPES } from '../../services/InicialNodes';
import { EDGE_TYPES, INITIAL_EDGES } from '../../services/inicialEdges';

import BackAndNext from '../sideBar/BackAndNext';
import { CiDark, CiLight } from 'react-icons/ci';
import { IoSettingsOutline } from 'react-icons/io5';

import { useHistoryState } from '@uidotdev/usehooks';
import { debounce } from '@mui/material';
import ZoomControl from '../sideBar/ZoomControl';
import ModalEditEdges from '../modal/ModalEditEdges';
import { ModalCircle } from '../modal/ModalNodes/ModalCircle';
import { ModalSquare } from '../modal/ModalNodes/ModalSquare';
import { ModalUnity } from '../modal/ModalNodes/ModalUnity';
import { ModalPhase } from '../modal/ModalNodes/ModalPhase';
import { ModalSeparator } from '../modal/ModalNodes/ModalSeparator';
import { ModalEditLabel } from '../modal/ModalNodes/ModalEditLabel';

export function DnDFlow() {
  //nodes and edges
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

  const { screenToFlowPosition } = useReactFlow();
  const { getIntersectingNodes } = useReactFlow();
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  //alerts
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');

  const [isResizing, setIsResizing] = useState(false);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  //nodes
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState<string | null>(
    null
  );
  const [selectedUnityId, setSelectedUnityId] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [type, setType] = useDnD();
  const [nodeEditing, setNodeEditing] = useState<Node | null>(null);
  const [countTriangle, setCountTriangle] = useState(
    nodes.filter((node) => node.type === 'triangle').length
  );

  //modal
  const [watingNode, setWatingNode] = useState(false);
  const [modalCircle, setModalCircle] = useState(false);
  const [modalPhase, setModalPhase] = useState(false);
  const [modalSquare, setModalSquare] = useState(false);
  const [modalSeparator, setModalSeparator] = useState(false);
  const [modalUnity, setModalUnity] = useState(false);
  const [modalLabel, setModalLabel] = useState(false);
  const [modalEdgeOpen, setmodalEdgeOpen] = useState(false);

  const handleWaitingClickOnNode = () => {
    onShowAlert('Clique no nó que deseja editar.', 'info');
    setWatingNode(true);
  };

  const openModalEditNode = useCallback(
    (node: Node) => {
      setNodeEditing(node);

      const nodeType = node.type;

      if (nodeType === 'circle') {
        setModalCircle(true);
      }
      if (nodeType === 'square') {
        setModalSquare(true);
      }
      if (nodeType === 'phase') {
        setModalPhase(true);
      }
      if (nodeType === 'unity') {
        setModalUnity(true);
      }
      if (nodeType === 'label') {
        setModalLabel(true);
      }
      if (nodeType === 'separator') {
        setModalSeparator(true);
      }

      setWatingNode(false);
    },
    [setWatingNode, setNodeEditing, setModalCircle] // Dependências
  );

  const handleNodeSelect = (nodeType: string, label?: string) => {
    onShowAlert(
      `${label} Selecionado. Clique na tela para adicionar o nó.`,
      'info'
    );

    setSelectedNodeType(nodeType);
    setSelectedNodeLabel(label || 'Novo Nó');
  };

  const handleClickOnTheNodeOnMobile = useCallback(
    (nodeType: string, label?: string, parentId?: string) => {
      if (nodeType === 'phase' || nodeType === 'logicControl') {
        const newNode: Node = {
          id: getId().toString(),
          type: nodeType,
          parentId: parentId,
          measured: {
            width: nodeType === 'phase' ? 200 : 50,
            height: 50,
          },
          position: { x: 0, y: 0 },
          data: {
            label: label ? label : '',
            unitphases: nodeType === 'phase' ? UNITYPHASES : null,
            operatorSelected: nodeType === 'logicControl' ? 'AND' : null,
          },
          style: {},
          extent: 'parent',
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        set({
          ...state,
          nodesHistoryState: [...state.nodesHistoryState, newNode],
        });
        setSelectedNodeType(null);
        setSelectedNodeLabel(null);
      } else {
        return;
      }
    },
    [setNodes, state, set]
  );

  const handleClickOnWorkspace = (event: React.MouseEvent) => {
    if (!selectedNodeType) return;

    setCountTriangle(nodes.filter((node) => node.type === 'triangle').length);

    // Se já houverem dois triângulos, exibe alerta e retorna
    if (countTriangle >= 2 && selectedNodeType === 'triangle') {
      onShowAlert('Você só pode adicionar no máximo dois triângulos.', 'error');
      setSelectedNodeType(null);
      setSelectedNodeLabel(null);
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    if (selectedNodeType === 'unity') {
      const unityNode: Node = {
        id: getId('unity').toString(),
        type: 'unity',
        position,
        data: { label: UNITYPHASES[0].Unidade, unitphases: UNITYPHASES },
        style: { width: 500, height: 500 },
        measured: { width: 500, height: 500 },
      };

      set({
        ...state,
        nodesHistoryState: [...state.nodesHistoryState, unityNode],
      });

      onShowAlert(
        `${UNITYPHASES[0].Unidade} Adicionado com sucesso.`,
        'success'
      );
      setSelectedNodeType(null);
      setSelectedNodeLabel(null);
      return;
    } else {
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
    }
  };

  const onNodeClick = useCallback(
    (_?: React.MouseEvent, node?: Node) => {
      if (node === undefined) {
        setSelectedUnityId('');
        return;
      }
      if (watingNode == true) {
        openModalEditNode(node);
      }

      if (node.type === 'unity') {
        setSelectedUnityId(node.id);
        if (selectedNodeLabel !== null && selectedNodeType !== null) {
          const parentId = node.id;
          handleClickOnTheNodeOnMobile(
            selectedNodeType,
            selectedNodeLabel,
            parentId
          );
        }
      } else {
        setSelectedUnityId('');
      }
    },
    [
      selectedNodeLabel,
      selectedNodeType,
      handleClickOnTheNodeOnMobile,
      openModalEditNode,
      watingNode,
    ]
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
      setCountTriangle(nodes.filter((node) => node.type === 'triangle').length);

      // Se já houverem dois triângulos, exibe alerta e retorna
      if (countTriangle >= 2 && type === 'triangle') {
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
          dragHandle: '.drag-handle__custom',
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
            dragHandle: '.drag-handle__custom',
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
            dragHandle: '.drag-handle__custom',
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
            dragHandle: '.drag-handle__custom',
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
    [
      screenToFlowPosition,
      type,
      setNodes,
      nodes,
      newLabel,
      state,
      set,
      countTriangle,
    ]
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

  const onToggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

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

  return (
    <div className="w-screen h-screen relative right-0 dndflow">
      {/* <div className="w-screen h-screen dndflow"> */}
      {/* <DnDProvider> */}
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          panOnScroll={false}
          panOnDrag={true}
          zoomOnPinch={true}
          onPaneClick={handleClickOnWorkspace}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodes={nodes}
          edges={edges}
          onEdgeClick={() => setmodalEdgeOpen(!modalEdgeOpen)}
          onNodeClick={onNodeClick}
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

          <div className=" lg:flex md:hidden sm:hidden hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: viewportWidth / 9.5,
                height: viewportHeight / 7,
              }}
            />
          </div>
          <div className=" lg:hidden md:flex sm:hidden hidden ">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                top: 1,
                left: 1,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: viewportWidth / 11,
                height: viewportHeight / 14,
              }}
            />
          </div>
          <div className=" lg:hidden md:hidden sm:flex  ">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                top: 1,
                left: 1,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: viewportWidth / 5.5,
                height: viewportHeight / 10,
              }}
            />
          </div>
        </ReactFlow>
      </div>

      <SideBar
        nodes={nodes}
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
          colorMode == 'light' ? 'hover:rotate-180' : 'hover:-scale-x-100'
        }`}
      >
        {colorMode == 'light' ? (
          <CiLight className="text-3xl text-black " />
        ) : (
          <CiDark className="text-3xl text-white" />
        )}
      </div>
      <div
        onClick={handleWaitingClickOnNode}
        className="bg-gray-100 cursor-pointer border-gray-400 border dark:bg-zinc-700 dark:border-zinc-600 fixed top-2 2xl:right-[350px] xl:right-64 lg:right-56 right-16 rounded-full flex items-center justify-center p-2 hover:rotate-180 transition-all duration-300"
      >
        <IoSettingsOutline className="text-3xl text-black" />
      </div>
      <ModalEditEdges
        edges={edges}
        state={state}
        set={set}
        setEdges={setEdges}
        modalEdgeOpen={modalEdgeOpen}
        setmodalEdgeOpen={setmodalEdgeOpen}
      />
      <ModalCircle
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalCircle={modalCircle}
        setModalCircle={setModalCircle}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      <ModalPhase
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalPhase={modalPhase}
        setModalPhase={setModalPhase}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      <ModalSquare
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalSquare={modalSquare}
        setModalSquare={setModalSquare}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      <ModalSeparator
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalSeparator={modalSeparator}
        setModalSeparator={setModalSeparator}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      <ModalUnity
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalUnity={modalUnity}
        setModalUnity={setModalUnity}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      <ModalEditLabel
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalLabel={modalLabel}
        setModalLabel={setModalLabel}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
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
 * 
 * 
 * Anotarion:
 * 
 *To-Do:
 - [x] Ajustar enquadramento do zoom.
 - [x] Fazer documentação.
 - [x] Integração com o mes3.
 - [x] Fazer manual de uso do fluxograma.
 
 *Not Important now:
 - [x] Ajustar controle de logica quando solto em uma unity de fora pra dentro.
 
 
 *Doing:
 - [-] Icone que permite arrastar os nodes.
 
 
 
 - [x] Mobile.
 
 
 *Done: 
 
 - [V] Conseguir apagar os nodes pelo botão de delete.
 - [V] Fazer Modal Square .
 - [V] Fazer Modal Circle.
 - [V] Fazer Modal Unity.
 - [v] Fazer Modal Separator.
 - [V] Fazer Modal Label.
 - [V] Fazer Modal Phase.
 - [V] Conseguir apagar as edges pelo botão de delete.
 - [V] Ajustar edges pelo mobile.
 - [V] Edição das labels(negrito, sublinhado, tamanho, itálico, cor).
 - [V] Ajustar para não deixar adicionar mais de dois triangulos pelo mobile.
 - [V] Ajustar cor da edge tipo arrow
 - [V] Ajustar a controle de lógica para que possa ser arrastado para fora de unitys também.
 - [V] se não ter nenhum triangulo o primeiro é start e o segundo é end .
 - [V] Ajustar add unity pelo mobile.
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
