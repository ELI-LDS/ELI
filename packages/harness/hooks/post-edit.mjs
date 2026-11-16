#!/usr/bin/env node
// PostToolUse 훅: 에이전트가 방금 고친 화면 파일에 직접 쓴 색상 값이 있으면 알려요.
// 표준 입력으로 받은 JSON의 tool_input.file_path를 읽고, 찾으면 표준 오류에 쓰고 종료 코드 2로 끝나요.
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const UI_FILE = /\.(css|scss|tsx|jsx|vue|svelte)$/;
// shortcut: 색상 값만 찾아요. 간격·글자 값은 1px 테두리 같은 오탐이 많아서 /eli-verify가 맡아요.
const RAW_COLOR = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])|\b(?:rgb|hsl)a?\(/i;

export function findRawColors(filePath, text) {
  // shortcut: 이름에 token이 들어간 파일을 토큰 파일로 봐요. 다른 이름을 쓰는 프로젝트가 생기면 DESIGN.md의 경로를 읽어요.
  if (!UI_FILE.test(filePath) || /token/i.test(basename(filePath)) || filePath.includes('node_modules')) return [];
  return text
    .split('\n')
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter(({ text }) => RAW_COLOR.test(text));
}

if (import.meta.main) {
  try {
    const filePath = JSON.parse(readFileSync(0, 'utf8')).tool_input?.file_path;
    const found = filePath ? findRawColors(filePath, readFileSync(filePath, 'utf8')) : [];
    if (found.length > 0) {
      const lines = found.slice(0, 5).map(({ line, text }) => `  ${filePath}:${line}  ${text.slice(0, 80)}`);
      process.stderr.write(
        `ELI 하네스: 직접 쓴 색상 값이 ${found.length}곳 있어요. 프로젝트 토큰으로 바꿔요. 맞는 토큰이 없으면 토큰 파일에 먼저 추가해요.\n${lines.join('\n')}\n`,
      );
      process.exit(2);
    }
  } catch {
    // 입력이 없거나 파일을 읽지 못하면 조용히 넘어가요. 훅이 작업을 막으면 안 돼요.
  }
}
