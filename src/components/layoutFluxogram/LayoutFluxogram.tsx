import { useCallback, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, Node, ConnectionMode, useEdgesState, Connection, addEdge, useNodesState, Edge } from '@xyflow/react';
import { DnDProvider, useDnD } from '../sideBar/DndContext';
import { BackgroundVariant } from 'reactflow';
import '@xyflow/react/dist/style.css';
import { zinc } from 'tailwindcss/colors';
import { Square } from '../nodes/Square';
import { Triangle } from '../nodes/Triangle';
import { Circle } from '../nodes/Circle';
import DefaultEdge from '../edges/DefaultEdge';
import SideBar from '../sideBar/SideBar';

const NODE_TYPES = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const EQUIPAMENT = [
  { id: '1', label: 'BALANÇA' },
  { id: '2', label: 'FORNO' },
  { id: '3', label: 'MISTURADOR' },
  { id: '4', label: 'ESTEIRA TRANSPORTADORA' },
  { id: '5', label: 'MOINHO' },
  { id: '6', label: 'DOSADOR' },
  { id: '7', label: 'TANQUE DE MISTURA' },
  { id: '8', label: 'BOMBA DE CALOR' },
  { id: '9', label: 'CENTRIFUGA' },
  { id: '10', label: 'FILTRO PRENSA' },
  { id: '11', label: 'SECADOR' },
  { id: '12', label: 'GRANULADOR' },
  { id: '13', label: 'EMBALADEIRA' },
  { id: '14', label: 'PALETIZADORA' },
  { id: '15', label: 'SISTEMA DE REFRIGERAÇÃO' },
  { id: '16', label: 'CALDEIRA' },
  { id: '17', label: 'COMPRESSOR DE AR' },
  { id: '18', label: 'VENTILADOR' },
  { id: '19', label: 'EXAUSTOR' },
  { id: '20', label: 'SISTEMA DE CONTROLE' },
  { id: '21', label: 'SENSOR DE TEMPERATURA' },
  { id: '22', label: 'SENSOR DE PRESSÃO' },
  { id: '23', label: 'SENSOR DE NÍVEL' },
  { id: '24', label: 'VÁLVULA DE CONTROLE' },
  { id: '25', label: 'ATUADOR PNEUMÁTICO' },
  { id: '26', label: 'MOTOR ELÉTRICO' },
  { id: '27', label: 'REDUTOR DE VELOCIDADE' },
  { id: '28', label: 'ACOPLAMENTO' },
  { id: '29', label: 'CORREIA DE TRANSMISSÃO' },
  { id: '30', label: 'CORRENTE DE TRANSMISSÃO' },
  { id: '31', label: 'ROLAMENTO' },
  { id: '32', label: 'MANCAL' },
  { id: '33', label: 'VEDAÇÃO' },
  { id: '34', label: 'LUBRIFICADOR' },
  { id: '35', label: 'INSTRUMENTO DE MEDIÇÃO' },
  { id: '36', label: 'FERRAMENTA DE MANUTENÇÃO' },
  { id: '37', label: 'EPI - Equipamento de Proteção Individual' },
  { id: '38', label: 'EPC - Equipamento de Proteção Coletiva' },
  { id: '39', label: 'SOFTWARE DE GESTÃO' },
  { id: '40', label: 'SISTEMA DE SEGURANÇA' },
  { id: '41', label: 'ALARME' },
  { id: '42', label: 'DETECTOR DE FUMAÇA' },
  { id: '43', label: 'EXTINTOR DE INCÊNDIO' },
  { id: '44', label: 'PLACA DE SINALIZAÇÃO' },
  { id: '45', label: 'FITA DE DEMARCAÇÃO' },
  { id: '46', label: 'CADEADO DE SEGURANÇA' },
  { id: '47', label: 'GUARDA-CORPO' },
  { id: '48', label: 'PLATAFORMA DE ACESSO' },
  { id: '49', label: 'ESCADARIA' },
  { id: '50', label: 'CORRIMÃO' },
  { id: '51', label: 'ELEVADOR DE CARGA' },
  { id: '52', label: 'GUINDASTE' },
  { id: '53', label: 'TALHA' },
];

