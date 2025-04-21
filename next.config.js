// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//       images: {
//         deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//         remotePatterns: [
//           {
//             protocol: 'https',
//             hostname: 'fastly.picsum.photos',
//             port: '',
//             pathname: '/id/**',
//             search: '',
//           },

       
//         ],
//     },
// };

// export default nextConfig;


// module.exports = {
//   images: {
//     remotePatterns: [new URL('https://images.pexels.com/**')],
//   },
// }

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/system/**',
        search: '',
      },
    ],
  },
}


