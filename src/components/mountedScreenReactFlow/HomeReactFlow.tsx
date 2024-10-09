import { ReactFlowProvider } from '@xyflow/react';
import { DnDFlow } from '../layoutFluxogram/LayoutFluxogram';
import { DnDProvider } from '../sideBar/DndContext';
// import FluxogramList from '../fluxogramList/FluxogramList';
// import FluxogramList2 from '../fluxogramList/FluxogramList2';
// import InfoFaze from '../InfoFaze/InfoFaze';

const HomeReactFlow = () => {
  return (
    <div className="w-full h-full flex">
      {/* <FluxogramList />
      <div className="flex flex-col">
        <div className="flex"> */}
      {/* <FluxogramList2 /> */}
      <ReactFlowProvider>
        <DnDProvider>
          <DnDFlow />
        </DnDProvider>
      </ReactFlowProvider>

      {/* </div>
        <InfoFaze />
      </div> */}
    </div>
  );
};

export default HomeReactFlow;
