import { Edge, MarkerType } from '@xyflow/react';
import DefaultEdge from '../components/edges/DefaultEdge';

export const EDGE_TYPES = {
  default: DefaultEdge,
};

export const INITIAL_EDGES: Edge[] = [
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
    id: 'e2-10',
    source: '2',
    target: '10',
    sourceHandle: 'bottom',
    targetHandle: 'top-handle-1',
    type: 'default',
    selected: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e10-4',
    source: '10',
    target: '4',
    sourceHandle: 'bottom-handle-0',
    targetHandle: 'top',
    type: 'default',
    selected: false,
  },
  {
    id: 'e10-5',
    source: '10',
    target: '5',
    sourceHandle: 'bottom-handle-2',
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
