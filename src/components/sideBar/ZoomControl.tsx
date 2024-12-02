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

    let zoom = Math.min(zoomX, zoomY) * 0.9;

    if (zoom < 0.08) {
      zoom = 0.08;
    } else {
      zoom *= 0.98;
    }

    const factorX = (viewportHeight + viewportWidth) / (maxX - minX) / 3.5;
    const factorY = (viewportHeight + viewportWidth) / (maxY - minY) / 3.5;

    const xAdjusted = (centerX - viewportWidth / 2 / zoom) * -1 * factorX;
    const yAdjusted = (centerY - viewportHeight / 2 / zoom) * -1 * factorY;

    return {
      x: xAdjusted,
      y: yAdjusted,
      zoom,
    };
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
        position="bottom-left"
        style={{ position: 'absolute', bottom: 5, left: 5 }}
        className="lg:flex hidden flex-col items-center justify-center p-1 gap-1 rounded dark:text-zinc-400 "
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
    </>
  );
};

export default ZoomControl;
