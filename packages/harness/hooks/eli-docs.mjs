#!/usr/bin/env node
// 훅이 아니라 조회 도구예요. 세션에 eli-docs MCP 도구가 보이지 않을 때 같은 서버의 같은 도구를 불러요.
// MCP 서버는 세션을 시작할 때만 불러와서, 방금 등록한 세션에서는 도구가 보이지 않아요.
// 사용: node eli-docs.mjs <도구 이름> ['<JSON 입력>']   예: node eli-docs.mjs get_component '{"name":"Button"}'
// 읽기 전용이에요. 파일을 바꾸지 않고 이 주소 밖으로 요청하지 않아요.
const URL = 'https://eli-design.dev/mcp';

/** Streamable HTTP 응답은 JSON이거나 SSE(`data: {...}`)예요. 도구가 돌려준 텍스트만 꺼내요. */
export function parse(body) {
  const data = body.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).filter(Boolean).at(-1);
  const message = JSON.parse(data ?? body);
  if (message.error) throw new Error(message.error.message);
  return message.result.content.map(item => item.text).join('\n');
}

if (import.meta.main) {
  const [name, input = '{}'] = process.argv.slice(2);
  try {
    if (!name) throw new Error('도구 이름이 필요해요. 예: node eli-docs.mjs list_components');
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: JSON.parse(input) } }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`서버가 ${response.status}로 답했어요.`);
    process.stdout.write(`${parse(await response.text())}\n`);
  } catch (error) {
    // 실패하면 추측해서 작업하지 않도록 이유를 그대로 알려요.
    process.stderr.write(`eli-docs를 읽지 못했어요: ${error.message}\n`);
    process.exit(1);
  }
}
