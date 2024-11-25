import { TextField } from '@mui/material';
import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import { BsFonts } from 'react-icons/bs';
import { RxFontItalic } from 'react-icons/rx';
import { RiFontColor } from 'react-icons/ri';
import BackgroundPicker from '../colorPicker/BackgroundPicker';
import { IoIosColorPalette } from 'react-icons/io';

interface ModalEditLabelProps {
  textValueModalLabel: string;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  bold:
    | 'font-light'
    | 'font-normal'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold';
  color?: string;
  setTextValueModalLabel: (value: string) => void;
  setItalic: (value: boolean) => void;
  setFontSize: (value: number) => void;
  setUnderline: (value: boolean) => void;
  setColor?: (value: string) => void;
  setBold: (
    value:
      | 'font-light'
      | 'font-normal'
      | 'font-semibold'
      | 'font-bold'
      | 'font-extrabold'
  ) => void;
}

export const ModalEditLabel: FC<ModalEditLabelProps> = ({
  textValueModalLabel,
  italic,
  bold,
  underline,
  setBold,
  setItalic,
  setTextValueModalLabel,
  setUnderline,
  setFontSize,
  fontSize,
  color,
  setColor,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Estados locais para edição temporária
  const [tempTextValue, setTempTextValue] = useState(textValueModalLabel);
  const [tempItalic, setTempItalic] = useState(italic);
  const [tempUnderline, setTempUnderline] = useState(underline);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempBold, setTempBold] = useState(bold);
  const [colorPicker, setColorPicker] = useState('black');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const onCancel = () => {
    // Fechar o modal sem salvar alterações
    setModalOpen(false);
  };

  const handleColorChange = (color: string) => {
    setColorPicker(color || 'black');
  };

  const handleSave = () => {
    // Aplicar as alterações aos estados principais
    setTextValueModalLabel(tempTextValue);
    setItalic(tempItalic);
    setUnderline(tempUnderline);
    setFontSize(tempFontSize);
    setBold(tempBold);
    if (setColor) {
      setColor(colorPicker);
    }
    setModalOpen(false);
  };

  const handleFontWeightChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTempBold(event.target.value as typeof bold);
  };

  return (
    <Dialog.Root
      open={modalOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          // Sincronizar os estados temporários com os principais ao abrir o modal
          setTempTextValue(textValueModalLabel);
          setTempItalic(italic);
          setTempUnderline(underline);
          setTempFontSize(fontSize);
          setTempBold(bold);
          setColorPicker(color || 'black');
        }
        setModalOpen(isOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <button
          onClick={() => setModalOpen(true)}
          className="absolute top-0 left-0 rounded-full p-2 bg-white hover:bg-gray-200 border border-gray-500 hover:border-gray-600"
        >
          <BsFonts className="text-lg" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-40 inset-0 bg-black/30" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 lg:max-h-[85vh] lg:w-[30vw] w-11/12 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-5 flex flex-col items-center justify-between gap-4">
          <div className="w-full h-5/6 flex flex-col items-center gap-2">
            <div className="w-full h-3/6 flex flex-col items-center justify-start gap-5">
              <TextField
                id="outlined-basic"
                label="Texto"
                value={tempTextValue}
                variant="outlined"
                onChange={(e) => setTempTextValue(e.target.value)}
              />
              <div className="flex items-center gap-2 ">
                <button
                  onClick={() => setTempItalic(!tempItalic)}
                  className={`rounded-md p-2 border ${
                    tempItalic ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <RxFontItalic className="text-lg" />
                </button>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`rounded-md p-2 border ${
                    tempItalic ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <IoIosColorPalette className="text-lg" />
                </button>
                <button
                  onClick={() => setTempUnderline(!tempUnderline)}
                  className={`rounded-md p-2 border ${
                    tempUnderline ? 'bg-gray-300' : 'bg-white'
                  }`}
                >
                  <RiFontColor className="text-lg" />
                </button>

                <select
                  value={tempBold}
                  onChange={handleFontWeightChange}
                  className="p-2 border rounded"
                >
                  <option value="font-light" className="font-light">
                    B
                  </option>
                  <option value="font-normal" className="font-normal">
                    B
                  </option>
                  <option value="font-semibold" className="font-semibold">
                    B
                  </option>
                  <option value="font-bold" className="font-bold">
                    B
                  </option>
                  <option value="font-extrabold" className="font-extrabold">
                    B
                  </option>
                </select>
                <TextField
                  id="font-size"
                  label={`Tamanho da fonte`}
                  value={tempFontSize}
                  type="number"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setTempFontSize(Number(e.target.value))}
                />
              </div>
              <div className="w-full flex items-start">
                <div className="w-44 ">
                  {showColorPicker && (
                    <BackgroundPicker
                      lineEdit={true}
                      onColorChange={handleColorChange}
                    />
                  )}
                </div>
              </div>
            </div>
            <h1
              className={`${tempItalic ? 'italic' : 'not-italic'} ${
                tempUnderline ? 'underline' : 'no-underline'
              } ${tempBold} text-center underline-offset-2`}
              style={{
                fontSize: `${tempFontSize}px`,
                color: colorPicker,
              }}
            >
              {tempTextValue}
            </h1>
            <hr className="h-1" />
          </div>
          <hr className="h-1 w-full flex" />
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Salvar Alterações
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
