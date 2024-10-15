import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Node,
  ConnectionMode,
  useEdgesState,
  Connection,
  addEdge,
  useNodesState,
  Edge,
  BackgroundVariant,
  useReactFlow,
  Panel,
  MiniMap,
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
import Phase from '../nodes/Phase';

// components
import DefaultEdge from '../edges/DefaultEdge';
import SideBar from '../sideBar/SideBar';

// arrays
import { EQUIPAMENT } from '../../services/Equipament';
import { MACHINES } from '../../services/Machines';
import { VALUESSIDEBAR } from '../../services/ValuesSideBar';
import { UNITYPHASES } from '../../services/Unitys';

//icons
import { MdOutlineZoomInMap } from 'react-icons/md';
import { MdOutlineZoomIn } from 'react-icons/md';
import { MdOutlineZoomOut } from 'react-icons/md';

const NODE_TYPES = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
  logicControl: LogicControl,
  unity: Group,
  phase: Phase,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const LOGIC_CONTROLS = [
  { id: '1', label: 'AND' },
  { id: '2', label: 'OR' },
];

const GROUPIDS: string[] = [];

// Função para gerar IDs incrementais
let nodeId = 1;
const getId = (type?: string) => {
  const id = nodeId++;

  if (type === 'unity') {
    GROUPIDS.push(id.toString()); // Adiciona o ID ao array GROUPIDS se for do tipo 'unity'
  }
  return id;
};

// type CustomNode = Node & {
//   isConnectable?: boolean;
//   positionAbsoluteX?: number;
//   positionAbsoluteY?: number;
//   type: string;
// };

// Criar 5 quadrados interligados
const INITIAL_NODES: Node[] = [
  {
    id: getId().toString(),
    type: 'triangle',
    position: { x: 700, y: 10 },
    data: { label: 'Start', color: 'bg-gray-500', direction: false },
  },
  {
    id: getId().toString(),
    type: 'circle',
    position: { x: 699, y: 150 },
    data: { label: MACHINES[0].label, machine: MACHINES },
  },
  {
    id: getId('unity').toString(),
    type: 'unity',
    position: { x: 500, y: 300 },
    data: { label: UNITYPHASES[1].Unidade, unitphases: UNITYPHASES },
    style: { width: 500, height: 450 },
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 525, y: 600 },
    data: { label: EQUIPAMENT[0].label, ingredients: EQUIPAMENT },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 775, y: 600 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 650, y: 750 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 650, y: 800 },
    data: { label: EQUIPAMENT[10].label, machine: MACHINES },
  },
  {
    id: getId().toString(),
    type: 'circle',
    position: { x: 1300, y: 200 },
    data: { label: MACHINES[1].label, machine: MACHINES },
  },
  {
    id: getId().toString(),
    type: 'triangle',
    position: { x: 1300, y: 350 },
    data: { label: 'End', direction: true },
  },
  {
    id: getId().toString(),
    type: 'logicControl',
    position: { x: 700, y: 525 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
  },
  // {
  //   id: getId().toString(),
  //   type: 'square',
  //   position: { x: -2000, y: -2000 },
  //   data: { typeControls: LOGIC_CONTROLS },
  //   //aqui
  // },
  // {
  //   id: getId().toString(),
  //   type: 'square',
  //   position: { x: 1500, y: 1500 },
  //   data: { typeControls: LOGIC_CONTROLS },
  //   //aqui
  // },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: -2000, y: 0 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 2000, y: 0 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 0, y: -2000 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 3000, y: 2000 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
  },
  {
    id: getId().toString(),
    type: 'square',
    position: { x: 3000, y: -2000 },
    data: { typeControls: LOGIC_CONTROLS },
    //aqui
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
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
];

