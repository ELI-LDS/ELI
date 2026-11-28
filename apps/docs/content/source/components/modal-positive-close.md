# Modal Positive 닫힘 · 2026-11-28 사용자 확정

기존 [디자이너 원문](modal.md)의 디자인·슬롯·크기는 유지하며 Positive 버튼도 누르면 닫히도록 변경해요.

- Positive는 onPositiveAction을 먼저 실행하고 event.preventDefault()를 호출하지 않았다면 닫기를 요청해요.
- Secondary도 기존처럼 콜백 실행 후 닫으며 같은 취소 방법을 사용해요.
- 비제어 모달은 내부 상태를 닫고, 제어 모달은 onOpenChange(false)를 부모가 반영해요.
- 비동기 작업을 마친 뒤 닫으려면 await 전에 event.preventDefault()를 호출하고 성공한 뒤 open을 갱신해요. Promise 완료나 작업 성공 여부를 Modal이 판단하지 않아요.
- 닫힌 뒤 포커스 복귀·배경 조작/스크롤 잠금 해제를 유지해요. 원본 Markdown은 수정하지 않아요.
