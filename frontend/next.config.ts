import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "static.canva.com",
      },
      {
        protocol: "https",
        hostname: "static.figma.com",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sstatic.net",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "www.slack-edge.com",
      },
      {
        protocol: "https",
        hostname: "www.trello.com",
      },
      {
        protocol: "https",
        hostname: "www.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.atlassian.com",
      },
      {
        protocol: "https",
        hostname: "d24cgw3uvb9a9h.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "img-prod-cms-rt-microsoft-com.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "zoom.us",
      },
    ],
  },
};

export default nextConfig;
