// TextInput.tsx
import { FC } from 'react';

interface TextInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  titleInput?: string;
}

const TextInput: FC<TextInputProps> = ({ value, onChange,titleInput }) => {
  return (
    <div className="flex flex-col">
      <label className="lg:text-base text-sm font-semibold">
      {titleInput ? titleInput : ' Adicionar Titulo:'} 
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md p-2 lg:text-base text-sm"
      />
    </div>
  );
};

export default TextInput;
