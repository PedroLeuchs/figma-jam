// TextInput.tsx
import { FC } from 'react';

interface TextInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const TextInput: FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold">Adicionar Titulo:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md p-2"
      />
    </div>
  );
};

export default TextInput;
