# ELI 선택 설치 데이터

기존 컴포넌트 소스에서 CLI용 JSON을 만드는 비공개 배포 도구 영역이에요. npm 패키지나 CLI 실행 파일이 아니에요.

- `catalog.json`: 생성 정책과 하네스 항목 종류 예약
- `schema.json`: 목록·상세 JSON의 공개 규격
- 생성: `pnpm build:registry`
- 검증: `pnpm test:registry`
- 결과: 루트 `.artifacts/registry/`

기본 배포 방향은 [프로젝트 구조](../../Agent/architecture.md#소스-설치를-기본으로-준비해요), 설치 도구의 이름과 공개 명령은 [패키지 매니저 지침](../../Agent/package-managers.md#소스-추가를-기본-소비-방식으로-준비해요)을 따라요. 필드·파일·버전·해시와 하네스 호출 계약은 [레지스트리 지침](../../Agent/registry.md)에서 관리해요. [CLI](../cli/README.md)의 개별·다중·전체 소스 추가는 저장소에서 실행할 수 있고, CLI npm 게시와 GitHub Release 콘텐츠 게시는 아직 준비 중이에요.
