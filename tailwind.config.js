const plugin = require('tailwindcss/plugin');
const { screens, fontFamily } = require('tailwindcss/defaultTheme');
const { blackA, mauve, red, violet } = require('@radix-ui/colors');

const flip = plugin(function ({ addUtilities }) {
  addUtilities({
    '.flip-x': {
      transform: 'rotateX(180deg)'
    },
    '.flip-y': {
      transform: 'rotateY(180deg)'
    }
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'components/ui/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    './public/**/*.html',
    './node_modules/flowbite-react/**/*.js',
    './App.jsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },

      colors: {
        ...blackA,
        ...mauve,
        ...red,
        ...violet,
        neutral1: 'rgb(254, 254, 254)',
        neutral2: 'rgb(243, 245, 247)',
        neutral3: 'rgb(232, 236, 239)',
        neutral4: 'rgb(108, 114, 117)',
        neutral5: 'rgba(52, 56, 57)',
        neutral6: 'rgb(35, 38, 39)',
        neutral7: 'rgb(20, 23, 24)'
      },
      keyframes: {
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' }
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' }
        },
        keyframes: {
          overlayShow: {
            from: { opacity: 0 },
            to: { opacity: 1 }
          },
          contentShow: {
            from: {
              opacity: 0,
              transform: 'translate(-50%, -48%) scale(0.96)'
            },
            to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
          }
        },
        animation: {
          overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)'
        }
      },
      animation: {
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)'
      },
      backgroundImage: {
        'main-gradient':
          'linear-gradient(90deg, #5B76FF -50.29%, #00E96B 119.88%)'
      }
    },

    screens: {
      xs: '400px',
      // Change how the list of files is displayed on small screens
      'table-layout': '700px',
      ...screens,
      touch: { raw: '(hover: none)' }
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant('children', '&>*');
      addVariant('children-odd', '&>*:nth-child(odd)');
      addVariant('children-even', '&>*:nth-child(even)');
    },
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    }),
    flip
  ]
};
