/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: 'security',
  },
  // Next.js가 번들하지 않아야 OpenNext가 이 패키지들의 workerd용 빌드를 골라요.
  // 기본 빌드의 스키마 검증기(Ajv)는 코드를 생성해 실행해서 Cloudflare Workers에서 막혀요.
  serverExternalPackages: ['@modelcontextprotocol/server', 'mcp-handler'],
};

export default nextConfig;
