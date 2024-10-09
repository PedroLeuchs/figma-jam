import * as Select from '@radix-ui/react-select';
import { FC, useState } from 'react';

interface SelectProps {
  values: { id: string; label: string }[];
  type: string;
  onIngredientSelect?: (value: string) => void;
  onMachineSelect?: (value: string) => void;
}

const SelectComponent: FC<SelectProps> = ({ values, type, onIngredientSelect, onMachineSelect }) => {
  const [search, setSearch] = useState(''); // Estado para o valor da pesquisa
  const onSelect = type === 'circle' ? onMachineSelect : onIngredientSelect;

  // Filtrar as opções com base no valor digitado
  const filteredValues = values.filter((value) =>
    value.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Select.Root onValueChange={onSelect}>
      <Select.Trigger asChild>
        <button className="flex gap-3 items-center justify-between bg-white p-2 border border-gray-300 text-black rounded-lg">
          <Select.Value placeholder="Selecione uma opção" />
          <Select.Icon />
        </button>
      </Select.Trigger >

      <Select.Portal >
        <Select.Content className="bg-white rounded shadow-lg border border-gray-300 fixed top-[35%] right-[40%] left-[40%] !max-h-[47vh] h-auto">
          <Select.ScrollUpButton className="text-gray-700" />

          <div className="p-2">
            {/* Campo de busca */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
          </div>

          <Select.Viewport className="p-2 w-full h-auto overflow-y-auto">
            {filteredValues.length > 0 ? (
              filteredValues.map((value) => (
                <Select.Item
                  key={value.id}
                  value={value.label}
                  className="flex justify-between p-2 rounded cursor-pointer hover:bg-gray-100 w-full"
                >
                  <Select.ItemText>{value.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))
            ) : (
              <div className="p-2 text-gray-500">Nenhuma opção encontrada</div>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton className="text-gray-700" />
          <Select.Arrow className="text-white" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default SelectComponent;
