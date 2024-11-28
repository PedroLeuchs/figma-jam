import * as Select from '@radix-ui/react-select';
import { FC, useState } from 'react';

interface SelectProps {
  values?: { id: string; label: string }[];
  valuesUnity?: { Unidade: string; Fases: string[] }[];
  type: string;
  onIngredientSelect?: (value: string) => void;
  onMachineSelect?: (value: string) => void;
  onUnitySelect?: (value: string) => void;
}

// Type guard para verificar se o objeto é do tipo de unidade
function isUnity(
  value: { id: string; label: string } | { Unidade: string; Fases: string[] }
): value is { Unidade: string; Fases: string[] } {
  return 'Unidade' in value;
}

const SelectComponent: FC<SelectProps> = ({
  values = [],
  valuesUnity = [],
  type,
  onIngredientSelect,
  onMachineSelect,
  onUnitySelect,
}) => {
  const [search, setSearch] = useState(''); // Estado para o valor da pesquisa
  const onSelect =
    type === 'circle'
      ? onMachineSelect
      : type === 'group1'
      ? onUnitySelect
      : onIngredientSelect;

  let filteredValues: Array<
    { id: string; label: string } | { Unidade: string; Fases: string[] }
  > = [];

  // Filtrar as opções com base no valor digitado
  if (onSelect === onUnitySelect) {
    filteredValues = valuesUnity.filter((value) =>
      value.Unidade.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    filteredValues = values.filter((value) =>
      value.label.toLowerCase().includes(search.toLowerCase())
    );
  }

  const handleValueChange = (value: string) => {
    // Verificar se estamos lidando com Unidade ou Ingrediente
    const selectedValue = filteredValues.find((item) => {
      return isUnity(item) ? item.Unidade === value : item.label === value;
    });

    if (onSelect && selectedValue) {
      // Se o valor for de uma unidade, chamar o onUnitySelect
      if (isUnity(selectedValue)) {
        onUnitySelect?.(selectedValue.Unidade);
      } else {
        // Caso contrário, chamar a função de ingrediente ou máquina
        onSelect(selectedValue.label);
      }
    }
  };

  return (
    <Select.Root onValueChange={handleValueChange}>
      <Select.Trigger asChild>
        <button className="flex gap-3 items-center justify-between bg-white p-2 border border-gray-300 text-black rounded-lg">
          <Select.Value placeholder="Selecione uma opção" />
          <Select.Icon />
        </button>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white z-50 rounded shadow-lg border border-gray-300 fixed top-[35%] right-[40%] left-[40%] !max-h-[47vh] h-auto">
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
            {type === 'group1' ? (
              filteredValues.length > 0 ? (
                filteredValues.map((value) =>
                  isUnity(value) ? (
                    <Select.Item
                      key={value.Unidade}
                      value={value.Unidade}
                      className="flex justify-between p-2 rounded cursor-pointer hover:bg-gray-100 w-full"
                    >
                      <Select.ItemText>{value.Unidade}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ) : null
                )
              ) : (
                <div className="p-2 text-gray-500">
                  Nenhuma opção encontrada
                </div>
              )
            ) : filteredValues.length > 0 ? (
              filteredValues.map((value) =>
                'id' in value ? (
                  <Select.Item
                    key={value.id}
                    value={value.label}
                    className="flex justify-between p-2 rounded cursor-pointer hover:bg-gray-100 w-full"
                  >
                    <Select.ItemText>{value.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ) : null
              )
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