const MACHINES = [
  { id: '1', label: 'SILO - 1' },
  { id: '2', label: 'SILO - 2' },
  { id: '3', label: 'SILO - 3' },
  { id: '4', label: 'SILO - 4' },
  { id: '5', label: 'SILO - 5' },
  { id: '6', label: 'SILO - 6' },
  { id: '7', label: 'SILO - 7' },
  { id: '8', label: 'SILO - 8' },
  { id: '9', label: 'SILO - 9' },
  { id: '10', label: 'SILO - 10' },
  { id: '11', label: 'SILO - 11' },
  { id: '12', label: 'SILO - 12' },
  { id: '13', label: 'SILO - 13' },
  { id: '14', label: 'SILO - 14' },
  { id: '15', label: 'SILO - 15' },
  { id: '16', label: 'SILO - 16' },
  { id: '17', label: 'SILO - 17' },
  { id: '18', label: 'SILO - 18' },
  { id: '19', label: 'SILO - 19' },
  { id: '20', label: 'SILO - 20' },
  { id: '21', label: 'SILO - 21' },
  { id: '22', label: 'SILO - 22' },
  { id: '23', label: 'SILO - 23' },
  { id: '24', label: 'SILO - 24' },
  { id: '25', label: 'SILO - 25' },
  { id: '26', label: 'SILO - 26' },
  { id: '27', label: 'SILO - 27' },
  { id: '28', label: 'SILO - 28' },
  { id: '29', label: 'SILO - 29' },
  { id: '30', label: 'SILO - 30' },
  { id: '31', label: 'SILO - 31' },
  { id: '32', label: 'SILO - 32' },
  { id: '33', label: 'SILO - 33' },
  { id: '34', label: 'SILO - 34' },
  { id: '35', label: 'SILO - 35' },
  { id: '36', label: 'SILO - 36' },
  { id: '37', label: 'SILO - 37' },
  { id: '38', label: 'SILO - 38' },
  { id: '39', label: 'SILO - 39' },
  { id: '40', label: 'SILO - 40' },
  { id: '41', label: 'SILO - 41' },
  { id: '42', label: 'SILO - 42' },
  { id: '43', label: 'SILO - 43' },
  { id: '44', label: 'SILO - 44' },
  { id: '45', label: 'SILO - 45' },
  { id: '46', label: 'SILO - 46' },
  { id: '47', label: 'SILO - 47' },
  { id: '48', label: 'SILO - 48' },
  { id: '49', label: 'SILO - 49' },
  { id: '50', label: 'SILO - 50' },
  { id: '51', label: 'SILO - 51' },
  { id: '52', label: 'SILO - 52' },
  { id: '53', label: 'SILO - 53' },
  { id: '54', label: 'SILO - 54' },
  { id: '55', label: 'SILO - 55' },
  { id: '56', label: 'SILO - 56' },
  { id: '57', label: 'SILO - 57' },
  { id: '58', label: 'SILO - 58' },
  { id: '59', label: 'SILO - 59' },
  { id: '60', label: 'SILO - 60' },
];

const VALUESSIDEBAR = [
  { id: '1', label: 'Equipamento', type: 'square' },
  { id: '2', label: 'Silos', type: 'circle' },
  { id: '3', label: 'Start/End', type: 'triangle' },
];

// Função para gerar IDs incrementais
let nodeId = 1;
const getId = () => `${nodeId++}`;

