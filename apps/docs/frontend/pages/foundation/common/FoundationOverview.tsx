/** 개념별 역할을 짧게 나눠 긴 도입 문단을 훑어 읽을 수 있게 해요. */
export function FoundationOverview({ items }: { items: readonly { name: string; description: string }[] }) {
  return <dl className="foundation-overview">{items.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.description}</dd></div>)}</dl>;
}
