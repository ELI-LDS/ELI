# ELI 선택 설치 데이터

기존 컴포넌트 소스에서 CLI용 JSON을 만드는 비공개 배포 도구 영역이에요. npm 패키지나 CLI 실행 파일이 아니에요.

- `catalog.json`: 생성 정책·공유 토큰·기본 설치에 함께 제공할 조립 부품·하네스 항목 종류 예약
- `schema.json`: 텍스트 v1·WOFF2 포함 v2 목록·상세 JSON의 공개 규격
- 생성: `pnpm build:registry`
- 검증: `pnpm test:registry`
- 결과: 루트 `.artifacts/registry/`

기본 배포 방향은 [프로젝트 구조](../../Agent/architecture.md#소스-설치를-기본으로-사용해요), 설치 도구의 이름과 공개 명령은 [패키지 매니저 지침](../../Agent/package-managers.md#소스-추가를-기본-소비-방식으로-사용해요)을 따라요. 필드·파일·버전·해시와 하네스 호출 계약은 [레지스트리 지침](../../Agent/registry.md)에서 관리해요. [CLI](../cli/README.md)는 npm에, UI·하네스 콘텐츠는 GitHub Release에 공개됐어요. 사용자 실행 방법은 CLI README, 실제 게시·검증 범위는 [릴리스 기록](../../handbook/releases/0.2.0.md)에서 확인해요.

폰트는 별도 shared 항목으로 원본 WOFF2·OFL 라이선스를 제공해요. 기존 Pretendard가 없을 때 같은 원본을 로딩하며, v2 바이너리·원본 해시·기존 콘텐츠 호환은 [폰트 전달 계약](../../Agent/registry.md#폰트-바이너리는-v2로-전달해요)을 따라요. 현재 공개 v1을 덮어쓰거나 미게시 후보를 지원 완료로 안내하지 않아요.
