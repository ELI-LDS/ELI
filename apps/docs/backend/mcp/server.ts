import { createMcpHandler } from 'mcp-handler';

// 도구는 content 조회 계층을 구현한 뒤 등록해요. Agent/docs.md의 도구 표를 기준으로 해요.
export const mcpHandler = createMcpHandler(() => {}, {
  serverInfo: { name: 'eli-docs', version: '0.1.0' },
});
