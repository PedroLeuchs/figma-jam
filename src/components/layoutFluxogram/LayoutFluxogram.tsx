import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  ConnectionMode,
  useEdgesState,
  Connection,
  addEdge,
  useNodesState,
  Edge,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { useDnD } from '../sideBar/DndContext';
import '@xyflow/react/dist/style.css';

// nodes
import { zinc } from 'tailwindcss/colors';
import { Square } from '../nodes/Square';
import { Triangle } from '../nodes/Triangle';
import { Circle } from '../nodes/Circle';
import { Group } from '../nodes/Group';
import LogicControl from '../nodes/LogicControl';

// components
import DefaultEdge from '../edges/DefaultEdge';
import SideBar from '../sideBar/SideBar';

// arrays
import { EQUIPAMENT } from '../../services/Equipament';
import { MACHINES } from '../../services/Machines';
import { VALUESSIDEBAR } from '../../services/ValuesSideBar';

const NODE_TYPES = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
  logicControl: LogicControl,
  group1: Group,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const LOGIC_CONTROLS = [
  { id: '1', label: 'AND' },
  { id: '2', label: 'OR' },
];

// Função para gerar IDs incrementais
let nodeId = 1;
const getId = () => `${nodeId++}`;

// Criar 5 quadrados interligados
const INITIAL_NODES: Node[] = [
  {
    id: getId(),
    type: 'triangle',
    position: { x: 700, y: 10 },
    data: { label: 'Start', color: 'bg-gray-500', direction: false },
  },
  {
    id: getId(),
    type: 'circle',
    position: { x: 699, y: 150 },
    data: { label: MACHINES[0].label, machine: MACHINES },
  },
  {
    id: 'groupA',
    type: 'group1',
    position: { x: 500, y: 300 },
    data: { label: 'Group 1' },
    style: { width: 500, height: 450 },
  },
  {
    id: getId(),
    type: 'square',
    position: { x: 150, y: 50 },
    data: { label: EQUIPAMENT[0].label, ingredients: EQUIPAMENT },
    parentId: 'groupA',
  },
  {
    id: getId(),
    type: 'square',
    position: { x: 40, y: 300 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
    parentId: 'groupA',
  },
  {
    id: getId(),
    type: 'square',
    position: { x: 260, y: 300 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
    parentId: 'groupA',
  },
  {
    id: getId(),
    type: 'square',
    position: { x: 650, y: 800 },
    data: { label: EQUIPAMENT[10].label, machine: MACHINES },
  },
  {
    id: getId(),
    type: 'circle',
    position: { x: 1300, y: 200 },
    data: { label: MACHINES[1].label, machine: MACHINES },
  },
  {
    id: getId(),
    type: 'triangle',
    position: { x: 1300, y: 350 },
    data: { label: 'End', direction: true },
  },
  {
    id: getId(),
    type: 'logicControl',
    position: { x: 200, y: 200 },
    data: { typeControls: LOGIC_CONTROLS },
    parentId: 'groupA',
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e3-9',
    source: '3',
    animated: true,
    target: '9',
    sourceHandle: 'bottom',
    targetHandle: 'a',
    type: 'default',
    selected: false,
  },
  {
    id: 'e3-9',
    source: '3',
    animated: true,
    target: '9',
    sourceHandle: 'bottom',
    targetHandle: 'bTop',
    type: 'default',
    selected: false,
  },
  {
    id: 'e9-4',
    source: '9',
    animated: true,
    target: '4',
    sourceHandle: 'aBottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e9-5',
    source: '9',
    animated: true,
    target: '5',
    sourceHandle: 'cBottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  ///////////////////////////////////
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  // { id: 'e1-3', source: '1', target: '3' },
  // { id: 'e2a-4a', source: '2a', target: '4a' },
  // { id: 'e3-4b', source: '3', target: '4b' },
  // { id: 'e4a-4b1', source: '4a', target: '4b1' },
  // { id: 'e4a-4b2', source: '4a', target: '4b2' },
  // { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];

export function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES); // Arestas iniciais
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES); // Nós iniciais
  const [type, setType] = useDnD();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (
        (sourceNode?.type === 'square' && targetNode?.type === 'circle') ||
        (sourceNode?.type === 'circle' && targetNode?.type === 'square')
      ) {
        setEdges((edges) => addEdge(connection, edges));
      } else {
        setEdges((edges) => addEdge(connection, edges));
      }
    },
    [nodes, setEdges]
  );

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => {
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

        // zoom : 0.5 = (cx - rx - 25) * 2
        // zoom : 1 = (cx - rx - 50) * 1
        // zoom : 2 = (cx - rx - 100) * 0.5
        //
      });

      let newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: type === 'circle' ? 'Novo Silo' : 'Novo Equipamento',
          ingredients: type === 'circle' ? null : EQUIPAMENT,
          machine: type === 'circle' ? MACHINES : null,
        },
        style: {},
      };
      if (type === 'group1') {
        newNode = {
          ...newNode,
          style: { width: 500, height: 300 },
        };
      }
      console.log(newNode);

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes]
  );

  return (
    // <div className="w-[85vw] h-[80vh] relative right-0 dndflow">
    <div className="w-screen h-screen relative right-0 dndflow">
      {/* <div className="w-screen h-screen dndflow"> */}
      {/* <DnDProvider> */}
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{ type: 'default' }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            size={2}
            gap={30}
            color={zinc[100]}
          />
          <Controls />
        </ReactFlow>
      </div>
      {/* </DnDProvider> */}

      <SideBar
        edges={edges}
        setEdges={setEdges}
        ingredients={VALUESSIDEBAR}
        onDragStart={onDragStart}
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
 */

/**
 *To-Do:
 * criar grupos
 * arrumar componente de logica
 * exibir receita em uma faze de execução
 *
 */
