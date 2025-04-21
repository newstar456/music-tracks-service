// import type { Config } from 'tailwindcss';

// const config: Config = {
//   // content: [
//   //   './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//   //   './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//   //   './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   // ],
//   theme: {
//     // container: {
//     //   center: true,
//     //   padding: {
//     //     DEFAULT: '16px',
//     //     // not forget to change for small screens
//     //     sm: '8px',
//     //     md: '16px',
//     //     lg: '24px',
//     //     xl: '24px',
//     //     '2xl': '120px',
//     //   },
//     // },
//     // screens: {
//     //   sm: '320px',
//     //   // => @media (min-width: 320px) { ... }
//     //   md: '375px',
//     //   // => @media (min-width: 375px) { ... }
//     //   lg: '768px',
//     //   // => @media (min-width: 768px) { ... }
//     //   xl: '1024px',
//     //   // => @media (min-width: 1024px) { ... }
//     //   '2xl': '1440px',
//     //   // => @media (min-width: 1440px) { ... }
//     // },
//     colors: {
//       black: '#000',
//       white: '#fff',
//       's-gray': '#363535',
//       's-purple': '#8f8ded',
//       's-light-purple': '#bcbbf9',
//       's-title-home': 'rgb(143, 141, 237)',
//       's-soft-gray': '#4f4e4e', 
//       's-plum': '#5a578c', 
//       's-lavender': '#d7d6fc', 
//     },
//     fontWeight: {
//       light:'300',
//       regular: '400',
//       medium: '500',
//       semibold: '600',
//       bold: '700',
//     },
//     fontSize: {
//       xs: '12px',
//       s: '14px',
//       m: '16px',
//       sm: '18px',
//       md: '20px',
//       l: '24px',
//       lg: '32px',
//       xlg: '42px',
//       xl: '48px',
//       '2xl': '64px',
//       '3xl': '80px',
//       '4xl': '86px',
//     },
//     extend: {
//       // spacing: {
//       //   customLg: 'calc(100% - 320px)',
//       //   custom2xl: 'calc(100% - 346px)',
//       //   height2xl: 'calc(100vh - 107px)',
//       //   heightLg: 'calc(100vh - 100px)',
//       //   heightMobile: 'calc(100vh - 64px)',
//       //   widthXl: 'calc(100% - 343px)',
//       // },
//       // left: {
//       //   125: '125px',
//       //   1143: '1143px',
//       // },
//       // backgroundImage: {
//       //   grid: 'linear-gradient(90deg, rgba(107, 106, 106, 0.6) 1px, transparent 1px), linear-gradient(180deg, rgba(107, 106, 106, 0.6) 1px, transparent 1px)',

//       //   'radial-gradient':
//       //     'radial-gradient(circle, rgba(211,253,80,0.2) 22%, rgba(0, 0, 0, 0) 70%)',

//       //   'radial-gradien':
//       //     'radial-gradient(circle, rgba(211,253,80,0.1) 2%, rgba(0, 0, 0, 0) 70%)',
//       // },
//       // backgroundSize: {
//       //   'grid-90': '90px 90px',
//       //   'grid-80': '80px 80px',
//       //   'grid-20': '48px 48px',
//       //   'grid-30': '30px 30px',
//       //   'grid-40': '40px 40px',
//       //   'grid-41': '41px 41px',
//       // },
//       // fontFamily: {
//       //   'main-family': [
//       //     'var(--font-roboto-mono)',
//       //     'ui-sans-serif',
//       //     'sans-serif',
//       //   ],
//       //   'second-family': ['var(--font-ibm-plex-mono)', 'sans-serif'],
//       //   'third-family': ['var(--font-inter)', 'ui-sans-serif', 'sans-serif'], 
//       //   font4: ['Nunito', 'ui-sans-serif', 'sans-serif'],
//       // },

