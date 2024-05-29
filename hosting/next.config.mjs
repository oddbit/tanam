/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/signin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