// Criar 5 quadrados interligados
const INITIAL_NODES: Node[] = [
  { id: getId(), type: 'triangle', position: { x: 700, y: 50 }, data: { label: 'Start', color: 'bg-gray-500', direction: 'down' } },
  { id: getId(), type: 'circle', position: { x: 699, y: 200 }, data: { label: MACHINES[0].label, machine: MACHINES } },
  { id: getId(), type: 'square', position: { x: 650, y: 350 }, data: { label: EQUIPAMENT[0].label, ingredients: EQUIPAMENT } },
  { id: getId(), type: 'square', position: { x: 525, y: 500 }, data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT } },
  { id: getId(), type: 'square', position: { x: 775, y: 500 }, data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT } },
  { id: getId(), type: 'square', position: { x: 650, y: 650 }, data: { label: EQUIPAMENT[10].label, machine: MACHINES } },
  { id: getId(), type: 'circle', position: { x: 1200, y: 200 }, data: { label: MACHINES[1].label, machine: MACHINES } },
  { id: getId(), type: 'triangle', position: { x: 1200, y: 350 }, data: { label: 'End', direction: 'up' } },
  
];

const INITIAL_EDGES: Edge[] = [
  
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e3-4', source: '3', animated: true, target: '4', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e3-5', source: '3', animated: true, target: '5', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e6-7', source: '6', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  { id: 'e7-8', source: '7', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'default', selected: false },
  
];

function LayoutFluxogram() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES); // Arestas iniciais
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES); // Nós iniciais
  const [type, setType] = useDnD();
  const [zoomScreen, setZoomScreen] = useState(1);

  const onConnect = useCallback((connection: Connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (sourceNode?.type === 'square' && targetNode?.type === 'circle' || sourceNode?.type === 'circle' && targetNode?.type === 'square') {
      setEdges((edges) => addEdge(connection, edges));
    }
    else{
      setEdges((edges) => addEdge(connection, edges));
    }
  }, [nodes, setEdges]);

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType); 
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const removeMarcaDagua = () => {
    const reactIconFlow = document.getElementsByClassName('react-flow__panel react-flow__attribution bottom right');
    if(reactIconFlow.length > 0){
      reactIconFlow[0].classList.add('hidden');
    }
  }

  removeMarcaDagua();

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow'); 

    if (!type || !reactFlowBounds) return;
    
    const rightPosition = 50 * zoomScreen
    const multipleCount = 1 / zoomScreen;

    const position = {
        x: (event.clientX - reactFlowBounds.x - rightPosition) * multipleCount  ,
        y: (event.clientY -  reactFlowBounds.y -rightPosition) * multipleCount  ,


        // zoom : 0.5 = (cx - rx - 25) * 2 
        // zoom : 1 = (cx - rx - 50) * 1 
        // zoom : 2 = (cx - rx - 100) * 0.5 
        // 


    };
    
  
    const newNode = {
        id: getId(),
        type,
        position,
        data: { label: type === 'circle' ? 'Novo Silo' : 'Novo Equipamento',  ingredients: type === 'circle' ? null : EQUIPAMENT, machine: type === 'circle' ? MACHINES : null  },
    };
    
    setNodes((nds) => nds.concat(newNode));
}, [setNodes, zoomScreen]);


  return (
    // <div className="w-[80vw] h-[80vh]">
    <div className="w-screen h-screen">
      <DnDProvider>
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
            defaultViewport={{x: 0, y: 0, zoom: zoomScreen}}
            onMove={(event, transform) => {
                setZoomScreen(transform.zoom)
              }}
          >
            <Background variant={BackgroundVariant.Lines} size={2} gap={30} color={zinc[100]} />
            <Controls  />
          </ReactFlow>
        </div>
      </DnDProvider>

      <SideBar edges={edges} setEdges={setEdges} ingredients={VALUESSIDEBAR} onDragStart={onDragStart} />
    </div>
  );
}

export default LayoutFluxogram;



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
 * Adicionar funcionalidades do modal no circulo
 * Criar componente para inicio e fim de um fluxograma
 * ideia de um componente para ligações paralelas 
 * dia 09/10 começar a fazer a criação de uma receita 
 * exibir receita em uma faze de execução
 * 
 * 
 */