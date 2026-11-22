# 엘리 설치 안내

이 문서는 AI 에이전트가 읽고 실행해요. 엘리의 스킬과 훅을 사용자의 프로젝트에 설치하거나, 새 버전으로 다시 설치할 때 따라요. 순서대로 진행하고, 건너뛴 단계는 마지막 보고에 적어요.

## 하네스 폴더

npm에 게시된 CLI는 `npx eli-design@latest harness --agent claude`, `--agent codex` 또는 `--agent all`로 전체 스킬·훅 복사와 설정 병합을 함께 처리해요. 저장소에서는 `pnpm build:harness`, `pnpm build:cli` 후 `node packages/cli/dist/cli.mjs harness --registry <ELI 저장소 절대 경로>/.artifacts/harness --agent <선택> --cwd <프로젝트>`로 확인해요. `--dry-run`으로 쓰기 전 계획을 볼 수 있어요.

CLI로 설치했다면 `eli.harness.json`과 `eli-design status --json`으로 결과를 확인하고 아래 수동 복사를 반복하지 않아요. 스킬은 Claude Code의 `.claude/skills`, Codex의 `.agents/skills`에 있고 훅은 각 프로젝트의 `.claude/hooks/eli`, `.codex/hooks/eli`에 있어요. Codex 훅은 `/hooks`에서 사용자가 확인하고 신뢰해야 실행돼요. 원격 MCP 설정은 별도예요.

기존 `@eli-design/ui`는 종료 예정이며 신규 설치에 사용하지 않아요. 아래 수동 절차는 이미 설치된 이전 패키지를 점검하거나 개발용 원본에서 직접 설치할 때만 적용해요. 소스로 설치된 UI를 인식하는 기준은 `skills/eli/references/installation.md`를 따라요.

이 문서가 들어 있는 폴더가 하네스 폴더예요. 아래에서 `<하네스 폴더>`라고 불러요.

| 받은 방법 | 하네스 폴더 |
| --- | --- |
| `@eli-design/ui`를 설치했어요 | `<프로젝트>/node_modules/@eli-design/ui/harness` |
| 저장소를 임시 폴더에 받았어요 | `<임시 폴더>/eli/packages/harness` |

기존 패키지에서 받았으면 그 패키지 안의 하네스 폴더를 써요. 하네스 버전은 `skills/eli/VERSION`으로 확인하고 UI 버전과 같다고 가정하지 않아요.

## 1. 프로젝트를 확인해요

- 지금 폴더가 사용자의 프로젝트 루트인지 확인해요. `package.json`이 없으면 어디에 설치할지 물어요.
- 어떤 에이전트로 실행 중인지 확인해요. 설치 위치가 달라요.
- Node.js가 있는지 확인해요. 훅이 Node.js로 실행돼요.

## 2. 스킬을 복사해요

`<하네스 폴더>/skills/` 안의 폴더를 모두 통째로 복사해요. 폴더 안의 `template.md`, `references/`, `fonts.md`, `VERSION`도 함께 복사해요. 스킬끼리 서로의 파일을 읽으므로 일부만 복사하지 않아요.

| 에이전트 | 복사할 위치 |
| --- | --- |
| Claude Code | `<프로젝트>/.claude/skills/` |
| Codex | `<프로젝트>/.agents/skills/` |

- 같은 이름의 폴더가 이미 있으면 프로젝트의 파일과 새 파일을 비교해요. 사용자가 고친 파일이 있으면 무엇이 사라지는지 보여주고 어떻게 할지 물어요. 고친 것이 없으면 덮어써요.
- 저장소를 받아서 설치하는 경우에는 `skills/eli/VERSION` 파일이 없어요. 받은 저장소의 `packages/harness/package.json`에 있는 `version`을 한 줄로 적어 `eli` 스킬 폴더에 `VERSION` 파일로 만들어요.

## 3. 훅을 등록해요

훅은 사용자의 컴퓨터에서 명령을 실행해요. 처음 등록하거나 설정이 바뀔 때는 무엇을 등록하는지 사용자에게 먼저 알려요.

| 훅 | 하는 일 |
| --- | --- |
| `session-start.mjs` | 세션을 시작할 때 짧은 지침을 알려주고, 버전을 확인한 지 오래됐는지 봐요. 파일을 바꾸지 않고 네트워크를 쓰지 않아요 |
| `post-edit.mjs` | 화면 파일을 고친 뒤 직접 쓴 색상 값이 있으면 알려줘요. 파일을 바꾸지 않아요 |

**Claude Code:** `<하네스 폴더>/hooks/`의 두 파일을 `<프로젝트>/.claude/hooks/eli/`에 복사하고, `<프로젝트>/.claude/settings.json`에 아래 내용을 합쳐요. 파일이 이미 있으면 기존 설정을 지우지 않고 `hooks` 안에 더해요. 같은 명령이 이미 등록되어 있으면 다시 추가하지 않아요.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/eli/session-start.mjs", "timeout": 10 }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/eli/post-edit.mjs", "timeout": 10 }
        ]
      }
    ]
  }
}
```

**Codex:** `session-start.mjs`만 `<프로젝트>/.codex/hooks/eli/`에 복사하고, `<프로젝트>/.codex/hooks.json`에 아래 내용을 합쳐요. `post-edit.mjs`는 Codex의 입력 형식을 아직 지원하지 않아서 등록하지 않아요. 등록한 뒤 사용자에게 `/hooks`에서 이 훅을 확인하고 신뢰해 달라고 안내해요. 신뢰하기 전에는 실행되지 않아요.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "node .codex/hooks/eli/session-start.mjs", "timeout": 10 }
        ]
      }
    ]
  }
}
```

훅 파일은 `node_modules` 안의 파일을 직접 가리키지 않고 프로젝트에 복사해서 써요. 의존성을 다시 설치하는 동안에도 훅이 깨지지 않아요.

Codex 명령은 하네스를 설치한 프로젝트 루트에서 실행해요. CLI는 훅 파일 전체를 복사하지만 Codex에는 지원하는 SessionStart만 등록하고 PostToolUse는 등록하지 않아요.

## 4. 컴포넌트 문서 서버를 연결해요

원격 MCP 서버 `eli-docs`는 아직 공개 주소가 없어요. 이 단계는 건너뛰고 사용자에게 알려요. 주소가 정해지면 `eli` 스킬의 "원격 MCP에 연결해요"에 적혀요.

## 5. 정리하고 시작해요

1. 저장소를 임시 폴더에 받았으면 임시 폴더를 지워요.
2. Claude Code에서 `.claude/skills` 폴더를 이번에 새로 만들었으면 사용자에게 `/reload-skills`를 실행해 달라고 안내해요.
3. 처음 설치했으면 `eli-setup` 스킬을 읽고 그대로 진행해요. 프로젝트에 화면 코드가 이미 있으면 4단계(기존 화면 전체 옮기기)까지 진행해요.
4. 다시 설치한 것이면 `DESIGN.md`의 `## 버전`을 실제 버전으로 고쳐요.

## 6. 보고해요

설치한 스킬과 훅, 바꾼 설정 파일, 건너뛴 단계와 그 이유, 확인하지 못한 것을 사용자에게 알려요. 설치하지 않은 것을 설치했다고 적지 않아요.
