/** @type {import('tailwindcss').Config} */

import { transform } from 'typescript';

export default {
  darkMode: 'selector',
  import: true,
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        linearLine: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(30%)' },
        },
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        linearLine: 'linearLine 1s linear infinite',
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.arrow-line::after': {
          content: '""',
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: '10px solid black',
        },
      });
    },
  ],
};
