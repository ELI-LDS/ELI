import { createMcpHandler } from 'mcp-handler';

// 도구는 content 조회 계층을 구현한 뒤 등록해요. Agent/mcp-spec.md의 규격을 따라요.
export const mcpHandler = createMcpHandler(() => {}, {
  serverInfo: { name: 'eli-docs', version: '0.1.0' },
});
