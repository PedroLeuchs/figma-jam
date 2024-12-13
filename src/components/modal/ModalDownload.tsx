import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FaDownload } from 'react-icons/fa6';
import { toPng, toSvg } from 'html-to-image';
import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import TextInput from '../textInput/TextInput';

export const ModalDownload = () => {
  const { getNodes } = useReactFlow();
  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(768);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [text, setText] = useState('diagram');
  const [format, setFormat] = useState<'png' | 'svg'>('png');

  const handleDownload = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.01,
      2.5,
      0.1
    );

    const viewportElement = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement | null;
    if (viewportElement) {
      const options = {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      };

      if (format === 'png') {
        toPng(viewportElement, options)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `${text}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => console.error('Erro ao exportar imagem PNG:', err));
      } else if (format === 'svg') {
        toSvg(viewportElement, options)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `${text}.svg`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => console.error('Erro ao exportar imagem SVG:', err));
      }
    }
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const onSave = () => {
    handleDownload();
    setIsOpen(false);
  };

  const handleToggleChange = (value: string) => {
    setSelectedRatio(value);

    if (value === '16:9') {
      setImageWidth(1280);
      setImageHeight(720);
    } else if (value === '4:3') {
      setImageWidth(1024);
      setImageHeight(768);
    } else if (value === '9:16') {
      setImageWidth(720);
      setImageHeight(1280);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <button className="p-2 rounded bg-violet-400 w-auto border border-gray-500 hover:cursor-pointer">
          <FaDownload
            onClick={() => setIsOpen(true)}
            className="text-lg text-white hover:scale-125 transition-all duration-100"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-between lg:gap-12 md:gap-8 gap-4">
          <Dialog.Title>Configurações de Download</Dialog.Title>
          {/* Seleção de Proporção */}
          <div className="w-full h-[40%] gap-5 flex flex-col items-start justify-start">
            <TextInput
              onChange={setText}
              value={text}
              titleInput={'Nome do arquivo'}
            />
            <ToggleGroup.Root
              className="inline-flex bg-gray-300 rounded shadow-md w-full h-full border border-gray-500"
              type="single"
              value={selectedRatio}
              onValueChange={handleToggleChange}
              aria-label="Seleção de Proporção"
            >
              <ToggleGroup.Item
                className="bg-white text-black h-full w-1/3 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
                value="16:9"
                aria-label="16:9"
              >
                <div className="w-[64%] h-[36%] bg-white border border-gray-500 flex items-center justify-center">
                  <p className="text-2xl text-black">16:9</p>
                </div>
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className="bg-white text-black h-full w-1/3 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
                value="4:3"
                aria-label="4:3"
              >
                <div className="w-[40%] h-[30%] bg-white border border-gray-500 flex items-center justify-center">
                  <p className="text-2xl text-black">4:3</p>
                </div>
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className="bg-white text-black h-full w-1/3 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
                value="9:16"
                aria-label="9:16"
              >
                <div className="w-[36%] h-[64%] bg-white border border-gray-500 flex items-center justify-center">
                  <p className="text-2xl text-black">9:16</p>
                </div>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
            <ToggleGroup.Root
              className="inline-flex bg-gray-300 rounded shadow-md w-1/2 h-20 border border-gray-500"
              type="single"
              value={format}
              onValueChange={(value) => setFormat(value as 'png' | 'svg')}
              aria-label="Selecione o formato"
            >
              <ToggleGroup.Item
                className="bg-white text-black h-full w-1/2 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
                value="png"
                aria-label="Salvar como PNG"
              >
                PNG
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className="bg-white text-black h-full w-1/2 flex items-center justify-center text-sm font-normal first:rounded-l last:rounded-r hover:bg-gray-200 focus:outline-none data-[state=on]:bg-violet-400 data-[state=on]:text-white"
                value="svg"
                aria-label="Salvar como SVG"
              >
                SVG
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          {/* Botões de Ação */}
          <div className="flex lg:justify-end lg:gap-5 gap-2 justify-center">
            <button
              onClick={onCancel}
              className="bg-red-500 text-white rounded lg:px-4 px-2 lg:py-2 py-1 lg:text-lg text-base font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="bg-blue-500 text-white rounded lg:px-4 px-2 lg:py-2 py-1 lg:text-lg text-base font-semibold"
            >
              Salvar Alterações
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
