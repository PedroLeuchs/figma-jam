/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog';
import { GrConfigure } from 'react-icons/gr';
import TextInput from '../textInput/TextInput'; // Altere o caminho conforme necessário
import { useState } from 'react';
import AlertComponent from '../alert/AlertComponent';
import * as Toolbar from '@radix-ui/react-toolbar';

interface ModalProps {
  canSettings?: boolean;
  components: {
    Component: React.ComponentType<any>;
    props?: any;
    id: string; // Adicionando um id único para cada componente
  }[];
  textValue?: string | undefined; // Para o valor do texto
  tempTextValue?: string | undefined; // Para o valor do texto
  onTextChange: (value: string) => void; // Para atualizar o texto
  onSave: () => void; // Função para salvar alterações
  onCancel: () => void; // Função para salvar alterações
  isUnity?: boolean;
  isSeparator?: boolean;
  noConfig?: boolean;
  setTempLineHeight?: (value: string) => void;
}

export const Modal = ({
  isUnity,
  canSettings,
  components,
  textValue,
  tempTextValue,
  onTextChange,
  onSave,
  onCancel,
  isSeparator,
  noConfig = false,
  setTempLineHeight,
}: ModalProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [showAlertSeverity, setShowAlertSeverity] = useState<
    'error' | 'warning' | 'info' | 'success'
  >('error');
  const [modalOpen, setModalOpen] = useState(false);
  const onShowAlert = (
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success'
  ) => {
    setShowAlertMessage(message);
    setShowAlertSeverity(severity);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  const handleSave = async () => {
    if (textValue != tempTextValue) {
      if (canSettings) {
        onShowAlert(
          'Já tem Phases dentro dessa unity, você não pode mudar o tipo dela.',
          'error'
        );
      } else {
        onSave();
        setModalOpen(false); // Fecha o modal se o salvamento for bem-sucedido
      }
    } else {
      onSave();
      setModalOpen(false); // Fecha o modal se o salvamento for bem-sucedido
    }
  };

  return (
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
      <Dialog.Trigger asChild>
        <button
          onClick={() => setModalOpen(true)}
          className={`fixed ${
            isUnity ? 'top-2 left-2' : '-top-10 left-0'
          }  rounded-full p-2 bg-white hover:bg-gray-200 border border-gray-500 hover:border-gray-600 hover:cursor-pointer`}
        >
          <GrConfigure className="text-lg" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow flex flex-col gap-12">
          {noConfig ? null : (
            <>
              {' '}
              <div className="w-full h-1/2 flex flex-col gap-5">
                <Dialog.Title className="text-lg font-semibold">
                  Configurações
                </Dialog.Title>
                {!isUnity && textValue && (
                  <TextInput value={textValue} onChange={onTextChange} />
                )}
                <div className="flex flex-col">
                  {!isSeparator
                    ? components.map(({ Component, props }, index) =>
                        index === 0 ? (
                          <Component key={`config-${index}`} {...props} />
                        ) : null
                      )
                    : null}
                </div>
              </div>
              <hr className="h-1" />
            </>
          )}
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-lg font-semibold">
              Estilos
            </Dialog.Title>
            <div className="flex flex-col gap-2">
              {components.map(({ Component, props }, index) =>
                noConfig || isSeparator ? (
                  <div key={`style-${index}`}>
                    {index === 1 ? 'Cor da fonte' : 'Cor do componente'}
                    <Component
                      {...props}
                      isSeparator={isSeparator ? isSeparator : false}
                    />
                  </div>
                ) : index !== 0 ? (
                  <div key={`style-${index}`}>
                    {index === 1 ? 'Cor da fonte' : 'Cor do componente'}
                    <Component
                      {...props}
                      isSeparator={isSeparator ? isSeparator : false}
                    />
                  </div>
                ) : null
              )}
              {isSeparator && (
                <Toolbar.Root className="w-full h-2/3 flex">
                  <div className="w-4/5 flex flex-col">
                    <Toolbar.Button
                      onClick={() =>
                        setTempLineHeight && setTempLineHeight('border')
                      }
                      className="w-full h-1/3 p-2 hover:bg-gray-100"
                    >
                      <hr className="border border-black " />
                    </Toolbar.Button>
                    <Toolbar.Button
                      onClick={() =>
                        setTempLineHeight && setTempLineHeight('border-2')
                      }
                      className="w-full h-1/3 p-2 hover:bg-gray-100"
                    >
                      <hr className="border-2 border-black " />
                    </Toolbar.Button>
                    <Toolbar.Button
                      onClick={() =>
                        setTempLineHeight && setTempLineHeight('border-4')
                      }
                      className="w-full h-1/3 p-2 hover:bg-gray-100"
                    >
                      <hr className="border-4 border-black " />
                    </Toolbar.Button>
                    <Toolbar.Button
                      onClick={() =>
                        setTempLineHeight && setTempLineHeight('border-8')
                      }
                      className="w-full h-1/3 p-2 hover:bg-gray-100"
                    >
                      <hr className="border-8 border-black " />
                    </Toolbar.Button>
                  </div>
                </Toolbar.Root>
              )}
            </div>
          </div>
          {/* <Dialog.Close asChild> */}
          <div className="flex justify-end gap-5">
            <button
              onClick={() => {
                onCancel();
                setModalOpen(false);
              }}
              className="mt-2 bg-red-500 text-white rounded px-4 py-2"
            >
              Cencelar
            </button>
            <button
              onClick={handleSave}
              className="mt-2 bg-blue-500 text-white rounded px-4 py-2"
            >
              Salvar Alterações
            </button>
          </div>
          {/* </Dialog.Close> */}
        </Dialog.Content>
        <AlertComponent
          show={showAlert}
          message={showAlertMessage}
          severity={showAlertSeverity}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
