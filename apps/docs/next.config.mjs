import { componentRouteAliases } from './frontend/features/docs-catalog/catalog.ts';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 문서의 이전 주소는 렌더링 전에 처리해 중복 Location 응답과 화면 전환을 피하도록 해요.
  async redirects() {
    return Object.entries(componentRouteAliases).map(([previous, current]) => ({
      source: `/components/${previous}`,
      destination: `/components/${current}`,
      permanent: true,
    }));
  },
  experimental: {
    agentUpgrade: 'security',
  },
  // Next.js가 번들하지 않아야 OpenNext가 이 패키지들의 workerd용 빌드를 골라요.
  // 기본 빌드의 스키마 검증기(Ajv)는 코드를 생성해 실행해서 Cloudflare Workers에서 막혀요.
  serverExternalPackages: ['@modelcontextprotocol/server', 'mcp-handler'],
};

export default nextConfig;
