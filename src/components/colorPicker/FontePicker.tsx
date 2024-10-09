import * as Toolbar from '@radix-ui/react-toolbar';

interface FontePickerProps {
  onColorChange: (color: string) => void;
  setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
}
type ColorShades = {
  [key: string]: string[];
};

const COLORS: ColorShades = {
  White: ['bg-white'],
  Black: ['bg-black'],
};

const FontePicker: React.FC<FontePickerProps> = ({
  onColorChange,
  setShowColorPicker,
}) => {
  const handleColorPick = (color: string) => {
    onColorChange(color);
    setShowColorPicker(false);
  };

  return (
    <div className="relative">
      {/* Menu para escolher a cor do texto */}
      <Toolbar.Root className="flex flex-wrap gap-1 -top-[80%] -right-[90%] bg-white border border-zinc-300 rounded-lg p-2 w-40 transition-all duration-300">
        {Object.entries(COLORS).map(([colorName, colorShades]) => (
          <Toolbar.Button
            key={colorName}
            onClick={() =>
              handleColorPick(colorShades[0].replace('bg-', 'text-'))
            } // Troca 'bg-' por 'text-' para cores de texto
            className={`w-5 h-5 grow basis-5 border border-gray-300 hover:opacity-75 transition-opacity ${
              colorName == 'Black'
                ? colorShades[0]
                : colorName == 'White'
                ? colorShades[0]
                : colorShades[4]
            }`}
          />
        ))}
      </Toolbar.Root>
    </div>
  );
};

export default FontePicker;
