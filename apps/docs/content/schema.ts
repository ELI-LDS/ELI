// 생성 스크립트·조회 계층·MCP가 함께 쓰는 문서 데이터 타입이에요. 규격은 Agent/mcp-spec.md에서 관리해요.

export const SECTION_KEYS = ['summary', 'when-to-use', 'examples', 'variants', 'behavior', 'styling', 'do-dont', 'accessibility', 'related'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

/** 컴포넌트 JSDoc의 `###` 제목을 섹션 키로 바꿔요. 여기에 없는 제목은 생성을 실패시켜요. */
export const JSDOC_HEADINGS: Record<string, SectionKey> = {
  '주요 설정': 'variants',
  '선택 가이드': 'when-to-use',
  '내용과 동작': 'behavior',
  '스타일 변경': 'styling',
};

export const TOKEN_CATEGORIES = ['color', 'semantic-color', 'typography', 'layout'] as const;
export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];

/** 분류와 레지스트리 `tokens` 항목의 파일을 연결해요. */
export const TOKEN_FILES: Record<TokenCategory, string> = {
  color: 'tokens/colors.css',
  'semantic-color': 'tokens/semantic-colors.css',
  typography: 'tokens/typography.css',
  layout: 'tokens/layout.css',
};

export const GUIDE_TOPICS = ['install', 'font', 'design-system-page', 'verify', 'icon'] as const;

export const PROP_FIELDS = ['type', 'required', 'default', 'description'] as const;
export type PropField = (typeof PROP_FIELDS)[number];

export interface Prop {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
}

export interface Component {
  name: string;
  /** 레지스트리 항목 ID예요. 설치 도구의 `add`에 그대로 써요. */
  id: string;
  description: string;
  /** 설치 위치를 기준으로 한 진입 파일과 export 이름이에요. */
  entry: { path: string; export: string };
  sections: Partial<Record<SectionKey, string>>;
  props: Prop[];
  extends: string | null;
}

export interface TokenGroup {
  group: string | null;
  tokens: Record<string, string>;
}

export interface Guide {
  topic: string;
  title: string;
  description: string;
  body: string;
}

export interface Content {
  /** 이 데이터가 설명하는 UI 콘텐츠(레지스트리) 버전이에요. */
  version: string;
  harnessMinimum: string;
  components: Component[];
  tokens: Record<TokenCategory, TokenGroup[]>;
  guides: Guide[];
}