//       // letterSpacing: {
//       //   'custom-tight': '0.02em',
//       //   's-1': '0.01em',
//       //   's-2': '0.02em',
//       // },
//       // lineHeight: {
//       //   's-16': '16px',
//       //   's-24': '24px',
//       //   's-27': '27px',
//       //   's-30': '30px',
//       //   's-36': '36px',
//       //   's-38': '38px',
//       //   's-48': '48px',
//       //   's-96': '96px',
//       //   's-100': '100%',
//       //   's-120': '120px',
//       //   's-129': '129px',
//       //   'o-120': '120%',
//       //   'o-130': '130%',
//       //   'o-150': '150%',
//       // },

//       // boxShadow: {
//       //   'olga-1': '0px 6.65px 5.32px 0px #8C898907',
//       //   'olga-2': '0px 22.34px 17.87px 0px #8C89890B',
//       //   'olga-3': '0px 100px 80px 0px #8C898912',
//       //   'olga-combined':
//       //     '0px 6.65px 5.32px 0px #8C898907, 0px 22.34px 17.87px 0px #8C89890B, 0px 100px 80px 0px #8C898912',
//       //   '3xl': 'inset 0 10px 10px -10px rgba(0, 0, 0, 0.3)',
//       // },
// // animation: {
// //   'loader': 'loader 1s 0s linear alternate infinite',
// // },
// // keyframes: {
// //   loader: {
// //     '0%': {
// //       boxShadow: '20px 0 #000, -20px 0 #0002',
// //       background: '#000',
// //     },
// //     '33%': {
// //       boxShadow: '20px 0 #000, -20px 0 #0002',
// //       background: '#0002',
// //     },
// //     '66%': {
// //       boxShadow: '20px 0 #0002, -20px 0 #000',
// //       background: '#0002',
// //     },
// //     '100%': {
// //       boxShadow: '20px 0 #0002, -20px 0 #000',
// //       background: '#000',
// //     },
// //   },
// // },

//       keyframes: {
//         'shadow-pulse': {
//           '0%, 100%': { boxShadow: '0 0 0px rgba(0, 0, 0, 0.2)' },
//           '50%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' },
//         },
//       },
//       animation: {
//         'shadow-pulse': 'shadow-pulse 1.5s ease-in-out infinite',
//       },
//       // transitionDuration: {
//       //     DEFAULT: '500ms',
//       //     75: '75ms',
//       //     100: '100ms',
//       //     150: '150ms',
//       //     200: '200ms',
//       //     300: '300ms',
//       //     500: '500ms',
//       //     700: '700ms',
//       //     1000: '1000ms',
//       //     3000: '3000ms',
//       //     5000: '5000ms',
//       // },
//     },
//   },
//   // plugins: [
//   //   function ({
//   //     addUtilities,
//   //   }: {
//   //     addUtilities: (utilities: Record<string, Record<string, string>>) => void;
//   //   }) {
//   //     addUtilities({
//   //       '.text-stroke': {
//   //         '-webkit-text-fill-color': 'black',
//   //         '-webkit-text-stroke': '1px #ffffff',
//   //       },
//   //     });
//   //   },
//   // ],
// };
// export default config;


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '.src/**/*.{js,ts,jsx,tsx, html}',   
  ],
  theme: {
    colors: {
      black: '#000',
      white: '#fff',
      's-gray': '#363535',
      's-purple': '#8f8ded',
      's-light-purple': '#bcbbf9',
      's-title-home': 'rgb(143, 141, 237)',
      's-soft-gray': '#4f4e4e', 
      's-plum': '#5a578c', 
      's-lavender': '#d7d6fc', 
    },
    fontWeight: {
      light:'300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      xs: '12px',
      s: '14px',
      m: '16px',
      sm: '18px',
      md: '20px',
      l: '24px',
      lg: '32px',
      xlg: '42px',
      xl: '48px',
      '2xl': '64px',
      '3xl': '80px',
      '4xl': '86px',
    },
    extend: {
      keyframes: {
        'shadow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(0, 0, 0, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' },
        },
      },
      animation: {
        'shadow-pulse': 'shadow-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
