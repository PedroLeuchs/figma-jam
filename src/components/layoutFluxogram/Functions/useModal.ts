import { Node } from '@xyflow/react';
import { useState, useCallback } from 'react';

interface ModalProps {
  onShowAlert: (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success'
  ) => void;
  setNodeEditing: (node: Node) => void;
}

export const useModal = ({ onShowAlert, setNodeEditing }: ModalProps) => {
  const [modalEdgeOpen, setmodalEdgeOpen] = useState(false);
  const [watingNode, setWatingNode] = useState(false);
  const [modalCircle, setModalCircle] = useState(false);
  const [modalPhase, setModalPhase] = useState(false);
  const [modalSquare, setModalSquare] = useState(false);
  const [modalSeparator, setModalSeparator] = useState(false);
  const [modalUnity, setModalUnity] = useState(false);
  const [modalLabel, setModalLabel] = useState(false);
  const [modalTriangle, setModalTriangle] = useState(false);
  const [modalLogicControl, setModalLogicControl] = useState(false);

  const handleWaitingClickOnNode = () => {
    onShowAlert('Clique no nó que deseja editar.', 'info');
    setWatingNode(true);
  };

  const openModalEditNode = useCallback(
    (node: Node) => {
      setNodeEditing(node);

      const nodeType = node.type ? node.type : '';

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
      if (nodeType === 'triangle') {
        setModalTriangle(true);
      }
      if (nodeType === 'logicControl') {
        setModalLogicControl(true);
      }

      setWatingNode(false);
    },
    [setWatingNode, setNodeEditing, setModalCircle]
  );

  return {
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
    setModalTriangle,
    setModalLogicControl,
    handleWaitingClickOnNode,
    openModalEditNode,
  };
};
