import { useEffect, useRef, useState } from 'react';

//reactFlow
import {
  ReactFlow,
  Background,
  Node,
  ConnectionMode,
  useEdgesState,
  useNodesState,
  BackgroundVariant,
  useReactFlow,
  MiniMap,
  ColorMode,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

//tailwind color
import { zinc } from 'tailwindcss/colors';

//components
import SideBar from '../sideBar/SideBar';
import AlertComponent from '../alert/AlertComponent';
import BackAndNext from '../sideBar/BackAndNext';
import ZoomControl from '../sideBar/ZoomControl';
//modals
import ModalEditEdges from '../modal/ModalEditEdges';
import { ModalCircle } from '../modal/ModalNodes/ModalCircle';
import { ModalSquare } from '../modal/ModalNodes/ModalSquare';
import { ModalUnity } from '../modal/ModalNodes/ModalUnity';
import { ModalPhase } from '../modal/ModalNodes/ModalPhase';
import { ModalSeparator } from '../modal/ModalNodes/ModalSeparator';
import { ModalEditLabel } from '../modal/ModalNodes/ModalEditLabel';
import { useModal } from './Functions/useModal';
import { useDrag } from './Functions/useDrag';

//services
import { VALUESSIDEBAR } from '../../services/ValuesSideBar';
import { UNITYPHASES } from '../../services/Unitys';
import { INITIAL_NODES, NODE_TYPES } from '../../services/InicialNodes';
import { EDGE_TYPES, INITIAL_EDGES } from '../../services/inicialEdges';

import { CiSettings } from "react-icons/ci";
import { CiDark, CiLight } from 'react-icons/ci';

import { useHistoryState } from '@uidotdev/usehooks';

import { useConnect } from './Functions/useConnect';
import { useResize } from './Functions/useResize';
import { ModalTriangle } from '../modal/ModalNodes/ModalTriangle';
import { ModalLogicControl } from '../modal/ModalNodes/ModalLogicControl';

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

  //theme
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  //viewPort
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  //nodes
  const [nodeEditing, setNodeEditing] = useState<Node | null>(null);
  const [countTriangle, setCountTriangle] = useState(
    nodes.filter((node) => node.type === 'triangle').length
  );

  //alerts
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');

  //alert
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

  //custom hook para modals
  const {
    modalEdgeOpen,
    watingNode,
    modalCircle,
    modalLabel,
    modalPhase,
    modalSeparator,
    modalSquare,
    modalUnity,
    modalTriangle,
    modalLogicControl,
    setmodalEdgeOpen,
    setModalCircle,
    setModalLabel,
    setModalPhase,
    setModalSeparator,
    setModalSquare,
    setModalUnity,
    setModalLogicControl,
    handleWaitingClickOnNode,
    openModalEditNode,
    setModalTriangle,
  } = useModal({ onShowAlert, setNodeEditing });

  //custom hook funções que renderizam os nodes e edges
  const {
    onDragOver,
    onDragStart,
    onDrop,
    handleClickOnWorkspace,
    handleNodeSelect,
    onNodeClick,
    onNodeDragOver,
    selectedUnityId,
    handleDeleteNodes,
  } = useDrag({
    countTriangle,
    nodes,
    edges,
    setEdges,
    onShowAlert,
    screenToFlowPosition,
    set,
    setCountTriangle,
    setNodes,
    state,
    openModalEditNode,
    watingNode,
  });

  //custom hook connect nodes
  const { onConnect } = useConnect({
    edges,
    nodes,
    onShowAlert,
    set,
    setEdges,
    state,
  });
  
  //custom hook Resize Node
  const { handleResize } = useResize({ set, state });

  //função para remover marca da agua reactflow
  const removeMarcaDagua = () => {
    const reactIconFlow = document.getElementsByClassName(
      'react-flow__panel react-flow__attribution bottom right'
    );
    if (reactIconFlow.length > 0) {
      reactIconFlow[0].classList.add('hidden');
    }
  };

  removeMarcaDagua();

  //trocar thema
  const onToggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };
  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

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

  return (
    <div className="w-screen h-screen relative right-0 dndflow">
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        {/* reactFlow */}
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
          {/* voltar e retroceder mudanças */}
          <BackAndNext
            canUndo={canUndo}
            canRedo={canRedo}
            undo={undo}
            redo={redo}
          />
          {/* background */}
          <Background
            variant={BackgroundVariant.Cross}
            size={7}
            gap={40}
            color={colorMode == 'light' ? zinc[200] : zinc[800]}
          />

          {/* controle de zoom */}
          <ZoomControl
            nodes={nodes}
            viewportHeight={viewportHeight}
            viewportWidth={viewportWidth}
          />

          {/* miniMaps */}
          <div className=" lg:flex hidden">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: viewportWidth / 10.3,
                height: viewportHeight / 7,
              }}
            />
          </div>
          <div className=" lg:hidden md:flex hidden ">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                top: 1,
                left: 1,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: viewportWidth / 10.5,
                height: viewportHeight / 11,
              }}
            />
          </div>
          <div className=" 2xl:hidden lg:hidden md:hidden flex  ">
            <MiniMap
              zoomable
              pannable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: zinc[400],
                borderRadius: 5,
                width: 78,
                height: 78,
              }}
            />
          </div>
        </ReactFlow>
      </div>

      {/* navbar */}
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
      <div className='flex fixed flex-row-reverse top-2 gap-1 lg:right-64 right-[3.75rem]'>
      {/* color change button */}
      <div
        onClick={onToggleColorMode}
        className={`border cursor-pointer bg-white hover:bg-zinc-100  border-gray-400 dark:bg-zinc-700  dark:border-zinc-600 rounded-full flex items-center justify-center p-2 transition-all duration-500 ease-in-out ${
          colorMode == 'light' ? 'hover:rotate-180' : 'hover:-scale-x-100'
        }`}
        >
        {colorMode == 'light' ? (
          <CiLight className="text-3xl text-black " />
        ) : (
          <CiDark className="text-3xl text-white" />
        )}
      </div>
      {/* modal edit button */}
      <div
        onClick={handleWaitingClickOnNode}
        className="bg-white hover:bg-zinc-100 cursor-pointer border-gray-400 border dark:bg-zinc-700 dark:border-zinc-600 rounded-full flex items-center justify-center p-2 hover:rotate-180 transition-all duration-300"
        >
        <CiSettings className="text-3xl text-black" />
      </div>
      </div>
      {/* modal Edges */}
      <ModalEditEdges
        edges={edges}
        state={state}
        set={set}
        setEdges={setEdges}
        modalEdgeOpen={modalEdgeOpen}
        setmodalEdgeOpen={setmodalEdgeOpen}
      />
      {/* modal Circle */}
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
      {/* modal Phase */}
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
      {/* modal Square */}
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
      {/* modal Separator */}
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
      {/* modal Unity */}
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
      {/* modal Triangle */}
      <ModalTriangle
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalTriangle={modalTriangle}
        setModalTriangle={setModalTriangle}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      {/* modal LogicControl */}
      <ModalLogicControl 
        set={set}
        state={state}
        nodes={nodes}
        setNodes={setNodes}
        modalLogicControl={modalLogicControl}
        setModalLogicControl={setModalLogicControl}
        nodeEditing={nodeEditing}
        setNodeEditing={setNodeEditing}
      />
      {/* modal Label */}
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
      {/* Alert */}
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
 * Anotation:
 * 
 *To-Do:
 - [x] Fazer documentação.
 - [x] Integração com o mes3.
 - [x] Fazer manual de uso do fluxograma.
 
 *Not Important now:
 - [x] Ajustar controle de logica quando solto em uma unity de fora pra dentro.
 
 
 *Doing:
 
 
 
 - [x] Mobile.
 
 
 *Done: 
 
 - [V] Ajustar enquadramento do zoom.
 - [V] Icone que permite arrastar os nodes.
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
