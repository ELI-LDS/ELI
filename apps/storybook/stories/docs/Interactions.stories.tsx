import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from '@/apps/docs/frontend/layouts/Header/Header';
import { MobileMenu } from '@/apps/docs/frontend/features/docs-navigation/MobileMenu';
import { DocsNavigationView } from '@/apps/docs/frontend/features/docs-navigation/DocsNavigation';
import { DocsSearch } from '@/apps/docs/frontend/features/docs-search/DocsSearch';
import { FilterExample } from '@/apps/docs/frontend/pages/components/examples/chip/filter/FilterExample';
import { StoryCase, StoryOverview, StoryPreviewLayout } from '../../components/StoryDeviceFrame.js';
import './Interactions.stories.css';

interface InteractionProps { kind: 'menu' | 'search' | 'filter'; width: number }

/** 모바일 프레임 안에 오버레이도 함께 배치해 Canvas 전체를 가리지 않아요. */
function InteractionPreview({ kind, width }: InteractionProps) {
  const [selected, setSelected] = useState('/foundation/color');
  return <div className="docs-interaction-story" data-docs-overlay-host style={{ width }}>
    {kind === 'filter' ? <div className="docs-interaction-story__filter"><FilterExample /></div> : <Header
      menuAction={<MobileMenu navigation={close => <DocsNavigationView navigate={value => { setSelected(value); close(); }} selected={selected} variant="mobile" />} />}
      searchAction={<DocsSearch />}
    />}
  </div>;
}

const meta = {
  title: '문서 웹사이트/Interactions', component: InteractionPreview,
  args: { kind: 'menu', width: 375 },
  argTypes: {
    kind: { name: '확인할 화면', options: ['menu', 'search', 'filter'], control: 'select' },
    width: { name: '모바일 화면 너비', control: { type: 'range', min: 320, max: 430, step: 1 } },
  },
  render: args => <StoryPreviewLayout><InteractionPreview {...args} /></StoryPreviewLayout>,
} satisfies Meta<InteractionProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { name: '한눈에 보기', parameters: { controls: { disable: true } }, render: () => <StoryOverview description="메뉴·검색·필터의 열기와 닫기를 실제로 조작해요. 검색 결과를 선택하면 해당 문서 주소로 이동해요.">
  {(['menu', 'search', 'filter'] as const).map((kind, index) => <StoryCase key={kind} title={['햄버거 메뉴', '모바일 검색', '필터 바텀시트'][index] ?? kind}><InteractionPreview kind={kind} width={375} /></StoryCase>)}
</StoryOverview> };
export const Playground: Story = { name: '직접 바꿔보기' };
