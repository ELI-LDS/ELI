#!/usr/bin/env node
// SessionStart 훅: 프로젝트가 ELI를 쓰면 짧은 지침을 표준 출력으로 내보내요.
// 에이전트는 이 출력을 세션 컨텍스트에 넣어요. 쓰지 않는 프로젝트에서는 아무것도 출력하지 않아요.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const INSTRUCTIONS = `ELI 하네스: 이 프로젝트는 ELI를 써요.
- UI나 디자인을 만들거나 고치기 전에 eli-docs MCP에서 해당 컴포넌트 문서를 읽어요. list_components로 찾고 get_component로 필요한 섹션만 읽어요.
- props, 토큰 값, 컴포넌트 이름을 기억으로 추측하지 않아요. get_props와 get_tokens로 확인해요.
- 색, 간격, 글자, 모서리 값은 예외 없이 프로젝트의 토큰으로만 써요. 값을 직접 쓰지 않아요. 필요한 토큰이 없으면 토큰 파일에 먼저 추가해요. 토큰 파일이 없으면 /eli-design-system으로 먼저 만들어요.
- 프로젝트 루트에 DESIGN.md가 있으면 먼저 읽고 따라요. CSS 단위는 DESIGN.md의 단위 기준에서 골라요. 아이콘을 만들 때는 ICON.md도 읽어요.
- CSS, 마크업, React 코드를 쓰기 전에 eli 스킬의 "화면 코드를 잘 써요"와 references 문서를 읽어요.
- 화면에 보이는 문구는 예외 없이 UX-WRITING.md의 말투와 용어로 써요. 문구를 쓰기 전에 읽어요. 없으면 /eli-ux-writing으로 먼저 만들어요.
- eli-docs MCP가 연결되지 않았으면 추측해서 작업하지 않고, eli 스킬의 연결 방법을 사용자에게 안내해요.
- 명령: /eli-setup, /eli-doctor, /eli-design-md, /eli-design-system, /eli-verify, /eli-icon, /eli-ux-writing, /eli-update`;

// shortcut: 루트 package.json만 확인해요. 모노레포의 하위 워크스페이스만 @eli-design/ui를 쓰는 경우가 생기면 워크스페이스도 확인해요.
function usesEli(dir) {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    return ['dependencies', 'devDependencies', 'peerDependencies'].some(
      (field) => pkg[field] && '@eli-design/ui' in pkg[field],
    );
  } catch {
    return false; // package.json이 없거나 깨져 있으면 조용히 넘어가요. 훅이 세션 시작을 막으면 안 돼요.
  }
}

const NOT_SET_UP = `- 이 프로젝트는 아직 ELI를 셋업하지 않았어요(DESIGN.md가 없어요). 사용자가 UI나 디자인 작업을 요청하면 먼저 /eli-setup으로 셋업하자고 제안해요.`;

const dir = process.cwd();
// 훅이 프로젝트 안에 설치되어 있으면 @eli-design/ui를 아직 설치하지 못했어도 ELI를 쓰는 프로젝트예요.
const installedInProject = import.meta.dirname.startsWith(dir);

const STALE_DAYS = 14;

// DESIGN.md의 "마지막으로 확인한 날짜"를 읽어요. 네트워크를 쓰지 않아요. 실제 확인은 /eli-update가 해요.
function versionNotice(designMd, now = Date.now()) {
  const date = designMd.match(/마지막으로 확인한 날짜\s*\|\s*(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!date) return '- DESIGN.md에 버전 기록이 없어요. 작업을 마친 뒤 /eli-update로 쓰는 버전과 확인한 날짜를 기록하자고 안내해요.';
  const days = Math.floor((now - Date.parse(date)) / 86_400_000);
  if (!(days > STALE_DAYS)) return '';
  return `- ELI 버전을 마지막으로 확인한 지 ${days}일 지났어요(${date}). 사용자에게 알리고 /eli-update로 새 버전이 있는지 확인해요.`;
}

// 스킬은 패키지에서 프로젝트로 복사해 써요. 패키지를 올린 뒤 스킬을 다시 복사하지 않았으면 알려요.
function skillsNotice(dir) {
  const read = (path) => {
    try {
      return readFileSync(join(dir, path), 'utf8');
    } catch {
      return null;
    }
  };
  const manifest = read('node_modules/@eli-design/ui/package.json');
  const copied = (read('.claude/skills/eli/VERSION') ?? read('.agents/skills/eli/VERSION'))?.trim();
  if (!manifest || !copied) return '';
  let installed;
  try {
    installed = JSON.parse(manifest).version;
  } catch {
    return '';
  }
  if (installed === copied) return '';
  return `- 설치된 @eli-design/ui는 ${installed}인데 프로젝트에 복사된 스킬은 ${copied}예요. /eli-update로 스킬과 훅을 다시 복사해요.`;
}

if (installedInProject || usesEli(dir)) {
  let designMd = null;
  try {
    designMd = readFileSync(join(dir, 'DESIGN.md'), 'utf8');
  } catch {
    // DESIGN.md가 없으면 아직 셋업하지 않은 프로젝트예요.
  }
  const extra = [designMd === null ? NOT_SET_UP : versionNotice(designMd), skillsNotice(dir)].filter(Boolean);
  process.stdout.write(`${[INSTRUCTIONS, ...extra].join('\n')}\n`);
}
