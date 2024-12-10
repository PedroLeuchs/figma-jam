import { FC } from 'react';

import { MdOutlineZoomInMap } from 'react-icons/md';
import { MdOutlineZoomIn } from 'react-icons/md';
import { MdOutlineZoomOut } from 'react-icons/md';

import { Panel, useReactFlow } from '@xyflow/react';

interface Node {
  id: string;
  position: { x: number; y: number };
  parentId?: string;
}

interface ZoomControlProps {
  nodes: Node[];
  viewportWidth: number;
  viewportHeight: number;
}

const ZoomControl: FC<ZoomControlProps> = ({
  nodes,
  viewportWidth,
  viewportHeight,
}) => {
  const { setViewport, zoomIn, zoomOut } = useReactFlow();

  const lookAllElements = (
    nodes: Node[],
    viewportWidth: number,
    viewportHeight: number
  ) => {
    if (nodes.length === 0) {
      return { x: 0, y: 0, zoom: 1 };
    }

    // Inicializa os limites
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    // Calcula os limites com base nas posições dos nodes
    nodes.forEach((node) => {
      if (!node.parentId) {
        minX = Math.min(minX, node.position.x);
        minY = Math.min(minY, node.position.y);
        maxX = Math.max(maxX, node.position.x);
        maxY = Math.max(maxY, node.position.y);
      }
    });

    // Determina o tamanho do conteúdo
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Adiciona uma margem de segurança (10% do tamanho do conteúdo)
    const margin = 0.1;
    const adjustedWidth = contentWidth * (1 + margin);
    const adjustedHeight = contentHeight * (1 + margin);

    // Calcula o zoom baseado no tamanho ajustado e no viewport
    let zoom = Math.min(
      viewportWidth / adjustedWidth,
      viewportHeight / adjustedHeight
    );

    // Se a diferença entre os nós mais distantes for maior que 1200, diminui mais o zoom
    const maxNodeDistance = Math.max(contentWidth, contentHeight);
    if (maxNodeDistance > 1200) {
      zoom *= 0.8; // Reduz o zoom em 20%
    }

    // Centraliza o conteúdo no viewport
    const centerX = minX + contentWidth / 2;
    const centerY = minY + contentHeight / 2;

    const x = -(centerX * zoom - viewportWidth / 2);
    const y = -(centerY * zoom - viewportHeight / 2);

    return { x, y, zoom };
  };

  return (
    <>
      <Panel
        style={{ position: 'absolute', top: 80, left: -5 }}
        className="lg:hidden flex items-center justify-center p-1 gap-1 rounded dark:text-zinc-400 "
      >
        <button
          className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
          onClick={() => zoomIn({ duration: 500 })}
        >
          <MdOutlineZoomIn className="text-xl w-full h-full hover:scale-125  transition-all duration-200 " />
        </button>
        <button
          className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
          onClick={() => zoomOut({ duration: 500 })}
        >
          <MdOutlineZoomOut className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
        </button>
        <button
          className="p-2 border border-zinc-400 rounded bg-zinc-100 hover:bg-white hover:scale-110 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 transition-all"
          onClick={() =>
            setViewport(lookAllElements(nodes, viewportWidth, viewportHeight), {
              duration: 500,
            })
          }
        >
          <MdOutlineZoomInMap className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
        </button>
      </Panel>
      <Panel
        position="top-left"
        style={{ position: 'absolute', top: 129, left: 73 }}
        className="lg:flex hidden items-center justify-center p-1 gap-1 rounded dark:text-zinc-400 "
      >
        <button
          className="p-1.5 border border-zinc-400 rounded bg-white hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
          onClick={() => zoomIn({ duration: 500 })}
        >
          <MdOutlineZoomIn className="text-xl w-full h-full hover:scale-125  transition-all duration-200 " />
        </button>
        <button
          className="p-1.5 border border-zinc-400 rounded bg-white hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 hover:scale-110 transition-all"
          onClick={() => zoomOut({ duration: 500 })}
        >
          <MdOutlineZoomOut className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
        </button>
        <button
          className="p-1.5 border border-zinc-400 rounded bg-white hover:bg-white hover:scale-110 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:border-zinc-600 transition-all"
          onClick={() =>
            setViewport(lookAllElements(nodes, viewportWidth, viewportHeight), {
              duration: 500,
            })
          }
        >
          <MdOutlineZoomInMap className="text-xl w-full h-full hover:scale-125 transition-all duration-200" />
        </button>
      </Panel>
    </>
  );
};

export default ZoomControl;
