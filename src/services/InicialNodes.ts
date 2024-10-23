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
    position: { x: 700, y: 10 },
    data: { label: 'Start', color: 'bg-gray-500', direction: false },
  },
  {
    id: getId().toString(),
    type: 'circle',
    measured: { width: 100, height: 100 },
    position: { x: 699, y: 150 },
    data: { label: MACHINES[0].label, machine: MACHINES },
  },
  {
    id: getId('unity').toString(),
    type: 'unity',
    measured: { width: 500, height: 450 },
    position: { x: 500, y: 300 },
    data: { label: UNITYPHASES[1].Unidade, unitphases: UNITYPHASES },
    style: { width: 500, height: 450 },
  },
  {
    id: getId().toString(),
    type: 'square',
    measured: { width: 200, height: 50 },
    position: { x: 525, y: 600 },
    data: { label: EQUIPAMENT[0].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'square',
    measured: { width: 200, height: 50 },
    position: { x: 775, y: 600 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'square',
    measured: { width: 200, height: 50 },
    position: { x: 650, y: 750 },
    data: { label: EQUIPAMENT[5].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'square',
    measured: { width: 200, height: 50 },
    position: { x: 650, y: 800 },
    data: { label: EQUIPAMENT[10].label, ingredients: EQUIPAMENT },
  },
  {
    id: getId().toString(),
    type: 'circle',
    measured: { width: 100, height: 100 },
    position: { x: 1300, y: 200 },
    data: { label: MACHINES[1].label, machine: MACHINES },
  },
  {
    id: getId().toString(),
    type: 'triangle',
    measured: { width: 100, height: 100 },
    position: { x: 1300, y: 350 },
    data: { label: 'End', direction: true },
  },
  {
    id: getId().toString(),
    type: 'logicControl',
    measured: { width: 100, height: 20 },
    position: { x: 700, y: 525 },
    data: { typeControls: LOGIC_CONTROLS },
  },
];
