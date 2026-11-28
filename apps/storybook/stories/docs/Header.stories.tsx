import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header, HeaderAction } from '@/apps/docs/frontend/layouts/Header/Header';
import type { HeaderLink, HeaderProps } from '@/apps/docs/frontend/layouts/Header/Header.types';
import { StoryCase, StoryOverview, StoryPreviewLayout } from '../../components/StoryDeviceFrame.js';
import './DocsWebsite.stories.css';

const links = [
  { label: '시작하기', href: '#getting-started' },
  { label: 'Foundation', href: '#foundation' },
  { label: 'Components', href: '#components' },
];

type HeaderStoryProps = HeaderProps & { previewWidth: number };

function HeaderPreview({ previewWidth, ...props }: HeaderStoryProps) {
  const [feedback, setFeedback] = useState('');
  return (
    <div className="docs-web-story__surface" style={{ width: previewWidth }}>
      <Header
        {...props}
        menuAction={<HeaderAction action="menu" onClick={() => setFeedback('메뉴 슬롯에 연결한 클릭 동작을 실행했어요.')} />}
        searchAction={<HeaderAction action="search" onClick={() => setFeedback('검색 슬롯에 연결한 클릭 동작을 실행했어요.')} />}
      />
      <p aria-live="polite" className="docs-web-story__feedback">{feedback}</p>
    </div>
  );
}

const meta = {
  title: '문서 웹사이트/Header', component: Header,
  args: { links, previewWidth: 1012, homeHref: '/', githubHref: 'https://github.com/ELI-team/ELI' },
  argTypes: {
    links: { name: '탐색 링크', control: false, description: '왼쪽 편집 영역에서 항목을 추가·수정·삭제해요.' },
    previewWidth: { name: '미리보기 너비', control: { type: 'range', min: 320, max: 1200, step: 1 } },
    homeHref: { name: '홈 주소', control: 'text' }, githubHref: { name: 'GitHub 주소', control: 'text' },
    searchAction: { table: { disable: true } }, menuAction: { table: { disable: true } },
  },
  render: args => <HeaderPreview {...args} />,
} satisfies Meta<HeaderStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: '한눈에 보기', parameters: { controls: { disable: true } },
  render: () => (
    <StoryOverview description="헤더의 탐색 링크와 버튼 연결 영역을 확인해요. 실제 메뉴·모바일 검색은 Interactions에서 조작해요.">
      <StoryCase title="PC"><HeaderPreview links={links} previewWidth={1012} /></StoryCase>
      <StoryCase title="모바일"><HeaderPreview links={links} previewWidth={375} /></StoryCase>
    </StoryOverview>
  ),
};

export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Playground(args) {
    const [, updateArgs] = useArgs<HeaderStoryProps>();
    const currentLinks = args.links ?? [];
    const updateLink = (index: number, update: Partial<HeaderLink>) => updateArgs({
      links: currentLinks.map((link, i) => i === index ? { ...link, ...update } : link),
    });
    return (
      <StoryPreviewLayout editor={(
        <div className="docs-web-story__editor">
          <strong>탐색 링크 편집</strong>
          {currentLinks.map((link, index) => (
            <fieldset key={index}>
              <legend>링크 {index + 1}</legend>
              <label>문구<input value={link.label} onChange={event => updateLink(index, { label: event.currentTarget.value })} /></label>
              <label>주소<input value={link.href} onChange={event => updateLink(index, { href: event.currentTarget.value })} /></label>
              <button type="button" onClick={() => updateArgs({ links: currentLinks.filter((_, i) => i !== index) })}>삭제</button>
            </fieldset>
          ))}
          <button type="button" onClick={() => updateArgs({ links: [...currentLinks, { label: '새 링크', href: `#link-${Date.now()}` }] })}>링크 추가</button>
        </div>
      )}>
        <HeaderPreview {...args} />
      </StoryPreviewLayout>
    );
  },
};
