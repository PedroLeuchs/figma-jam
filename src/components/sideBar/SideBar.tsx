import React, { useState, useCallback, useEffect } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Node
  
   } from "@xyflow/react";
import { IoClose } from "react-icons/io5";
import { RiMenu5Line } from "react-icons/ri";
import { FaHandPaper } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { ModalDownload } from "../modal/ModalDownload";


interface Ingredient {
  id: string;
  label: string;
  type: string;
}

interface UnitPhase {
  Unidade: string;
  Fases: string[];
}

interface SideBarProps {
  ingredients: Ingredient[];
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
    label?: string
  ) => void;
  nodes: Node[];
  selectedUnityId: string;
  unitphases: UnitPhase[];
  onNodeSelect: (nodeType: string, label?: string) => void;
  viewportWidth: number;
  viewportHeight: number;
  setDragLayout: (value: boolean) => void;
  setSelectedLayout: (value: boolean) => void;
  setIsLocked: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  ingredients,
  onDragStart,
  selectedUnityId,
  unitphases,
  nodes,
  onNodeSelect,
  viewportWidth,
  setDragLayout,
  setIsLocked,
}) => {


  const [isOpenNav, setIsOpenNav] = useState<"flex" | "hidden">("flex");
  const [activeLayout, setActiveLayout] = useState<"left" | "right">("right");

  const ajustedNavBar = useCallback(() => {
    if (viewportWidth < 900) {
      setIsOpenNav("hidden");
    } else {
      setIsOpenNav("flex");
    }
  }, [viewportWidth]);

  useEffect(() => {
    ajustedNavBar();
  }, [ajustedNavBar]);

  const handleToggleChange = (value: "left" | "right") => {
    if (value === "left") {
      setDragLayout(false);
      setIsLocked(true);
      
    } else if (value === "right") {
      setDragLayout(true);
      setIsLocked(false);
    }
    setActiveLayout(value); // Garante que o estado do layout ativo seja atualizado
  };

  const handleNodeSelect = (nodeType: string, label?: string) => {
    if (window.innerWidth < 900) {
      onNodeSelect(nodeType, label);
      setIsOpenNav("hidden");
    } else {
      return;
    }
  };

  const handleOpenNav = () => {
    if (isOpenNav === "flex") {
      setIsOpenNav("hidden");
    } else {
      setIsOpenNav("flex");
    }
  };

  const selectedUnityNode = nodes.find(
    (node) => node.id === selectedUnityId && node.type === "unity"
  );



  return (
    <>
      {isOpenNav === "flex" && (
        <div className="lg:hidden bg-black/20 w-screen h-screen fixed top-0 left-0"></div>
      )}
      <div
        onClick={handleOpenNav}
        className="max-lg:flex hidden z-50 items-center justify-center rounded-full bg-white hover:bg-zinc-100 border border-gray-400 absolute top-2 right-2 p-2 transition-all duration-300"
      >
        <div className="relative w-[30px] h-[30px] flex items-center justify-center">
          <RiMenu5Line
            className={`absolute top-0 left-0 text-3xl text-black transition-transform duration-300 ${
              isOpenNav === "hidden" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
          />
          <IoClose
            className={`absolute top-0 left-0 text-3xl text-black transition-transform duration-300 ${
              isOpenNav === "hidden" ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
            }`}
          />
        </div>
      </div>

      <Toolbar.Root
        className={` ${isOpenNav} ${
          isOpenNav === "flex"
            ? "lg:top-0 top-20 max-lg:right-10 right-0 max-lg:left-10 lg:h-screen max-md:max-h-[80vh]"
            : "  top-0 right-0 h-0"
        } z-40 lg:w-52  absolute bg-white rounded shadow-lg shadow-black/30 border border-zinc-400 flex-col items-center justify-start gap-2 py-2 px-1 dark:bg-zinc-900  dark:border-zinc-700 dark:text-zinc-300 transition-all duration-300`}
      >
        <h2 className="text-center text-xl my-5 italic font-semibold">
          {selectedUnityNode
            ? `Componente ${selectedUnityNode.data.label}`
            : "Componente Principal"}
        </h2>

        <div className="w-full flex flex-col gap-3 items-center justify-start overflow-y-auto h-auto max-h-[50%] mt-2 py-4 ">
          {selectedUnityNode
            ? unitphases
                .filter(
                  (unitphase) =>
                    unitphase.Unidade === selectedUnityNode.data.label
                )
                .map((unitphase) =>
                  unitphase.Fases.map((fase, index) => (
                    <Toolbar.Button
                      key={index}
                      onClick={() =>
                        handleNodeSelect("phase", unitphase.Fases[index])
                      }
                      onDragStart={(event) =>
                        onDragStart(event, "phase", fase)
                      }
                      draggable
                      className="shadow shadow-black/50 w-10/12 h-auto p-2 top-10 right-0 border border-gray-300 dark:border-zinc-700 transition-all duration-300 bg-white dark:bg-gray-100 hover:scale-105 text-black rounded"
                    >
                      {fase}
                    </Toolbar.Button>
                  ))
                )
            : ingredients.map((ingredient) => (
                <Toolbar.Button
                  key={ingredient.id}
                  onDragStart={(event) =>
                    onDragStart(event, ingredient.type)
                  }
                  onClick={() =>
                    handleNodeSelect(ingredient.type, ingredient.label)
                  }
                  draggable
                  className="w-10/12 h-auto p-2 top-10 right-0 border text-black dark:text-zinc-300 border-gray-300 dark:border-zinc-700 transition-all duration-300 bg-white dark:bg-slate-700 hover:scale-105 rounded shadow-black/30 shadow-md"
                >
                  {ingredient.label}
                </Toolbar.Button>
              ))}
        <hr className="border-zinc-300 dark:border-zinc-700 w-11/12" />
        </div>
        <div className="flex flex-col items-center justify-end h-1/5 w-full gap-2 mt-auto">
        <div className="w-full flex ">
              <ModalDownload/>
        </div>
          <ToggleGroup.Root
            className="inline-flex bg-gray-300 rounded shadow-md w-full border border-gray-500"
            type="single"
            value={activeLayout}
            onValueChange={handleToggleChange}
            aria-label="Toggle Group"
          >
            <ToggleGroup.Item
              className="transition-all duration-200 bg-white text-black h-9 w-1/2 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
              value="left"
              aria-label="Left aligned"
            >
              <FaLock />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="transition-all duration-200 bg-white text-black h-9 w-1/2 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
              value="right"
              aria-label="Right aligned"
            >
              <FaHandPaper />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </Toolbar.Root>
    </>
  );
};

export default SideBar;
