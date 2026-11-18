# ELI 선택 설치 데이터

기존 컴포넌트 소스에서 CLI용 JSON을 만드는 비공개 배포 도구 영역이에요. npm 패키지나 CLI 실행 파일이 아니에요.

- `catalog.json`: 생성 정책과 하네스 항목 종류 예약
- `schema.json`: 목록·상세 JSON의 공개 규격
- 생성: `pnpm build:registry`
- 검증: `pnpm test:registry`
- 결과: 루트 `.artifacts/registry/`

CLI·하네스 담당자가 연결할 필드와 파일 경로·버전·해시 계약은 [레지스트리 지침](../../Agent/registry.md)에 있어요. CLI 연동과 GitHub Release 게시는 아직 준비 중이에요.
