import { FC } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import BackgroundPicker from '../colorPicker/BackgroundPicker';

interface EditEdgeProps {
  setHeightTemp: (height: number) => void;
  setAnimatedTemp: (animated: boolean) => void;
  setLineTypeTemp: (type: 'none' | 'end') => void;
  setColorTemp: (color: string) => void;
  animated: boolean;
}

const EditEdge: FC<EditEdgeProps> = ({
  setHeightTemp,
  setAnimatedTemp,
  setLineTypeTemp,
  setColorTemp,
  animated,
}) => {
  const handleLineHeightChange = (height: number) => {
    setHeightTemp(height);
  };

  const handleAnimatedChange = () => {
    setAnimatedTemp(!animated);
  };

  const handleArrowChange = (type: 'none' | 'end') => {
    setLineTypeTemp(type);
  };

  const handleColorChange = (color: string) => {
    setColorTemp(color);
  };
  return (
    <Toolbar.Root className="w-full h-full rounded-b-lg flex flex-col items-center justify-start">
      <div className="h-full w-full flex flex-col items-center lg:gap-5 md:gap-3 gap-2 justify-start">
        <Toolbar.Root className="w-full h-2/3 flex">
          <div className="flex flex-col h-1/3 w-full lg:gap-2 gap-1">
            <h1 className="lg:text-xl md:text-base text-sm font-semibold">
              Expessura da linha
            </h1>
            <div className="w-full flex flex-col items-center p-5">
              <Toolbar.Button
                onClick={() => handleLineHeightChange(1)}
                className="w-full h-1/6 p-2 hover:bg-gray-100"
              >
                <hr className="border border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(2)}
                className="w-full h-1/6 p-2 hover:bg-gray-100"
              >
                <hr className="border-2 border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(4)}
                className="w-full h-1/6 p-2 hover:bg-gray-100"
              >
                <hr className="border-4 border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleLineHeightChange(6)}
                className="w-full h-2/6 p-2 hover:bg-gray-100"
              >
                <hr className="border-8 border-black " />
              </Toolbar.Button>
              <Toolbar.Button
                onClick={() => handleAnimatedChange()}
                className="w-[98%] flex h-1/6 hover:bg-gray-100 overflow-hidden "
              >
                <div className="h-full  py-2 gap-2 flex items-center justify-center -translate-x-1/3">
                  <hr className="border-t-8 h-full w-96 border-dashed border-black animate-linearLine" />
                  <hr className="border-t-8 h-full w-96 border-dashed border-black animate-linearLine" />
                  <hr className="border-t-8 h-full w-96 border-dashed border-black animate-linearLine" />
                </div>
              </Toolbar.Button>
            </div>
          </div>
        </Toolbar.Root>
        <div className="flex flex-col w-full h-1/3 items-start">
          <h1 className="lg:text-xl md:text-base text-sm font-semibold">
            Cor da linha
          </h1>
          <div className="w-44">
            <BackgroundPicker
              onColorChange={handleColorChange}
              lineEdit={true}
            />
          </div>
        </div>

        <div className="w-full h-1/3 flex flex-col">
          <h1 className="lg:text-xl md:text-base text-sm font-semibold">
            Tipo da linha
          </h1>
          <Toolbar.Root className="w-1/3 h-2/3 flex flex-col items-center justify-start gap-2 pl-5 pt-2">
            <Toolbar.Button
              className="w-full h-1/2 p-2 hover:bg-gray-100 flex items-center justify-start"
              onClick={() => handleArrowChange('none')}
            >
              <hr className="border-2 border-black w-full" />
            </Toolbar.Button>
            <Toolbar.Button
              className="w-full h-1/2 p-2 hover:bg-gray-100 flex items-center justify-start"
              onClick={() => handleArrowChange('end')}
            >
              {/* <hr className="border-[3px] border-black w-full" />
              <FaLongArrowAltRight className="text-4xl -translate-x-1" /> */}
              <div className="relative w-full h-1 bg-black arrow-line -z-50"></div>
            </Toolbar.Button>
          </Toolbar.Root>
        </div>
      </div>
    </Toolbar.Root>
  );
};

export default EditEdge;
