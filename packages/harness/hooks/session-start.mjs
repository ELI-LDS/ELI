#!/usr/bin/env node
// SessionStart 훅: 프로젝트가 ELI를 쓰면 짧은 지침을 표준 출력으로 내보내요.
// 에이전트는 이 출력을 세션 컨텍스트에 넣어요. 쓰지 않는 프로젝트에서는 아무것도 출력하지 않아요.
import { lstatSync, readFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

/** 소스 설치는 npm 의존성 대신 설정·설치 기록의 실제 진입 파일로 확인해요. 네트워크는 사용하지 않아요. */
function sourceState(dir) {
  let config;
  try { config = JSON.parse(readFileSync(join(dir, '.eli/config.json'), 'utf8')); } catch { return null; }
  try {
    const record = JSON.parse(readFileSync(join(dir, '.eli/lock.json'), 'utf8'));
    if (config.schemaVersion !== 1 || record.schemaVersion !== 1 || record.mode !== 'source' || record.version !== config.version || record.registry !== config.registry || record.registrySha256 !== config.registrySha256 || record.directory !== config.directory || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(record.version) || !Array.isArray(record.entries) || !Array.isArray(record.files)) throw new Error('invalid source record');
    const root = resolve(dir);
    const paths = new Set(record.files.map(file => file.path));
    for (const entry of record.entries) {
      if (typeof entry.path !== 'string' || !entry.path.startsWith(`${config.directory}/`) || !entry.path.split('/').every(part => /^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$/.test(part) && !part.endsWith('.')) || !resolve(root, entry.path).startsWith(`${root}${sep}`) || !paths.has(entry.path)) throw new Error('invalid source entry');
      let file = root;
      for (const part of entry.path.split('/')) {
        file = join(file, part);
        if (lstatSync(file).isSymbolicLink()) throw new Error('symlink source entry');
      }
      if (!lstatSync(file).isFile()) throw new Error('missing source entry');
    }
    return { version: record.version, valid: true };
  } catch { return { valid: false }; }
}

const INSTRUCTIONS = `ELI 하네스: 이 프로젝트는 ELI를 써요.
- UI나 디자인을 만들거나 고치기 전에 eli-docs MCP에서 해당 컴포넌트 문서를 읽어요. list_components로 찾고 get_component로 필요한 섹션만 읽어요.
- props, 토큰 값, 컴포넌트 이름을 기억으로 추측하지 않아요. get_props와 get_tokens로 확인해요.
- 색, 간격, 글자, 모서리 값은 예외 없이 프로젝트의 토큰으로만 써요. 값을 직접 쓰지 않아요. 필요한 토큰이 없으면 토큰 파일에 먼저 추가해요. 토큰 파일이 없으면 /eli-design-system으로 먼저 만들어요.
- 화면의 기본은 중립색이에요. 브랜드 색으로 채운 요소는 한 화면에 주요 버튼 하나이고, 보조 버튼·제목·아이콘·카드에 브랜드 색을 쓰지 않아요. 테두리는 필요한 곳에만 쓰고, 버튼만 감싼 면이나 겹겹이 쌓인 배경을 만들지 않아요. 토큰에 있다고 어디에나 쓰지 않아요.
- 주요 버튼의 기본은 일반 버튼이에요. 떠 있는 버튼은 모바일의 목록·피드 화면에서 새 항목을 만드는 행동 하나에만 써요. 모바일 화면에는 큰 단계의 글자·간격 토큰을 쓰지 않아요.
- 전역 글꼴은 Pretendard로 고정이에요. 다른 글꼴을 넣거나 font-family, letter-spacing을 따로 쓰지 않아요.
- 설치한 ELI 컴포넌트는 이 프로젝트의 것이에요. 실제 화면에서 맞지 않으면 다듬고, 일부 상황에서만 다른 모양이 필요하면 복사해서 변형을 만들어요. 만들기 전에 DESIGN.md의 컴포넌트 표를 보고, 만든 뒤에는 거기에 적어요. 기준은 eli 스킬의 references/evolution.md예요.
- 프로젝트 루트에 DESIGN.md가 있으면 먼저 읽고 따라요. CSS 단위는 DESIGN.md의 단위 기준에서 골라요. 아이콘을 만들 때는 ICON.md도 읽어요.
- CSS, 마크업, React 코드를 쓰기 전에 eli 스킬의 "화면 코드를 잘 써요"와 references 문서를 읽어요.
- 화면에 보이는 문구는 예외 없이 UX-WRITING.md의 말투와 용어로 써요. 문구를 쓰기 전에 읽어요. 없으면 /eli-ux-writing으로 먼저 만들어요.
- eli-docs MCP 도구가 세션에 보이지 않아도 멈추거나 추측하지 않아요. 이 훅과 같은 폴더의 eli-docs.mjs로 같은 문서를 읽어요(node <훅 폴더>/eli-docs.mjs <도구 이름> '<JSON 입력>'). 등록 방법은 eli 스킬의 "원격 MCP에 연결해요"에 있어요.
- 명령: /eli-setup, /eli-doctor, /eli-design-md, /eli-design-system, /eli-verify, /eli-icon, /eli-ux-writing, /eli-update`;

// shortcut: 루트 package.json만 확인해요. 모노레포의 하위 워크스페이스만 @eli-design/ui를 쓰는 경우가 생기면 워크스페이스도 확인해요.
function usesEli(dir) {
  if (sourceState(dir)) return true;
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    return ['dependencies', 'devDependencies', 'peerDependencies'].some(
      (field) => pkg[field] && '@eli-design/ui' in pkg[field],
    );
  } catch {
    return false; // package.json이 없거나 깨져 있으면 조용히 넘어가요. 훅이 세션 시작을 막으면 안 돼요.
  }
}

