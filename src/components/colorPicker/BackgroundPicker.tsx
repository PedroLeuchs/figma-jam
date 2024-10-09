import React, { useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  setShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  lineEdit?: boolean;
}

type ColorShades = {
  [key: string]: string[];
};
const COLORS: ColorShades = {
  White: ['bg-white'],
  Black: ['bg-black'],
  Slate: [
    'bg-slate-50',
    'bg-slate-100',
    'bg-slate-200',
    'bg-slate-300',
    'bg-slate-400',
    'bg-slate-500',
    'bg-slate-600',
    'bg-slate-700',
    'bg-slate-800',
    'bg-slate-900',
    'bg-slate-950',
  ],
  Gray: [
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    'bg-gray-950',
  ],
  Zinc: [
    'bg-zinc-50',
    'bg-zinc-100',
    'bg-zinc-200',
    'bg-zinc-300',
    'bg-zinc-400',
    'bg-zinc-500',
    'bg-zinc-600',
    'bg-zinc-700',
    'bg-zinc-800',
    'bg-zinc-900',
    'bg-zinc-950',
  ],
  Neutral: [
    'bg-neutral-50',
    'bg-neutral-100',
    'bg-neutral-200',
    'bg-neutral-300',
    'bg-neutral-400',
    'bg-neutral-500',
    'bg-neutral-600',
    'bg-neutral-700',
    'bg-neutral-800',
    'bg-neutral-900',
    'bg-neutral-950',
  ],
  Stone: [
    'bg-stone-50',
    'bg-stone-100',
    'bg-stone-200',
    'bg-stone-300',
    'bg-stone-400',
    'bg-stone-500',
    'bg-stone-600',
    'bg-stone-700',
    'bg-stone-800',
    'bg-stone-900',
    'bg-stone-950',
  ],
  Red: [
    'bg-red-50',
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
    'bg-red-950',
  ],
  Orange: [
    'bg-orange-50',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-orange-900',
    'bg-orange-950',
  ],
  Amber: [
    'bg-amber-50',
    'bg-amber-100',
    'bg-amber-200',
    'bg-amber-300',
    'bg-amber-400',
    'bg-amber-500',
    'bg-amber-600',
    'bg-amber-700',
    'bg-amber-800',
    'bg-amber-900',
    'bg-amber-950',
  ],
  Yellow: [
    'bg-yellow-50',
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
    'bg-yellow-950',
  ],
  Lime: [
    'bg-lime-50',
    'bg-lime-100',
    'bg-lime-200',
    'bg-lime-300',
    'bg-lime-400',
    'bg-lime-500',
    'bg-lime-600',
    'bg-lime-700',
    'bg-lime-800',
    'bg-lime-900',
    'bg-lime-950',
  ],
  Green: [
    'bg-green-50',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
    'bg-green-950',
  ],
  Emerald: [
    'bg-emerald-50',
    'bg-emerald-100',
    'bg-emerald-200',
    'bg-emerald-300',
    'bg-emerald-400',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-emerald-700',
    'bg-emerald-800',
    'bg-emerald-900',
    'bg-emerald-950',
  ],
  Teal: [
    'bg-teal-50',
    'bg-teal-100',
    'bg-teal-200',
    'bg-teal-300',
    'bg-teal-400',
    'bg-teal-500',
    'bg-teal-600',
    'bg-teal-700',
    'bg-teal-800',
    'bg-teal-900',
    'bg-teal-950',
  ],
  Cyan: [
    'bg-cyan-50',
    'bg-cyan-100',
    'bg-cyan-200',
    'bg-cyan-300',
    'bg-cyan-400',
    'bg-cyan-500',
    'bg-cyan-600',
    'bg-cyan-700',
    'bg-cyan-800',
    'bg-cyan-900',
    'bg-cyan-950',
  ],
  Sky: [
    'bg-sky-50',
    'bg-sky-100',
    'bg-sky-200',
    'bg-sky-300',
    'bg-sky-400',
    'bg-sky-500',
    'bg-sky-600',
    'bg-sky-700',
    'bg-sky-800',
    'bg-sky-900',
    'bg-sky-950',
  ],
  Blue: [
    'bg-blue-50',
    'bg-blue-100',
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
    'bg-blue-950',
  ],
  Indigo: [
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-indigo-200',
    'bg-indigo-300',
    'bg-indigo-400',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-700',
    'bg-indigo-800',
    'bg-indigo-900',
    'bg-indigo-950',
  ],
  Violet: [
    'bg-violet-50',
    'bg-violet-100',
    'bg-violet-200',
    'bg-violet-300',
    'bg-violet-400',
    'bg-violet-500',
    'bg-violet-600',
    'bg-violet-700',
    'bg-violet-800',
    'bg-violet-900',
    'bg-violet-950',
  ],
  Purple: [
    'bg-purple-50',
    'bg-purple-100',
    'bg-purple-200',
    'bg-purple-300',
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-700',
    'bg-purple-800',
    'bg-purple-900',
    'bg-purple-950',
  ],
  Fuchsia: [
    'bg-fuchsia-50',
    'bg-fuchsia-100',
    'bg-fuchsia-200',
    'bg-fuchsia-300',
    'bg-fuchsia-400',
    'bg-fuchsia-500',
    'bg-fuchsia-600',
    'bg-fuchsia-700',
    'bg-fuchsia-800',
    'bg-fuchsia-900',
    'bg-fuchsia-950',
  ],
  Pink: [
    'bg-pink-50',
    'bg-pink-100',
    'bg-pink-200',
    'bg-pink-300',
    'bg-pink-400',
    'bg-pink-500',
    'bg-pink-600',
    'bg-pink-700',
    'bg-pink-800',
    'bg-pink-900',
    'bg-pink-950',
  ],
  Rose: [
    'bg-rose-50',
    'bg-rose-100',
    'bg-rose-200',
    'bg-rose-300',
    'bg-rose-400',
    'bg-rose-500',
    'bg-rose-600',
    'bg-rose-700',
    'bg-rose-800',
    'bg-rose-900',
    'bg-rose-950',
  ],
};
const HEX_COLORS: { [key: string]: string } = {
  'bg-white': '#FFFFFF',
  'bg-black': '#000000',
  'bg-slate-50': '#F8FAFC',
  'bg-slate-100': '#F1F5F9',
  'bg-slate-200': '#E2E8F0',
  'bg-slate-300': '#CBD5E1',
  'bg-slate-400': '#94A3B8',
  'bg-slate-500': '#64748B',
  'bg-slate-600': '#475569',
  'bg-slate-700': '#334155',
  'bg-slate-800': '#1E293B',
  'bg-slate-900': '#0F172A',
  'bg-slate-950': '#0A142F',
  'bg-gray-50': '#F9FAFB',
  'bg-gray-100': '#F3F4F6',
  'bg-gray-200': '#E5E7EB',
  'bg-gray-300': '#D1D5DB',
  'bg-gray-400': '#9CA3AF',
  'bg-gray-500': '#6B7280',
  'bg-gray-600': '#4B5563',
  'bg-gray-700': '#374151',
  'bg-gray-800': '#1F2937',
  'bg-gray-900': '#111827',
  'bg-gray-950': '#0F172A',
  'bg-zinc-50': '#FAFAF9',
  'bg-zinc-100': '#F4F4F5',
  'bg-zinc-200': '#E4E4E7',
  'bg-zinc-300': '#D4D4D8',
  'bg-zinc-400': '#A1A1AA',
  'bg-zinc-500': '#71717A',
  'bg-zinc-600': '#52525B',
  'bg-zinc-700': '#3F3F46',
  'bg-zinc-800': '#27272A',
  'bg-zinc-900': '#18181B',
  'bg-zinc-950': '#09090B',
  'bg-neutral-50': '#FAFAFA',
  'bg-neutral-100': '#F5F5F5',
  'bg-neutral-200': '#E5E5E5',
  'bg-neutral-300': '#D4D4D4',
  'bg-neutral-400': '#A3A3A3',
  'bg-neutral-500': '#737373',
  'bg-neutral-600': '#525252',
  'bg-neutral-700': '#404040',
  'bg-neutral-800': '#262626',
  'bg-neutral-900': '#171717',
  'bg-neutral-950': '#0A0A0A',
  'bg-stone-50': '#FAFAF9',
  'bg-stone-100': '#F5F5F4',
  'bg-stone-200': '#E7E5E4',
  'bg-stone-300': '#D6D3D1',
  'bg-stone-400': '#A8A29E',
  'bg-stone-500': '#78716C',
  'bg-stone-600': '#57534E',
  'bg-stone-700': '#44403C',
  'bg-stone-800': '#292524',
  'bg-stone-900': '#1C1917',
  'bg-stone-950': '#0A0908',
  'bg-red-50': '#FEF2F2',
  'bg-red-100': '#FEE2E2',
  'bg-red-200': '#FECACA',
  'bg-red-300': '#FCA5A5',
  'bg-red-400': '#F87171',
  'bg-red-500': '#EF4444',
  'bg-red-600': '#DC2626',
  'bg-red-700': '#B91C1C',
  'bg-red-800': '#991B1B',
  'bg-red-900': '#7F1D1D',
  'bg-red-950': '#450B0B',
  'bg-orange-50': '#FFF7ED',
  'bg-orange-100': '#FFEDD5',
  'bg-orange-200': '#FED7AA',
  'bg-orange-300': '#FDBA74',
  'bg-orange-400': '#FB923C',
  'bg-orange-500': '#F97316',
  'bg-orange-600': '#EA580C',
  'bg-orange-700': '#C2410C',
  'bg-orange-800': '#9A3412',
  'bg-orange-900': '#7C2D12',
  'bg-orange-950': '#431606',
  'bg-amber-50': '#FFFBEB',
  'bg-amber-100': '#FEF3C7',
  'bg-amber-200': '#FDE68A',
  'bg-amber-300': '#FCD34D',
  'bg-amber-400': '#FBBF24',
  'bg-amber-500': '#F59E0B',
  'bg-amber-600': '#D97706',
  'bg-amber-700': '#B45309',
  'bg-amber-800': '#92400E',
  'bg-amber-900': '#78350F',
  'bg-amber-950': '#451A03',
  'bg-yellow-50': '#FEFCE8',
  'bg-yellow-100': '#FEF9C3',
  'bg-yellow-200': '#FEF08A',
  'bg-yellow-300': '#FDE047',
  'bg-yellow-400': '#FACC15',
  'bg-yellow-500': '#EAB308',
  'bg-yellow-600': '#A16200',
  'bg-yellow-700': '#854D0E',
  'bg-yellow-800': '#713F12',
  'bg-yellow-900': '#65301B',
  'bg-yellow-950': '#3E1B07',
  'bg-lime-50': '#F7FEE8',
  'bg-lime-100': '#ECFCCB',
  'bg-lime-200': '#D9F99D',
  'bg-lime-300': '#BEF264',
  'bg-lime-400': '#A3E635',
  'bg-lime-500': '#84CC16',
  'bg-lime-600': '#65A30D',
  'bg-lime-700': '#4D7C0F',
  'bg-lime-800': '#3F6212',
  'bg-lime-900': '#365314',
  'bg-lime-950': '#1A2E05',
  'bg-green-50': '#ECFDF5',
  'bg-green-100': '#D1FAE5',
  'bg-green-200': '#A7F3D0',
  'bg-green-300': '#6EE7B7',
  'bg-green-400': '#4ADE80',
  'bg-green-500': '#22C55E',
  'bg-green-600': '#16A34A',
  'bg-green-700': '#15803D',
  'bg-green-800': '#1B552F',
  'bg-green-900': '#174B26',
  'bg-green-950': '#0D2415',
  'bg-emerald-50': '#ECFDFB',
  'bg-emerald-100': '#D1FAE5',
  'bg-emerald-200': '#A7F3D0',
  'bg-emerald-300': '#6EE7B7',
  'bg-emerald-400': '#4ADE80',
  'bg-emerald-500': '#22C55E',
  'bg-emerald-600': '#16A34A',
  'bg-emerald-700': '#15803D',
  'bg-emerald-800': '#136633',
  'bg-emerald-900': '#11542A',
  'bg-emerald-950': '#0A3C1C',
  'bg-teal-50': '#F0FDFA',
  'bg-teal-100': '#CCFBF1',
  'bg-teal-200': '#99F6E4',
  'bg-teal-300': '#5EEAD4',
  'bg-teal-400': '#2DD4BF',
  'bg-teal-500': '#14B8A6',
  'bg-teal-600': '#0D9488',
  'bg-teal-700': '#0F766E',
  'bg-teal-800': '#115E59',
  'bg-teal-900': '#134E4A',
  'bg-teal-950': '#0B3433',
  'bg-cyan-50': '#ECFEFF',
  'bg-cyan-100': '#CFFEFE',
  'bg-cyan-200': '#A5F3FC',
  'bg-cyan-300': '#67E8F9',
  'bg-cyan-400': '#22D3EE',
  'bg-cyan-500': '#06B6D4',
  'bg-cyan-600': '#0891B2',
  'bg-cyan-700': '#0E7490',
  'bg-cyan-800': '#155E75',
  'bg-cyan-900': '#164E63',
  'bg-cyan-950': '#0E3B4B',
  'bg-sky-50': '#F0F9FF',
  'bg-sky-100': '#E0F2FE',
  'bg-sky-200': '#BAE6FD',
  'bg-sky-300': '#7DD3FC',
  'bg-sky-400': '#38BDF8',
  'bg-sky-500': '#0EA5E9',
  'bg-sky-600': '#0284C7',
  'bg-sky-700': '#0369A1',
  'bg-sky-800': '#075985',
  'bg-sky-900': '#0C4A6E',
  'bg-sky-950': '#082F49',
  'bg-blue-50': '#EFF6FF',
  'bg-blue-100': '#DBEAFE',
  'bg-blue-200': '#BFDBFE',
  'bg-blue-300': '#93C5FD',
  'bg-blue-400': '#60A5FA',
  'bg-blue-500': '#3B82F6',
  'bg-blue-600': '#2563EB',
  'bg-blue-700': '#1D4ED8',
  'bg-blue-800': '#1E40AF',
  'bg-blue-900': '#1E3A8A',
  'bg-blue-950': '#172554',
  'bg-indigo-50': '#EEF2FF',
  'bg-indigo-100': '#E0E7FF',
  'bg-indigo-200': '#C7D2FE',
  'bg-indigo-300': '#A5B4FC',
  'bg-indigo-400': '#818CF8',
  'bg-indigo-500': '#6366F1',
  'bg-indigo-600': '#4F46E5',
  'bg-indigo-700': '#4338CA',
  'bg-indigo-800': '#3730A3',
  'bg-indigo-900': '#312E81',
  'bg-indigo-950': '#1D1B41',
  'bg-violet-50': '#F5F3FF',
  'bg-violet-100': '#EDE9FE',
  'bg-violet-200': '#DDD6FE',
  'bg-violet-300': '#C4B5FD',
  'bg-violet-400': '#A78BFA',
  'bg-violet-500': '#8B5CF6',
  'bg-violet-600': '#7C3AED',
  'bg-violet-700': '#6D28D9',
  'bg-violet-800': '#5B21B6',
  'bg-violet-900': '#4C1D95',
  'bg-violet-950': '#32136B',
  'bg-purple-50': '#FAF5FF',
  'bg-purple-100': '#F3E8FF',
  'bg-purple-200': '#E9D5FF',
  'bg-purple-300': '#D8B4F8',
  'bg-purple-400': '#C084FC',
  'bg-purple-500': '#A855F7',
  'bg-purple-600': '#9333EA',
  'bg-purple-700': '#7E22CE',
  'bg-purple-800': '#6B21A8',
  'bg-purple-900': '#581C87',
  'bg-purple-950': '#44156D',
  'bg-fuchsia-50': '#FDF4FF',
  'bg-fuchsia-100': '#FAE8FF',
  'bg-fuchsia-200': '#F5D0FE',
  'bg-fuchsia-300': '#F0ABFC',
  'bg-fuchsia-400': '#E879F9',
  'bg-fuchsia-500': '#D946EF',
  'bg-fuchsia-600': '#C026D3',
  'bg-fuchsia-700': '#A21CAF',
  'bg-fuchsia-800': '#86198F',
  'bg-fuchsia-900': '#701A75',
  'bg-fuchsia-950': '#4D0F57',
  'bg-pink-50': '#FDF2F8',
  'bg-pink-100': '#FCE7F3',
  'bg-pink-200': '#FBCFE8',
  'bg-pink-300': '#F9A8D4',
  'bg-pink-400': '#F472B6',
  'bg-pink-500': '#EC4899',
  'bg-pink-600': '#DB2777',
  'bg-pink-700': '#BE185D',
  'bg-pink-800': '#9D174D',
  'bg-pink-900': '#831843',
  'bg-pink-950': '#520C32',
  'bg-rose-50': '#FFF1F2',
  'bg-rose-100': '#FFE4E6',
  'bg-rose-200': '#FECDD3',
  'bg-rose-300': '#FDA4AF',
  'bg-rose-400': '#FBB6CE',
  'bg-rose-500': '#F43F5E',
  'bg-rose-600': '#E11D48',
  'bg-rose-700': '#BE123C',
  'bg-rose-800': '#9F1239',
  'bg-rose-900': '#881337',
  'bg-rose-950': '#540A2D',
};

const BackgroundPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  setShowColorPicker,
  lineEdit = false,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorPick = (color: string) => {
    if (lineEdit) {
      if (HEX_COLORS[color]) {
        const hexColor = HEX_COLORS[color];
        onColorChange(hexColor);
      } else {
        console.warn(`A cor ${color} não está definida em HEX_COLORS.`);
      }
    } else {
      onColorChange(color);
      setShowColorPicker(false);
      setSelectedColor(null);
    }
  };

  return (
    <div className="relative p-2 top-2">
      {/* Menu inicial para escolher a cor básica */}
      <Toolbar.Root
        className={`flex flex-wrap gap-1  ${
          lineEdit ? '' : '-top-[80%] -right-[90%]'
        } bg-white border border-zinc-300 rounded-lg p-2 ${
          lineEdit ? 'w-full' : 'w-40'
        }   transition-all duration-300`}
      >
        {Object.entries(COLORS).map(([colorName, colorShades]) => (
          <Toolbar.Button
            key={colorName}
            onClick={() => setSelectedColor(colorName)}
            className={`w-5 h-5 grow basis-5 border border-gray-300 hover:opacity-75 transition-opacity ${
              colorName == 'Black'
                ? colorShades[0]
                : colorName == 'White'
                ? colorShades[0]
                : colorShades[4]
            }`} // Cor intermediária como preview
          />
        ))}
      </Toolbar.Root>

      {/* Menu de tons da cor selecionada */}
      {selectedColor && (
        <Toolbar.Root
          className={`w-40 fixed  ${
            lineEdit ? ' -left-[105%] bottom-0' : 'bottom-2 right-2'
          }  bg-gray-100 border border-zinc-300 rounded-lg p-2 shadow-md flex flex-col gap-1 transition-all duration-300`}
        >
          <div className="font-bold mb-2 text-center w-full">
            {selectedColor}
          </div>
          {COLORS[selectedColor].map((shade, index) => (
            <Toolbar.Button
              key={shade}
              onClick={() => handleColorPick(shade)}
              className={`flex items-center justify-between rounded w-full border border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-100 px-2`}
            >
              {selectedColor === 'Black' || selectedColor === 'White' ? null : (
                <>
                  <div className="text-xs">
                    {index === 9
                      ? 900
                      : index === 10
                      ? 950
                      : index * 100 + (index === 0 ? 50 : 0)}
                  </div>
                  <span> - </span>
                </>
              )}
              <div className={`w-full h-5 ${shade}`}></div>
            </Toolbar.Button>
          ))}
        </Toolbar.Root>
      )}
    </div>
  );
};

export default BackgroundPicker;