export function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES); // Arestas iniciais
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES); // Nós iniciais
  const [type, setType] = useDnD();
  const { screenToFlowPosition } = useReactFlow();
  const [selectedUnityId, setSelectedUnityId] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>(''); // Estado para a nova label
  const { setViewport, zoomIn, zoomOut } = useReactFlow();

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

  const verifyHasNodeOnUnity = (nodes: Node[]) => {
    nodes.forEach((node) => {
      // Verifica se o nó é do tipo "unity"
      const isUnity = GROUPIDS.includes(node.id); // Verifique se o nó é uma unity

      if (isUnity) {
        const { position, style } = node; // Acesse as propriedades do nó
        const { x, y } = position; // Coordenadas do nó
        const { width, height } = style as { width: number; height: number }; // Estilos de largura e altura

        // Verifique se existem nós dentro das coordenadas da unity
        const nodesInUnity = nodes.filter((otherNode) => {
          const otherX = otherNode.position.x;
          const otherY = otherNode.position.y;

          // Ignore se o id do nó for igual ao id da unity
          if (otherNode.id === node.id) return false;

          return (
            otherX >= x &&
            otherX <= x + width &&
            otherY >= y &&
            otherY <= y + height
          );
        });

        if (nodesInUnity.length > 0) {
          // Aplique o parentId da unity aos nós encontrados
          nodesInUnity.forEach((foundNode) => {
            foundNode.parentId = node.id || ''; // Atribui o parentId da unity ao nó
            foundNode.position.x = foundNode.position.x - width;
            foundNode.position.y = foundNode.position.y - height;
          });
        }
      }
    });
  };

  useEffect(() => {
    // Chama a função apenas uma vez quando o componente é montado
    verifyHasNodeOnUnity(nodes);
  }, [nodes]);

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
              : 'Nova Fase',
          ingredients: type === 'square' ? EQUIPAMENT : null,
          machine: type === 'circle' ? MACHINES : null,
          unitphases: type === 'unity' ? UNITYPHASES : null,
        },
        parentId: '',
        style: {},
      };

      // Garantir que "ingredients", "machine" e "unitphases" estejam sempre presentes
      if (type !== 'square') {
        newNode.data.ingredients = null; // Definir como null se não for do tipo "square"
      }

      if (type !== 'circle') {
        newNode.data.machine = null; // Definir como null se não for do tipo "circle"
      }

      if (type !== 'unity') {
        newNode.data.unitphases = null; // Definir como null se não for do tipo "unity"
      }

      // Adicionar estilos personalizados se o tipo for 'unity'
      if (type === 'unity') {
        newNode = {
          ...newNode,
          style: { width: Number(500), height: Number(300) },
        };
      }

      // Verificar se o novo nó está dentro de um grupo
      if (type !== 'unity') {
        const parentGroup = nodes.find(
          (node) =>
            node.type === 'unity' &&
            position.x > node.position.x &&
            position.x <
              node.position.x +
                (typeof node.style?.width === 'number'
                  ? node.style.width
                  : 0) &&
            position.y > node.position.y &&
            position.y <
              node.position.y +
                (typeof node.style?.height === 'number' ? node.style.height : 0)
        );

        if (type === 'phase') {
          if (!parentGroup) {
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
            },
          };
        } else if (parentGroup) {
          newNode = {
            ...newNode,
            id: getId().toString(),
            parentId: parentGroup.id,
          };
        }
      }
      console.log(newNode);

      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    [screenToFlowPosition, type, setNodes, nodes, newLabel]
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

    // Calculando o zoom com base no menor valor entre zoomX e zoomY
    let zoom = Math.min(zoomX, zoomY) * 0.9;

    // Limitando o zoom para evitar valores menores que 0.08
    if (zoom < 0.08) {
      zoom = 0.08;
    } else {
      zoom *= 0.98;
    }

    // Calculando o fator de ajuste para x e y dinamicamente
    // const factorX = viewportWidth / (maxX - minX);
    const factorX = (viewportHeight + viewportWidth) / (maxX - minX) / 3.5;
    const factorY = (viewportHeight + viewportWidth) / (maxY - minY) / 3.5;
    // * 0.08
    // Ajuste dinâmico para x e y com base nos fatores calculados
    const xAdjusted = (centerX - viewportWidth / 2 / zoom) * -1 * factorX;
    const yAdjusted = (centerY - viewportHeight / 2 / zoom) * -1 * factorY;

    console.log('factorX: ', factorX);
    console.log('factorY: ', factorY);
    console.log('View width: ', viewportWidth);
    console.log('View height: ', viewportHeight);
    console.log('minX: ', minX);
    console.log('minY: ', minY);
    console.log('maxX: ', maxX);
    console.log('maxY: ', maxY);
    console.log('centerX: ', centerX);
    console.log('centerY: ', centerY);
    console.log('x: ', xAdjusted);
    console.log('y: ', yAdjusted);
    console.log('zoom: ', zoom);

    return {
      x: xAdjusted,
      y: yAdjusted,
      zoom,
    };
  };

  /*
  teste 1: 

    fator: * 0.23
    View width:  1513
    View height:  911
    minX:  -2000
    minY:  -2000
    maxX:  1500
    maxY:  1500
    centerX:  -250
    centerY:  -250
    x:  1532.566327152888
    y:  581.5113378684807
    zoom:  0.229572

    tenho que chegar: x: 750, y: 500, zoom: 0.23 
    
    
    teste 2:
    
    fator: * 0.08
    View width:  1513
    View height:  911
    minX:  -5000
    minY:  -5000
    maxX:  5000
    maxY:  5000
    centerX:  0
    centerY:  0
    x:  1424.4948985814594
    y:  516.439909297052
    zoom:  0.08035020000000001

    tenho que chegar: x: 750, y: 450, zoom: 0.08 
*/

  // setViewport({ x: 750, y: 450, zoom: 0.08 });
  return (
    // <div className="w-[85vw] h-[80vh] relative right-0 dndflow">
    <div className="w-screen h-screen relative right-0 dndflow">
      {/* <div className="w-screen h-screen dndflow"> */}
      {/* <DnDProvider> */}
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          // editNodeId={editNodeId}
          onNodeClick={onNodeClick}
          onPaneClick={onNodeClick}
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
          <Panel
            position="bottom-left"
            className="flex flex-col items-center justify-center p-1 gap-1 bg-gray-200 rounded border border-black"
          >
            <button
              className="p-2 border border-gray-400 rounded bg-gray-100 hover:bg-white hover:scale-110 transition-all"
              onClick={() => zoomIn({ duration: 800 })}
            >
              <MdOutlineZoomIn className="text-xl w-full h-full scale-125" />
            </button>
            <button
              className="p-2 border border-gray-400 rounded bg-gray-100 hover:bg-white hover:scale-110 transition-all"
              onClick={() => zoomOut({ duration: 800 })}
            >
              <MdOutlineZoomOut className="text-xl" />
            </button>
            <button
              className="p-2 border border-gray-400 rounded bg-gray-100 hover:bg-white hover:scale-110 transition-all"
              onClick={() =>
                setViewport(
                  lookAllElements(nodes, viewportWidth, viewportHeight),
                  { duration: 800 }
                )
              }
            >
              <MdOutlineZoomInMap className="text-xl" />
            </button>
          </Panel>
          {/* <Controls
            onZoomIn={() => zoomIn({ duration: 800 })}
            onZoomOut={() => zoomOut({ duration: 800 })}
            onFitView={handleTransform}
          /> */}
          <MiniMap
            zoomable
            pannable
            style={{ backgroundColor: zinc[600], borderRadius: 10 }}
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
 * arruma o zomm principal
 * adicionar cadeado para não editar
 * arrumar a posição
 * não arrastar fase para fora da outra
 * bug da unity
 * passar pela logica de controle quando tiver duas ligações (apenas phases)
 *
 */
