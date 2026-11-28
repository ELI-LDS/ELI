# Chip 역할 통합 · 2026-11-28 사용자 확정

기존 [디자이너 원문](chip.md)의 사용 목적·디자인·상호작용을 유지하며, 아래 사용자 요청으로 공개 API를 변경해요. 원문은 수정하지 않아요.

공개 API를 `Chip` 하나로 통합해요. 위 원문의 세 역할·디자인·상호작용은 유지하며 이름만 다음처럼 대응해요.

| 이전 이름 | 현재 사용법 |
| --- | --- |
| Chip | `<Chip variant="selectable">라벨</Chip>` (variant 생략 가능) |
| FilterChip | `<Chip variant="filter" label="컬러" options={options} />` |
| RemovableChip | `<Chip variant="removable" onRemove={removeTag}>라벨</Chip>` |

설치는 `add chip` 한 번으로 세 역할을 모두 제공해요. `filter-chip`·`removable-chip`은 별도 공개 설치 항목이 아니에요. 선택형 최대 너비 160px·필터형과 삭제형 최대 너비 180px, 역할별 DOM·이벤트 대상은 유지해요.
