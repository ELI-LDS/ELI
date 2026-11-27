export const typographySections = {
  heading: { id: 'heading', title: 'Heading', description: '페이지와 섹션의 제목에 사용해요. 콘텐츠의 위계에 맞춰 크기를 선택해요.', sample: '페이지 제목' },
  body: { id: 'body', title: 'Body', description: '설명과 문단 등 본문을 읽기 쉽게 전달해요.', sample: '필요한 컴포넌트를 조합해 화면을 만들어요. 같은 텍스트 스타일을 사용하면 여러 화면에서도 정보의 위계를 일정하게 유지할 수 있어요.' },
  label: { id: 'label', title: 'Label', description: '버튼·입력 필드·선택 항목의 이름처럼 짧은 UI 문구에 사용해요.', sample: '버튼과 입력 항목' },
};
export const typographyHeadings = [{ id: 'usage', title: '사용 방법' }, ...Object.values(typographySections).map(({ id, title }) => ({ id, title }))];
