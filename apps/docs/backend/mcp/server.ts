import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { getComponent, getGuide, getProps, getTokens, getVersions, listComponents, search } from '../../content/query.ts';
import { GUIDE_STATUSES, PROP_FIELDS, SECTION_KEYS, TOKEN_CATEGORIES } from '../../content/schema.ts';

// 도구 이름·설명·입력은 Agent/mcp-spec.md의 규격이에요. 하네스의 스킬이 이 이름에 의존해요.
// 허용 값은 zod enum 대신 조회 계층에서 검사해요. 틀린 값에 `allowed`가 담긴 오류를 돌려주기 위해서예요.
const reply = (result: object) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(result) }],
  ...('error' in result ? { isError: true } : {}),
});
const annotations = { readOnlyHint: true };
const name = z.string().describe('컴포넌트 이름 (예: Button)');

export const mcpHandler = createMcpHandler(
  server => {
    server.registerTool(
      'list_components',
      {
        description: 'ELI 컴포넌트의 목록을 돌려줘요. 어떤 컴포넌트가 있는지 찾을 때 가장 먼저 써요. 사용법은 get_component로 읽어요. status가 stable이면 승인된 가이드가 있어요. draft나 null이면 가이드 섹션이 없어요.',
        inputSchema: { status: z.string().optional().describe(`${GUIDE_STATUSES.join(', ')}. 그 상태의 컴포넌트만 돌려줘요`) },
        annotations,
      },
      input => reply(listComponents(input)),
    );
    server.registerTool(
      'get_component',
      {
        description: '컴포넌트 하나의 문서를 섹션 단위로 돌려줘요. 필요한 섹션만 요청해요. 고를 때는 when-to-use, 코드를 쓸 때는 examples, 점검할 때는 do-dont를 읽어요. props는 get_props로 읽어요.',
        inputSchema: { name, sections: z.array(z.string()).optional().describe(`${SECTION_KEYS.join(', ')} 중에서 골라요. 생략하면 summary, when-to-use`) },
        annotations,
      },
      input => reply(getComponent(input)),
    );
    server.registerTool(
      'get_props',
      {
        description: '컴포넌트의 props를 타입, 필수 여부, 기본값, 설명과 함께 돌려줘요. 코드에 props를 쓰기 전에 확인해요. 쓸 prop을 알면 names로 좁혀요.',
        inputSchema: {
          name,
          names: z.array(z.string()).optional().describe('읽을 prop 이름. 생략하면 모든 prop'),
          fields: z.array(z.string()).optional().describe(`${PROP_FIELDS.join(', ')} 중에서 골라요. 생략하면 전부. 이름과 타입만 훑을 때는 ["type"]`),
        },
        annotations,
      },
      input => reply(getProps(input)),
    );
    server.registerTool(
      'search',
      {
        description: '컴포넌트 문서와 가이드에서 낱말을 찾아요. 필요한 컴포넌트의 이름을 모를 때 써요. 결과의 id로 get_component나 get_guide를 불러요.',
        inputSchema: { q: z.string().describe('2자 이상 100자 이하'), limit: z.number().optional().describe('기본 5, 1 이상 20 이하') },
        annotations,
      },
      input => reply(search(input)),
    );
    server.registerTool(
      'get_tokens',
      {
        description: 'ELI 디자인 토큰을 분류별로 돌려줘요. 색, 글자, 간격 값을 기억으로 쓰지 않고 여기서 확인해요. category를 생략하면 값 없이 분류와 구역 이름만 돌려줘요.',
        inputSchema: {
          category: z.string().optional().describe(TOKEN_CATEGORIES.join(', ')),
          group: z.string().optional().describe('구역 이름 (예: Foreground). 그 구역만 돌려줘요'),
          q: z.string().optional().describe('토큰 이름에 들어 있는 낱말 (예: brand)'),
        },
        annotations,
      },
      input => reply(getTokens(input)),
    );
    server.registerTool(
      'get_guide',
      {
        description: '설치, 폰트 설정, 디자인 시스템 페이지 구성, 점검 규칙, 아이콘 규칙 같은 공통 가이드를 돌려줘요. topic을 생략하면 가이드 목록을 돌려줘요.',
        inputSchema: { topic: z.string().optional().describe('가이드 주제 (예: install)') },
        annotations,
      },
      input => reply(getGuide(input)),
    );
    server.registerTool(
      'get_versions',
      { description: '이 서버가 설명하는 ELI UI 콘텐츠의 버전과 지원하는 가장 낮은 하네스 버전을 돌려줘요. 프로젝트가 쓰는 버전이 최신인지 확인할 때 써요.', annotations },
      () => reply(getVersions()),
    );
  },
  { serverInfo: { name: 'eli-docs', version: getVersions().ui.docs } },
);