const NOT_SET_UP = `- 이 프로젝트는 아직 ELI를 셋업하지 않았어요(DESIGN.md가 없어요). 사용자가 UI나 디자인 작업을 요청하면 먼저 /eli-setup으로 셋업하자고 제안해요. 셋업은 서비스 기획, 디자인 레퍼런스, 브랜드 컬러 세 질문을 질문 도구(Claude Code는 AskUserQuestion, Codex는 request_user_input_async)로 반드시 묻고, 사용자의 답을 받기 전에는 문서·토큰·페이지를 만들지 않아요.`;

const dir = process.cwd();
// 훅이 프로젝트 안에 설치되어 있으면 @eli-design/ui를 아직 설치하지 못했어도 ELI를 쓰는 프로젝트예요.
const installedInProject = import.meta.dirname.startsWith(`${dir}${sep}`);

const STALE_DAYS = 14;

// DESIGN.md의 "마지막으로 확인한 날짜"를 읽어요. 네트워크를 쓰지 않아요. 실제 확인은 /eli-update가 해요.
function versionNotice(designMd, now = Date.now()) {
  const date = designMd.match(/마지막으로 확인한 날짜\s*\|\s*(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!date) return '- DESIGN.md에 버전 기록이 없어요. 작업을 마친 뒤 /eli-update로 쓰는 버전과 확인한 날짜를 기록하자고 안내해요.';
  const days = Math.floor((now - Date.parse(date)) / 86_400_000);
  if (!(days > STALE_DAYS)) return '';
  return `- ELI 버전을 마지막으로 확인한 지 ${days}일 지났어요(${date}). 사용자에게 알리고 /eli-update로 하네스·UI 콘텐츠의 새 버전이 있는지 각각 확인해요.`;
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
  const harness = read('.eli/harness.json');
  if (harness) {
    try {
      const record = JSON.parse(harness);
      if (record.schemaVersion !== 1 || record.kind !== 'harness' || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(record.version) || !Array.isArray(record.agents)) throw new Error('invalid harness record');
      const notices = [];
      for (const agent of record.agents) {
        const path = agent === 'claude' ? '.claude/skills/eli/VERSION' : agent === 'codex' ? '.agents/skills/eli/VERSION' : null;
        if (!path) throw new Error('invalid agent');
        if (read(path)?.trim() !== record.version) notices.push(`- ${agent} 하네스의 버전 파일이 설치 기록과 달라요. eli-design status로 확인해요.`);
      }
      return notices.join('\n');
    } catch { return '- 하네스 설치 기록을 읽을 수 없어요. eli-design status로 확인해요.'; }
  }
  const manifest = read('node_modules/@eli-design/ui/package.json');
  const copied = (read('.claude/skills/eli/VERSION') ?? read('.agents/skills/eli/VERSION'))?.trim();
  if (!manifest || !copied) return '';
  let installed;
  const packagedSkills = read('node_modules/@eli-design/ui/harness/skills/eli/VERSION')?.trim();
  try {
    installed = packagedSkills ?? JSON.parse(manifest).version;
  } catch {
    return '';
  }
  if (installed === copied) return '';
  if (packagedSkills) return `- 패키지의 하네스는 ${installed}인데 프로젝트에 복사된 스킬은 ${copied}예요. /eli-update로 확인해요.`;
  return `- 설치된 @eli-design/ui는 ${installed}인데 프로젝트에 복사된 스킬은 ${copied}예요. /eli-update로 스킬과 훅을 다시 복사해요.`;
}

if (installedInProject || usesEli(dir)) {
  let designMd = null;
  try {
    designMd = readFileSync(join(dir, 'DESIGN.md'), 'utf8');
  } catch {
    // DESIGN.md가 없으면 아직 셋업하지 않은 프로젝트예요.
  }
  const source = sourceState(dir);
  const sourceNotice = source ? source.valid
    ? `- UI는 소스 방식으로 설치되어 있어요(콘텐츠 ${source.version}). .eli/lock.json의 entries에서 실제 로컬 import를 확인하고 eli-design status로 파일 상태를 확인해요. 전체 @eli-design/ui를 추가하지 않아요.`
    : '- UI 소스 설정은 있지만 설치 기록이나 진입 파일을 확인하지 못했어요. eli-design status로 확인하고 설치를 완료했다고 추측하지 않아요.' : '';
  const extra = [sourceNotice, designMd === null ? NOT_SET_UP : versionNotice(designMd), skillsNotice(dir)].filter(Boolean);
  process.stdout.write(`${[INSTRUCTIONS, ...extra].join('\n')}\n`);
}
