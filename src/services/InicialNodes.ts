import { EQUIPAMENT } from './Equipament';
import { MACHINES } from './Machines';
import { UNITYPHASES } from './Unitys';
import { LOGIC_CONTROLS } from './LogicControl';
import { Node } from '@xyflow/react';

//Nodes
import { Square } from '../components/nodes/Square';
import { Triangle } from '../components/nodes/Triangle';
import { Circle } from '../components/nodes/Circle';
import { Group } from '../components/nodes/Group';
import LogicControl from '../components/nodes/LogicControl';
import Phase from '../components/nodes/Phase';
import { Label } from '../components/nodes/Label';
import Separator from '../components/nodes/Separator';

export const NODE_TYPES = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
  logicControl: LogicControl,
  unity: Group,
  phase: Phase,
  label: Label,
  separator: Separator,
};
export const GROUPIDS: string[] = [];

let nodeId = 1;
export const getId = (type?: string) => {
  const id = nodeId++;

  if (type === 'unity') {
    GROUPIDS.push(id.toString());
  }
  return id;
};

export const INITIAL_NODES: Node[] = [
  {
    id: getId().toString(),
    type: 'triangle',
    measured: { width: 100, height: 100 },
    position: { x: 210, y: 110 },
    data: { label: 'Start', color: 'bg-gray-500', direction: false },
  },
  {
    id: getId().toString(),
    type: 'circle',
    measured: { width: 100, height: 100 },
    position: { x: 209, y: 250 },
    data: { label: MACHINES[0].label, machine: MACHINES },
  },
  {
    id: getId('unity').toString(),
    type: 'unity',
    measured: { width: 500, height: 600 },
    position: { x: 500, y: 200 },
    data: {
      label: UNITYPHASES[1].Unidade,
      unitphases: UNITYPHASES,
      canSettings: true,
    },
    style: { width: 500, height: 600 },
  },
  {
    id: getId().toString(),
    type: 'phase',
    measured: { width: 200, height: 50 },
    position: { x: 25, y: 200 },
    data: { label: UNITYPHASES[1].Fases[0], unitphases: UNITYPHASES },
    parentId: GROUPIDS[0],
    extent: 'parent',
  },
  {
    id: getId().toString(),
    type: 'phase',
    measured: { width: 200, height: 50 },
    position: { x: 275, y: 200 },
    data: { label: UNITYPHASES[1].Fases[2], unitphases: UNITYPHASES },
    parentId: GROUPIDS[0],
    extent: 'parent',
  },
  {
    id: getId().toString(),
    type: 'phase',
    measured: { width: 200, height: 50 },
    position: { x: 150, y: 500 },
    data: { label: UNITYPHASES[1].Fases[3], unitphases: UNITYPHASES },
    parentId: GROUPIDS[0],
    extent: 'parent',
  },
  {
    id: getId().toString(),
    type: 'square',
    measured: { width: 200, height: 50 },
    position: { x: 650, y: 860 },
    data: { label: EQUIPAMENT[10].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'circle',
    measured: { width: 100, height: 100 },
    position: { x: 1299, y: 300 },
    data: { label: MACHINES[1].label, machine: MACHINES },
  },
  {
    id: getId().toString(),
    type: 'triangle',
    measured: { width: 100, height: 100 },
    position: { x: 1300, y: 450 },
    data: { label: 'End', direction: true },
  },
  {
    id: getId().toString(),
    type: 'logicControl',
    parentId: GROUPIDS[0],
    extent: 'parent',
    measured: { width: 100, height: 20 },
    position: { x: 200, y: 100 },
    data: { typeControls: LOGIC_CONTROLS, operatorSelected: 'AND' },
  },
  {
    id: getId().toString(),
    type: 'logicControl',
    parentId: GROUPIDS[0],
    extent: 'parent',
    measured: { width: 100, height: 20 },
    position: { x: 200, y: 400 },
    data: { typeControls: LOGIC_CONTROLS, operatorSelected: 'AND' },
  },
  {
    id: getId().toString(),
    type: 'label',
    position: { x: 300, y: 200 },
    data: { label: 'Passo 1' },
  },
  {
    id: getId().toString(),
    type: 'label',
    position: { x: 1100, y: 200 },
    data: { label: 'Passo 2' },
  },
  {
    id: getId().toString(),
    type: 'separator',
    measured: { width: 1000, height: 1000 },
    style: { width: 1500, height: 950 },
    position: { x: 50, y: 20 },
    data: {
      label: 'Receita 1',
      color: 'border-black',
      fontColor: 'text-black',
    },
  },
];
