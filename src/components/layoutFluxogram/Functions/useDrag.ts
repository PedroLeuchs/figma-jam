import { useDnD } from '../../sideBar/DndContext';
import { EQUIPAMENT } from '../../../services/Equipament';
import { MACHINES } from '../../../services/Machines';
import { useState, useCallback, type MouseEvent, useEffect } from 'react';
import { getId } from '../../../services/InicialNodes';
import { UNITYPHASES } from '../../../services/Unitys';
import { Node, Edge, useReactFlow } from '@xyflow/react';

interface DragProps {
  watingNode: boolean;
  setCountTriangle: React.Dispatch<React.SetStateAction<number>>;
  countTriangle: number;
  nodes: Node[];
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
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
  screenToFlowPosition: (position: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  openModalEditNode: (node: Node) => void;
}

export const useDrag = ({
  watingNode,
  countTriangle,
  nodes,
  edges,
  setEdges,
  onShowAlert,
  set,
  setCountTriangle,
  setNodes,
  state,
  screenToFlowPosition,
  openModalEditNode,
}: DragProps) => {
  const [newLabel, setNewLabel] = useState<string>('');
  const [type, setType] = useDnD();
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState<string | null>(
    null
  );
  const [selectedUnityId, setSelectedUnityId] = useState<string>('');
  const { getIntersectingNodes } = useReactFlow();

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
      onShowAlert,
      setCountTriangle,
    ]
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
        dragHandle: '.drag-handle__custom',
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
        dragHandle: '.drag-handle__custom',
        position,
        data: { label: selectedNodeLabel,
          ingredients: selectedNodeType === 'square' ? EQUIPAMENT : null,
          machine: selectedNodeType === 'circle' ? MACHINES : null,
          unitphases: selectedNodeType === 'unity' ? UNITYPHASES : null,
          operatorSelected: selectedNodeType === 'logicControl' ? 'AND' : null,
          direction: selectedNodeType === 'triangle' ? false : null,
          },
        style: {},
      };
      if(selectedNodeType === 'triangle'){
      
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

      set({
        ...state,
        nodesHistoryState: [...state.nodesHistoryState, newNode],
      });

      onShowAlert(`${selectedNodeLabel} Adicionado com sucesso.`, 'success');
      setSelectedNodeType(null);
      setSelectedNodeLabel(null);
    }
  };
  console.log(nodes);
  

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

  return {
    selectedUnityId,
    onDragStart,
    onDragOver,
    onDrop,
    handleNodeSelect,
    handleClickOnWorkspace,
    onNodeClick,
    onNodeDragOver,
    handleDeleteNodes,
  };
};
