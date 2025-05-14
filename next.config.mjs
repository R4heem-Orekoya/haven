/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
         protocol: "https",
         hostname: "images.unsplash.com",
         port: "",
         },
         {
         protocol: "https",
         hostname: "utfs.io",
         port: "",
         },
         {
         protocol: "https",
         hostname: "pgokm0g6hg.ufs.sh",
         pathname: "/f/*",
         port: "",
         },
      ],
   },

      experimental: {
         authInterrupts: true,
      serverActions: {
         bodySizeLimit: "8mb",
      },
   },
};

export default nextConfig;
