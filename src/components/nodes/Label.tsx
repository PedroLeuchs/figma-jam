import { NodeProps, NodeResizer } from '@xyflow/react';
import { FC } from 'react';

interface LabelProps extends NodeProps {
  selected?: boolean;
  onChangeLabel?: (newLabel: string) => void; // Mantenha essa propriedade se você precisar dela
}

export const Label: FC<LabelProps> = ({
  selected = false,
  data,
  onChangeLabel,
}) => {
  const textareaValue =
    typeof data?.label === 'string' ? data.label : 'Escreva aqui';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChangeLabel) {
      onChangeLabel(e.target.value);
    }
  };

  return (
    <div
      className={`min-h-[50px] min-w-[100px] h-full w-full flex flex-col items-center justify-start p-2`}
    >
      <NodeResizer
        minHeight={50}
        minWidth={100}
        isVisible={selected}
        lineClassName="!border-blue-400"
        handleClassName="!w-2 !h-2 !border-2 !rounded !border-blue-400 !bg-white"
      />
      <textarea
        value={textareaValue}
        onChange={handleChange}
        className={`w-full h-full max-h-full py-2 px-3 text-center rounded-md resize-none overflow-hidden focus:outline-none focus:ring-none bg-transparent break-words placeholder-gray-300`}
        rows={1}
      />
    </div>
  );
};

export default Label;
