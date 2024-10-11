/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from "@radix-ui/react-dialog";
import { GrConfigure } from "react-icons/gr";
import TextInput from '../textInput/TextInput'; // Altere o caminho conforme necessário

interface ModalProps {
  components: {
    Component: React.ComponentType<any>;
    props: any;
    id: string; // Adicionando um id único para cada componente
  }[];
  textValue?: string; // Para o valor do texto
  onTextChange: (value: string) => void; // Para atualizar o texto
  onSave: () => void; // Função para salvar alterações
  onCancel: () => void; // Função para salvar alterações
}

export const Modal = ({ components, textValue, onTextChange, onSave, onCancel }: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-full p-2 bg-white hover:bg-gray-200 border border-gray-500 hover:border-gray-600 hover:cursor-pointer">
          <GrConfigure className="text-lg" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col gap-12">
          <div className="w-full h-1/2 flex flex-col gap-5">
            <Dialog.Title className="text-lg font-semibold">
              Configurações
            </Dialog.Title>
            {textValue && (
              <TextInput value={textValue} onChange={onTextChange} />
            )}
            <div className="flex flex-col">
              {components.map(({ Component, props }, index) => (
                index === 0 ? <Component key={`config-${index}`} {...props} /> : null
              ))}
            </div>
          </div>
          <hr className="h-1" />
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-lg font-semibold">Estilos</Dialog.Title>
            <div className="flex flex-col gap-2">
              {components.map(({ Component, props }, index) => (
                index !== 0 ? (
                  <div key={`style-${index}`}>
                    {index === 1 ? 'Cor da fonte' : 'Cor do componente'}
                    <Component {...props} />
                  </div>
                ) : null
              ))}
            </div>
          </div>
            <Dialog.Close asChild>
          <div className="flex justify-end gap-5">
            <button 
              onClick={onCancel} 
              className="mt-2 bg-red-500 text-white rounded px-4 py-2"
            >
              Cencelar
            </button>
            <button 
              onClick={onSave} 
              className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
            >
              Salvar Alterações
            </button>
          </div>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
